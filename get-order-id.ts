/* eslint-disable no-console */
import { getOrders } from './src/actions/orders';

async function main() {
  const orders = await getOrders();
  console.log('Orders:', JSON.stringify(orders.slice(0, 5), null, 2));
}

main().catch(console.error);
