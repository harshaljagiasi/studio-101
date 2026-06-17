import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <section className="py-32 bg-[#F4F2EE] min-h-screen text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="mb-16 space-y-4">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors flex items-center gap-2 mb-8">
            <i className="fa-solid fa-arrow-left"></i> Return Home
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tighter uppercase">Privacy Policy</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60">Last Updated: June 2026</p>
        </div>

        <div className="space-y-12 text-sm md:text-base font-light leading-relaxed text-[#1A1A1A]/80">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">1. Information We Collect</h2>
            <p>Welcome to Studio 1O1. We collect information you provide directly to us when you utilize our booking engine, contact our support desk, or interact with our digital platform. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contact Data:</strong> Your full name, email address, and WhatsApp/phone number.</li>
              <li><strong>Booking Data:</strong> Dates, times, production purposes, and specific hardware requirements.</li>
              <li><strong>Financial Data:</strong> We do not store your raw payment details. All transactions are securely processed via verified third-party payment gateways (e.g., Cashfree).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">2. How We Use Your Information</h2>
            <p>We utilize the collected data strictly for operational and production scale requirements, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing your studio reservations and hardware add-ons.</li>
              <li>Sending automated booking confirmations and itineraries via WhatsApp.</li>
              <li>Responding to your specific technical logistics and inquiries.</li>
              <li>Improving our studio layout, hardware inventory, and overall digital experience.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">3. Data Storage & Security</h2>
            <p>Your booking and contact logs are securely transferred to and stored within our primary database (Supabase). We implement industry-standard security measures to prevent unauthorized access, alteration, or disclosure of your personal production data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">4. Third-Party Sharing</h2>
            <p>Studio 1O1 does not sell or rent your personal information. We only share data with trusted third-party nodes necessary to facilitate your booking, such as payment processors and automated communication APIs (e.g., WhatsApp integration).</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl uppercase tracking-tight text-[#1A1A1A]">5. Contact Our Desk</h2>
            <p>If you have any questions regarding this privacy policy or wish to request the deletion of your data from our staging queue, please contact our Electronic Inquiry Desk at <strong>mailtostudio1o1@gmail.com</strong>.</p>
          </section>

        </div>
      </div>
    </section>
  );
}