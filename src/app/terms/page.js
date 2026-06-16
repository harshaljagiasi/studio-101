import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <section className="py-32 bg-[#F4F2EE] min-h-screen text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="mb-16 space-y-4">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors flex items-center gap-2 mb-8">
            <i className="fa-solid fa-arrow-left"></i> Return Home
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tighter uppercase">Terms & Conditions</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60">Last Updated: June 2026</p>
        </div>

        <div className="space-y-12 text-sm md:text-base font-light leading-relaxed text-[#1A1A1A]/80">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">1. Booking & Payments</h2>
            <p>By reserving a slot through the Studio 1O1 platform, you agree to pay the total landed cost, including the base hourly rate and any selected hardware add-ons. Bookings are only considered fully secured once payment is successfully verified. We reserve the right to cancel any unverified reservations.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">2. Cancellations & Rescheduling</h2>
            <p>We understand that production schedules change. However, due to the high demand for our creative spaces:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cancellations made more than 48 hours in advance are eligible for a full refund or free rescheduling.</li>
              <li>Cancellations made within 48 hours of the booked slot may be subject to a cancellation fee or forfeiture of the booking amount.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">3. Studio Rules & Damages</h2>
            <p>When you step inside Studio 1O1, you agree to treat the facility, the Cyc Wall, and all hardware with professional care. You (the booking client) are fully liable for any physical damage caused to the studio infrastructure, props, or equipment by you or your crew during your reserved slot. The Cyc Wall must not be stepped on with dirty footwear.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">4. Overtime Policy</h2>
            <p>Your booking encompasses a specific time block. If your production runs past the booked time, you will be billed for overtime at our standard hourly rate, strictly subject to availability. If another creator has booked the subsequent slot, you must vacate the premises immediately upon your slot's conclusion.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">5. Liability Waiver</h2>
            <p>Studio 1O1 is not liable for any personal injury, loss, or damage to personal property or production files that occurs on our premises. Creators operate their own equipment and Studio 1O1 hardware at their own risk.</p>
          </section>

        </div>
      </div>
    </section>
  );
}