import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-io'; // Double-check your local configuration path

// Initialize server-side Supabase using service role or standard keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, clientEmail, bookingDate, selectedTimes, purpose, customPurpose, selectedEquipment, fee } = body;

    // 1. Generate a unique Order ID for tracking
    const orderId = `ST101_ORD_${Date.now()}`;

    // 2. Determine Cashfree Base URL based on Environment
    const isProd = process.env.CASHFREE_ENV === 'production';
    const cashfreeUrl = isProd 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    // 3. Request Payment Session from Cashfree API
    const response = await fetch(cashfreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(fee),
        order_currency: 'INR',
        customer_details: {
          customer_id: clientPhone.replace(/[^0-9]/g, ''), 
          customer_name: clientName,
          customer_email: clientEmail,
          customer_phone: clientPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/verify?order_id={order_id}`,
        },
      }),
    });

    const cashfreeData = await response.json();

    if (!response.ok) {
      throw new Error(cashfreeData.message || 'Cashfree Order creation failed');
    }

    // 4. Create pending booking entry in Supabase database
    const { error: dbError } = await supabase.from('bookings').insert([{
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      booking_date: bookingDate,
      time_slots: selectedTimes,
      purpose: purpose,
      custom_purpose: purpose === "Other (Custom)" ? customPurpose : null,
      equipment_addons: selectedEquipment,
      fee: fee,
      status: 'pending', // Keeps slots reserved or waiting for clearance confirmation
      cashfree_order_id: orderId,
      payment_session_id: cashfreeData.payment_session_id
    }]);

    if (dbError) throw dbError;

    return NextResponse.json({ 
      paymentSessionId: cashfreeData.payment_session_id,
      orderId: orderId 
    });

  } catch (error) {
    console.error('Order Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}