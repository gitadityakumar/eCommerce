import type { getOrderById } from '@/actions/orders';
import type { getStoreSettings } from '@/actions/settings';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { numberToWords } from '@/lib/number-to-words';

// Register Roboto font for better character support (especially ₹ symbol)
// Using local paths for better reliability and to avoid "Unknown font format" errors
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ],
});

type OrderData = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;
type StoreSettings = Awaited<ReturnType<typeof getStoreSettings>>;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Roboto',
    color: '#333',
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 40,
    borderBottom: '0.5pt solid #eee',
    paddingBottom: 15,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 45,
    height: 'auto',
  },
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 2,
    color: '#111',
    textTransform: 'uppercase',
  },
  storeInfo: {
    textAlign: 'right',
  },
  storeDetail: {
    color: '#666',
    fontSize: 7,
    marginBottom: 1,
    lineHeight: 1.5,
  },
  taxInvoiceLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#999',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  invoiceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    border: '0.5pt solid #eee',
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    fontWeight: 400,
  },
  boldText: {
    fontWeight: 700,
    color: '#000',
  },
  addressSection: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 30,
  },
  addressBox: {
    flex: 1,
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000',
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 700,
    color: '#000',
    backgroundColor: '#fafafa',
    fontSize: 8,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #eee',
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  colHSN: { width: '40pt', textAlign: 'center' },
  colDesc: { flex: 1, paddingRight: 10 },
  colQty: { width: '40pt', textAlign: 'center' },
  colPrice: { width: '80pt', textAlign: 'right' },
  colTotal: { width: '80pt', textAlign: 'right' },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  wordsSection: {
    width: '55%',
  },
  totalsSection: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    fontSize: 8,
    color: '#666',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTop: '1pt solid #000',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 700,
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '0.5pt solid #eee',
    paddingTop: 15,
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 7,
    marginBottom: 2,
  },
  signatoryBox: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 9,
  },
  signatoryLine: {
    marginTop: 30,
    borderTop: '0.5pt solid #333',
    width: '120pt',
    marginLeft: 'auto',
  },
});

