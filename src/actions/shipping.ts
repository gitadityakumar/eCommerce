'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not found in environment variables');
  }

  const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to authenticate with Shiprocket');
  }

  return data.token;
}

export async function checkShippingServiceability(deliveryPincode: string, declaredValue: number) {
  try {
    // 1. Get Store Settings for pickup pincode
    const settings = await db.query.storeSettings.findFirst();
    if (!settings?.pincode) {
      return { success: false, error: 'Store pickup pincode not configured' };
    }

    // 2. Authenticate with Shiprocket
    const token = await getShiprocketToken();

    // 3. Prepare dimensions and weight (Hardcoded as per user request)
    const weight = 0.3; // 300 gm = 0.3 kg
    const length = 15;
    const breadth = 10;
    const height = 6;

    // 4. Call Serviceability API
    const url = new URL(`${SHIPROCKET_API_URL}/courier/serviceability/`);
    url.searchParams.append('pickup_postcode', settings.pincode);
    url.searchParams.append('delivery_postcode', deliveryPincode);
    url.searchParams.append('weight', weight.toString());
    url.searchParams.append('cod', '0'); // only for prepaid orders.
    url.searchParams.append('declared_value', declaredValue.toString());
    url.searchParams.append('height', height.toString());
    url.searchParams.append('length', length.toString());
    url.searchParams.append('breadth', breadth.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to fetch shipping options' };
    }

    if (!data.status || data.status !== 200 || !data.data?.available_courier_companies) {
      return { success: false, error: 'No shipping partners available for this location' };
    }

    // 5. Transform data for UI
    const couriers = data.data.available_courier_companies.map((c: any) => ({
      id: c.courier_company_id.toString(),
      name: c.courier_name,
      price: Number(c.rate),
      time: c.etd || '2-4 Days',
      estimated_delivery_days: c.estimated_delivery_days,
      is_cod: c.cod === 1,
    }));

    return { success: true, data: couriers };
  }
  catch (error: any) {
    console.error('Shiprocket serviceability error:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function createShiprocketOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, orderId),
      with: {
        shippingAddress: true,
        user: true,
        items: {
          with: {
            variant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order || !order.shippingAddress) {
      throw new Error('Order or shipping address not found');
    }

    const token = await getShiprocketToken();

    // Format Date: YYYY-MM-DD HH:mm
    const date = new Date();
    const orderDate = `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0].substring(0, 5)}`;

    const orderItemsPayload = order.items.map(item => ({
      name: item.variant.product.name,
      sku: item.variant.sku,
      units: item.quantity,
      selling_price: Number(item.priceAtPurchase),
      discount: '',
      tax: '',
      hsn: '',
    }));

    const payload = {
      order_id: order.id,
      order_date: orderDate,
      pickup_location: 'Primary', // Assuming 'Primary' or fetch from store settings if we had a location name
      channel_id: '', // Optional
      comment: 'Order from Website',
      billing_customer_name: order.user?.name || order.shippingAddress.line1.substring(0, 10), // Fallback
      billing_last_name: '',
      billing_address: order.shippingAddress.line1,
      billing_address_2: order.shippingAddress.line2 || '',
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.postalCode,
      billing_state: order.shippingAddress.state,
      billing_country: order.shippingAddress.country,
      billing_email: order.user?.email || 'guest@example.com',
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: orderItemsPayload,
      payment_method: 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: Number(order.totalAmount),
      length: 15,
      breadth: 10,
      height: 6,
      weight: 0.5,
    };

    // 1. Create Order
    const createRes = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const createData = await createRes.json();
    if (!createData.order_id) {
      console.error('Shiprocket Create Order Failed:', createData);
      throw new Error(createData.message || 'Failed to create Shiprocket order');
    }

    const shiprocketOrderId = createData.order_id;
    const shiprocketShipmentId = createData.shipment_id;

    // 2. Assign AWB (Book Courier)
    // We need courier_company_id from order.
    let awbCode = null;
    let courierName = order.courierName;

    if (order.courierCompanyId) {
      const awbRes = await fetch(`${SHIPROCKET_API_URL}/courier/assign/awb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shiprocketShipmentId,
          courier_company_id: order.courierCompanyId,
        }),
      });
      const awbData = await awbRes.json();
      if (awbData.response && awbData.response.data) {
        awbCode = awbData.response.data.awb_code;
        courierName = awbData.response.data.courier_name || courierName;
      }
      else {
        console.error('Shiprocket AWB Assign Failed:', awbData);
        // We don't throw here, as order is created. We can retry AWB later or manual.
      }
    }

    // 3. Update Order in DB
    await db.update(orders).set({
      shiprocketOrderId: String(shiprocketOrderId),
      shiprocketShipmentId: String(shiprocketShipmentId),
      awbCode,
      courierName,
    }).where(eq(orders.id, orderId));

    return { success: true, shiprocketOrderId, awbCode };
  }
  catch (error: any) {
    console.error('Create Shiprocket Order Error:', error);
    return { success: false, error: error.message };
  }
}
