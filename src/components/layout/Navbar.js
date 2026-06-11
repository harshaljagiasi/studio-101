import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F4F2EE]/90 premium-blur border-b border-[#1A1A1A]/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center group">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden relative shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:shadow-xl cursor-pointer bg-[#E6E2DA]">
            <img 
              src="/images/ui-assets/logo.jpeg" 
              alt="Studio 101 Logo" 
              className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-700 group-hover:rotate-3" 
              style={{ objectPosition: '50% 50%', transform: 'scale(1.70)' }} 
            />
          </div>
        </Link>

        {/* Navigation Links with Animated Underlines */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.15em] uppercase text-[#1A1A1A]/70">
          <Link href="/" className="relative py-1 group hover:text-[#1A1A1A] transition-colors duration-300">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/#spaces" className="relative py-1 group hover:text-[#1A1A1A] transition-colors duration-300">
            Explore Spaces
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/booking" className="relative py-1 group hover:text-[#1A1A1A] transition-colors duration-300">
            Book Slots
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="relative py-1 group hover:text-[#1A1A1A] transition-colors duration-300">
            Contact & Support
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* CTA Button */}
        <div>
          <Link href="/booking" className="bg-[#1A1A1A] text-[#F4F2EE] px-6 py-3 rounded-none text-xs font-medium tracking-widest uppercase transition-all duration-500 hover:bg-[#333333] hover:shadow-[0_8px_20px_rgb(26,26,26,0.25)] hover:-translate-y-0.5 inline-block">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}