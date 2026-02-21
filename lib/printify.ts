const PRINTIFY_BASE = 'https://api.printify.com/v1';

function headers() {
  return {
    Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function createPrintifyOrder(params: {
  externalId: string;
  label: string;
  lineItems: {
    productId: string;
    variantId: number;
    quantity: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    region: string;
    zip: string;
    country: string;
  };
}) {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  const res = await fetch(`${PRINTIFY_BASE}/shops/${shopId}/orders.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      external_id: params.externalId,
      label: params.label,
      line_items: params.lineItems.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
      shipping_method: 1,
      address_to: {
        first_name: params.shippingAddress.firstName,
        last_name: params.shippingAddress.lastName,
        email: params.shippingAddress.email,
        address1: params.shippingAddress.address1,
        address2: params.shippingAddress.address2,
        city: params.shippingAddress.city,
        region: params.shippingAddress.region,
        zip: params.shippingAddress.zip,
        country: params.shippingAddress.country,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Printify order creation failed: ${error}`);
  }

  return res.json();
}

export async function getPrintifyOrder(orderId: string) {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const res = await fetch(`${PRINTIFY_BASE}/shops/${shopId}/orders/${orderId}.json`, {
    headers: headers(),
  });

  if (!res.ok) throw new Error('Failed to fetch Printify order');
  return res.json();
}
