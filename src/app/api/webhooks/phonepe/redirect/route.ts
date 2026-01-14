import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const code = formData.get('code');
    // const merchantTransactionId = formData.get('merchantTransactionId'); // e.g. MT...

    // We embedded orderId in the URL query params
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    if (code === 'PAYMENT_SUCCESS' && orderId) {
      return NextResponse.redirect(`${url.origin}/order-confirmation/${orderId}`, 303);
    }
    else if (code === 'PAYMENT_ERROR') {
      return NextResponse.redirect(`${url.origin}/checkout?error=PaymentFailed`, 303);
    }
    else {
      // Default fallback
      return NextResponse.redirect(`${url.origin}/checkout?error=PaymentCancelled`, 303);
    }
  }
  catch (error) {
    console.error('Redirect Handler Error:', error);
    return NextResponse.redirect(new URL('/checkout?error=SomethingWentWrong', req.url));
  }
}
