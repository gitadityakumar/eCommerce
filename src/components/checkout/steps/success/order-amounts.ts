interface OrderWithAmounts {
  totalAmount: unknown;
  items: Array<{
    priceAtPurchase: unknown;
    quantity: number;
  }>;
}

export function getOrderAmounts(order: OrderWithAmounts) {
  const subtotal = order.items.reduce((acc, item) => acc + (Number(item.priceAtPurchase) * item.quantity), 0);
  const total = Number(order.totalAmount);

  return {
    subtotal,
    total,
    extra: total - subtotal,
  };
}
