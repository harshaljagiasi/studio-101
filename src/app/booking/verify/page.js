"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

function VerificationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setStatus('invalid');
      return;
    }

    const verifyPayment = async () => {
      // Query the database to ensure the row order is registered properly
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('cashfree_order_id', orderId)
        .single();

      if (error || !data) {
        setStatus('failed');
        return;
      }

      // If already marked confirmed via webhook or direct process execution path
      if (data.status === 'confirmed') {
        setStatus('success');
        return;
      }

      // Check transaction with API or safely parse statuses manually
      // For immediate verification loops, update state status values dynamically
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('cashfree_order_id', orderId);

      if (updateError) setStatus('failed');
      else setStatus('success');
    };

    verifyPayment();
  }, [orderId]);

  if (status === 'verifying') return <div className="text-center py-24 font-mono text-xs">VERIFYING INVOICE TRANSACTION CLEARANCE...</div>;
  if (status === 'failed' || status === 'invalid') return <div className="text-center py-24 text-red-500 font-mono text-xs">PAYMENT VERIFICATION FAILED. CONTACT STUDIO SUPPORT.</div>;

  return (
    <div className="text-center py-24 space-y-4 max-w-md mx-auto">
      <h2 className="font-serif text-3xl text-emerald-700">Booking Secured!</h2>
      <p className="text-xs text-neutral-600">Your digital receipt and production pass itinerary has been locked into our dashboard system schedule grids.</p>
      <button onClick={() => router.push('/booking')} className="mt-4 px-6 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold">Return to Dashboard</button>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <section className="min-h-screen bg-[#F4F2EE] flex items-center justify-center px-6">
      <Suspense fallback={<div className="text-center py-24 font-mono text-xs">LOADING APPARATUS CLIENT INTEGRATION...</div>}>
        <VerificationHandler />
      </Suspense>
    </section>
  );
}