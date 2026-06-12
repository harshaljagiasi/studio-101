"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function to prevent background scrolling when menu is open
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F4F2EE]/90 premium-blur border-b border-[#1A1A1A]/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section (Elevated z-index to stay above mobile menu) */}
        <Link href="/" onClick={closeMenu} className="flex items-center group relative z-[60]">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden relative shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:shadow-xl cursor-pointer bg-[#E6E2DA]">
            <img 
              src="/images/ui-assets/logo.jpeg" 
              alt="Studio 101 Logo" 
              className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-700 group-hover:rotate-3" 
              style={{ objectPosition: '50% 50%', transform: 'scale(1.70)' }} 
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Desktop CTA Button */}
        <div className="hidden md:block relative z-[60]">
          <Link href="/booking" className="bg-[#1A1A1A] text-[#F4F2EE] px-6 py-3 rounded-none text-xs font-medium tracking-widest uppercase transition-all duration-500 hover:bg-[#333333] hover:shadow-[0_8px_20px_rgb(26,26,26,0.25)] hover:-translate-y-0.5 inline-block">
            Book Now
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden relative z-[60] text-[#1A1A1A] p-2 focus:outline-none"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-2xl transition-transform duration-300`}></i>
        </button>
      </div>

      {/* Mobile Full-Screen Menu Overlay */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen bg-[#F4F2EE] flex flex-col justify-center items-center space-y-8 transition-transform duration-700 z-[55] ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <Link href="/" onClick={closeMenu} className="text-2xl font-serif tracking-wide text-[#1A1A1A] hover:text-amber-700 transition-colors">Home</Link>
        <Link href="/#spaces" onClick={closeMenu} className="text-2xl font-serif tracking-wide text-[#1A1A1A] hover:text-amber-700 transition-colors">Explore Spaces</Link>
        <Link href="/booking" onClick={closeMenu} className="text-2xl font-serif tracking-wide text-[#1A1A1A] hover:text-amber-700 transition-colors">Book Slots</Link>
        <Link href="/contact" onClick={closeMenu} className="text-2xl font-serif tracking-wide text-[#1A1A1A] hover:text-amber-700 transition-colors">Contact & Support</Link>
        
        <div className="pt-8">
          <Link href="/booking" onClick={closeMenu} className="bg-[#1A1A1A] text-[#F4F2EE] px-10 py-4 rounded-none text-sm font-medium tracking-widest uppercase transition-all duration-500 hover:bg-[#333333] shadow-xl">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}