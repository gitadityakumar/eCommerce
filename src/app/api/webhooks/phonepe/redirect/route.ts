import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return handleRedirect(req);
}

export async function POST(req: NextRequest) {
  return handleRedirect(req);
}

async function handleRedirect(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || url.origin;

    // Some gateways pass status in query params for GET
    let code = url.searchParams.get('code');

    // If it's a POST request (like V1), try to get from form data
    if (req.method === 'POST') {
      try {
        const formData = await req.formData();
        if (!code)
          code = formData.get('code') as string;
      }
      catch {
        // Not form data or empty
      }
    }

    console.warn('PhonePe Redirect Handler:', {
      method: req.method,
      orderId,
      code,
    });

    // In V2, 'code' might be missing in the redirect URL if not explicitly asked.
    // However, if we reach here and have an orderId, we can assuming the redirect is the final step.
    // Real status is confirmed by the server-side webhook.

    // If code is present and is SUCCESS, or if we just want to show the status page:
    if (orderId) {
      if (code === 'PAYMENT_ERROR') {
        return NextResponse.redirect(`${baseUrl}/checkout?error=PaymentFailed`, 303);
      }
      // Often the redirect doesn't carry the "success" code, but just sends the user back.
      // We take them to the order confirmation page which should pull the status from the DB.
      return NextResponse.redirect(`${baseUrl}/checkout/success?orderId=${orderId}`, 303);
    }

    return NextResponse.redirect(`${baseUrl}/checkout?error=SomethingWentWrong`, 303);
  }
  catch (error) {
    console.error('Redirect Handler Error:', error);
    return NextResponse.redirect(new URL('/checkout?error=SomethingWentWrong', req.url));
  }
}
