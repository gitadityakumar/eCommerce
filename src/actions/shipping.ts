'use server';

import { db } from '@/lib/db';

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