function formatINR(amount: number) {
  // Use Unicode escape sequence \u20B9 for the Rupee symbol to prevent encoding issues
  return `\u20B9${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function ReceiptDocument({ order, settings }: { order: OrderData; settings: StoreSettings }) {
  const subtotal = order.items.reduce((acc, item) => acc + (Number(item.priceAtPurchase) * item.quantity), 0);
  const total = Number(order.totalAmount);
  const extra = total - subtotal;

  // Tax calculation (flat 18% GST)
  const taxableValue = subtotal / 1.18;
  const totalGST = subtotal - taxableValue;

  return (
    <Document title={`Invoice-${order.id.slice(0, 8).toUpperCase()}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src="/recipt-logo.png" style={styles.logo} />
            <Text style={styles.brandName}>{settings?.storeName || 'PREETY TWIST'}</Text>
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.taxInvoiceLabel}>Tax Invoice</Text>
            {settings?.address && (
              <Text style={styles.storeDetail}>
                {settings.address}
              </Text>
            )}
            {(settings?.city || settings?.state || settings?.pincode) && (
              <Text style={styles.storeDetail}>
                {settings.city}
                {settings.city && ', '}
                {settings.state}
                {' '}
                {settings.pincode}
              </Text>
            )}
            <Text style={styles.storeDetail}>GSTIN: 24AAACP1234A1Z5</Text>
            <Text style={styles.storeDetail}>
              {settings?.storeEmail || 'contact@preetytwist.com'}
              {' | '}
              {settings?.storePhone || '+91 98765 43210'}
            </Text>
          </View>
        </View>

        {/* Invoice Banner */}
        <View style={styles.invoiceBanner}>
          <View>
            <Text style={styles.sectionTitle}>Invoice Number</Text>
            <Text style={[styles.infoText, styles.boldText]}>
              PTB/2026/
              {order.id.slice(0, 8).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Order Date</Text>
            <Text style={styles.infoText}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Payment Status</Text>
            <Text style={[styles.infoText, { color: '#059669', fontWeight: 700 }]}>
              {order.payments[0]?.status.toUpperCase() || 'PAID'}
            </Text>
            <Text style={{ fontSize: 7, color: '#666', marginTop: 2 }}>
              Ref:
              {' '}
              {order.payments[0]?.id.slice(0, 12).toUpperCase() || 'TXN_SUCCESS'}
            </Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={[styles.infoText, styles.boldText]}>{order.user?.name || 'Valued Client'}</Text>
            <Text style={styles.infoText}>{order.user?.email}</Text>
            {order.shippingAddress?.phone && (
              <Text style={styles.infoText}>
                Ph: +91
                {order.shippingAddress.phone}
              </Text>
            )}
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.sectionTitle}>Ship To</Text>
            {order.shippingAddress
              ? (
                  <>
                    <Text style={styles.infoText}>{order.shippingAddress.line1}</Text>
                    {order.shippingAddress.line2 && <Text style={styles.infoText}>{order.shippingAddress.line2}</Text>}
                    <Text style={styles.infoText}>
                      {order.shippingAddress.city}
                      ,
                      {order.shippingAddress.state}
                      {' '}
                      {order.shippingAddress.postalCode}
                    </Text>
                  </>
                )
              : (
                  <Text style={styles.infoText}>Standard Boutique Pickup</Text>
                )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colHSN}>HSN</Text>
            <Text style={styles.colDesc}>Product Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Rate</Text>
            <Text style={styles.colTotal}>Amount</Text>
          </View>

          {order.items.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colHSN}>6204</Text>
              <View style={styles.colDesc}>
                <Text style={styles.boldText}>{item.variant?.product?.name || 'Artisan Product'}</Text>
                <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>
                  Selected Style:
                  {' '}
                  {item.variant?.color?.name}
                  {' '}
                  {item.variant?.size?.name ? `| Size: ${item.variant.size.name}` : ''}
                </Text>
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatINR(Number(item.priceAtPurchase))}</Text>
              <Text style={styles.colTotal}>{formatINR(Number(item.priceAtPurchase) * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Summary and Totals */}
        <View style={styles.summaryContainer}>
          <View style={styles.wordsSection}>
            <Text style={styles.sectionTitle}>Total Amount in Words</Text>
            <Text style={[styles.infoText, styles.boldText, { textTransform: 'uppercase', fontSize: 8 }]}>
              {numberToWords(total)}
            </Text>

            <View style={{ marginTop: 15 }}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={{ fontSize: 7, color: '#666' }}>
                1. Delivery within 5-7 business days.
              </Text>
              <Text style={{ fontSize: 7, color: '#666' }}>
                2. Goods once sold can only be exchanged within 7 days.
              </Text>
            </View>
          </View>

          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text>Taxable Value</Text>
              <Text>{formatINR(taxableValue)}</Text>
            </View>
            <View style={styles.taxRow}>
              <Text>GST (18%)</Text>
              <Text>{formatINR(totalGST)}</Text>
            </View>
            {extra !== 0 && (
              <View style={styles.totalRow}>
                <Text>Shipping Charges</Text>
                <Text>{formatINR(extra)}</Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text>Grand Total</Text>
              <Text>{formatINR(total)}</Text>
            </View>
          </View>
        </View>

        {/* Authorized Signatory */}
        <View style={styles.signatoryBox}>
          <Text style={{ fontSize: 8 }}>For PREETY TWIST BOUTIQUE</Text>
          <View style={styles.signatoryLine} />
          <Text style={{ fontSize: 8, marginTop: 4 }}>Authorized Signatory</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>This is a Computer Generated Tax Invoice. No signature is required.</Text>
          <Text style={styles.footerText}>Jurisdiction: Subject to Surendra Nagar, Gujarat jurisdiction only.</Text>
          <Text style={[styles.footerText, { marginTop: 5, color: '#000', fontWeight: 700 }]}>
            Thank you for your patronage!
          </Text>
        </View>
      </Page>
    </Document>
  );
}
