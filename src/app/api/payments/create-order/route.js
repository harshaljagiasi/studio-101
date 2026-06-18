import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientPhone, clientName, clientEmail, fee } = body;

    // --- FIX: GENERATE UNIQUE ORDER ID HERE ---
    const orderId = `ST101_ORD_${Date.now()}`;

    const isProd = process.env.CASHFREE_ENV === 'production';
    const cashfreeUrl = isProd 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(fee),
      order_currency: 'INR',
      customer_details: {
        customer_id: clientPhone.replace(/[^0-9]/g, ''), 
        customer_name: clientName,
        customer_email: clientEmail || "no-email@studio1o1.com",
        customer_phone: clientPhone,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/verify?order_id={order_id}`,
      }
    };

    const response = await fetch(cashfreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderPayload),
    });

    const cashfreeData = await response.json();

    if (!response.ok) {
      // This throws the exact error from Cashfree back to the frontend
      throw new Error(cashfreeData.message || 'Cashfree Order creation failed');
    }

    return NextResponse.json({ 
      paymentSessionId: cashfreeData.payment_session_id 
    });

  } catch (error) {
    console.error('Order Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}