import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const headers = request.headers;
    const signature = headers.get('x-webhook-signature');
    const timestamp = headers.get('x-webhook-timestamp');

    const bodyStr = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(bodyStr)
      .digest('base64');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    
    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = payload.data.order.order_id;
      
      const { error: dbError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('cashfree_order_id', orderId);

      if (dbError) throw dbError;
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}