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
              alt="Studio 101 Logo"
              className="absolute inset-0 w-full h-full object-cover origin-center"
              style={{ objectPosition: '50% 50%', transform: 'scale(1.70)' }}
            />
          </div>
          <span className="text-white/90 font-serif lowercase text-base">@visit.studio101</span>
        </div>

        {/* 2. Middle Column: flex-1 keeps it dead center, removed md:text-left */}
        <div className="flex-1 flex justify-center w-full">
          <p className="text-center font-normal text-sm">
            © 2026 Studio 101. Built cleanly for verified production scale.
          </p>
        </div>

        {/* 3. Right Column: flex-1 and md:justify-end pushes icons to the right edge */}
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