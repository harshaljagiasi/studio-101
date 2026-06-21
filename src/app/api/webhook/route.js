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
      const customerName = payload.data.customer_details.customer_name || "Creator";
      const customerEmail = payload.data.customer_details.customer_email;
      
      // 1. Update your Supabase Database
      const { error: dbError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('cashfree_order_id', orderId);

      if (dbError) throw dbError;

      // 2. Fire the Automated Email Receipt via Resend API
      // Only send if the customer actually provided an email
      if (customerEmail && customerEmail !== "no-email@studio1o1.com") {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // Uses your newly verified custom domain!
            from: 'Studio 101 <bookings@studio1o1.com>', 
            to: customerEmail, 
            subject: `Studio 101 - Booking Confirmed (${orderId})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F4F2EE; color: #1A1A1A;">
                <h2 style="text-transform: uppercase; letter-spacing: 2px; font-size: 14px; color: #1A1A1A80; border-bottom: 1px solid #1A1A1A1A; padding-bottom: 10px;">Booking Receipt</h2>
                <h1 style="font-size: 24px; margin-top: 20px;">Slot Secured, ${customerName}!</h1>
                <p>Your payment was successful and your studio time is officially locked in.</p>
                
                <div style="background-color: #ffffff; padding: 15px; margin-top: 20px; border: 1px solid #1A1A1A1A;">
                  <p style="margin: 0; font-family: monospace; font-size: 12px;"><strong>Order Reference:</strong> ${orderId}</p>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #1A1A1A80;">We look forward to seeing you at the studio.</p>
              </div>
            `
          })
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}