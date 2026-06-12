import Link from 'next/link';

export default function Footer() {
  return (
    // 1. Increased base text opacity from white/40 to white/70 and size to text-sm
    <footer className="bg-[#121212] text-white/70 py-12 border-t border-white/5 text-sm tracking-wider">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex flex-col items-center justify-center text-[5px] text-white font-bold leading-none">
            <span>101</span>
          </div>
          {/* 2. Brightened the left handle text */}
          <span className="text-white/90 font-serif lowercase text-base">@visit.studio101</span>
        </div>
        
        {/* 3. Increased middle text size from 11px to text-sm and made it slightly bolder (font-normal instead of font-light) */}
        <p className="text-center md:text-left font-normal text-sm">
          &copy; 2026 Studio 101. Built cleanly for verified production scale.
        </p>
        
        {/* 4. Increased icon size from text-sm to text-lg and brightened them */}
        <div className="flex space-x-6 text-white/90 text-lg">
          {/* 5. Updated the href to your exact Instagram URL */}
          <a href="https://www.instagram.com/visit.studio1o1/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <Link href="/contact" className="hover:text-white hover:scale-110 transition-all">
            <i className="fa-solid fa-location-dot"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
