import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white/70 py-12 border-t border-white/5 text-sm tracking-wider">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full">

        {/* 1. Left Column: flex-1 ensures it takes exactly 1/3 of the space */}
        <div className="flex-1 flex items-center justify-center md:justify-start space-x-4 w-full">
          <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-sm bg-[#E6E2DA]">
            <img
              src="/images/ui-assets/logo.jpeg"
              alt="Studio 1O1 Logo"
              className="absolute inset-0 w-full h-full object-cover origin-center"
              style={{ objectPosition: '50% 50%', transform: 'scale(1.70)' }}
            />
          </div>
          {/* UPDATED: Applied the new Archivo Black styling (uppercase, tight tracking) */}
          <span className="text-white/90 font-serif uppercase tracking-tight text-base">@visit.studio1O1</span>
        </div>

        {/* 2. Middle Column: Added Privacy & Terms Links */}
        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-2">
          <p className="text-center font-normal text-[11px] md:text-xs text-white/50">
            © 2026 Studio 1O1. Built cleanly for verified production scale.
          </p>
          <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>

        {/* 3. Right Column: Social Links */}
        <div className="flex-1 flex justify-center md:justify-end space-x-6 text-white/90 text-lg w-full">
          <a href="https://www.instagram.com/visit.studio1o1/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://maps.app.goo.gl/1tJuM5U92rNLJf6BA" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
            <i className="fa-solid fa-location-dot"></i>
          </a>
        </div>

      </div>
    </footer>
  );
}