import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white/40 py-12 border-t border-white/5 text-xs tracking-wider">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/5 flex flex-col items-center justify-center text-[5px] text-white font-bold leading-none">
            <span>101</span>
          </div>
          <span className="text-white/60 font-serif lowercase">@visit.studio101</span>
        </div>
        
        <p className="text-center md:text-left font-light text-[11px]">
          &copy; 2026 Studio 101. Built cleanly for verified production scale.
        </p>
        
        <div className="flex space-x-6 text-white/60 text-sm">
          <a href="https://instagram.com/visit.studio101" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <Link href="/contact" className="hover:text-white transition-colors">
            <i className="fa-solid fa-location-dot"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
