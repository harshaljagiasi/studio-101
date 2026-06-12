"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* HERO CANVAS SECTION */}
      <section id="home" className="relative pt-12 min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAE6DF] via-[#F4F2EE] to-[#E3DDD5] ambient-hero">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[#E6E1DA] opacity-40 rounded-l-[200px] pointer-events-none transform translate-x-20 transition-transform duration-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className={`inline-flex items-center space-x-2 bg-[#1A1A1A]/5 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-[#1A1A1A]/70 transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span>Stating to be one of a kind</span>
              <span className="text-amber-500 animate-pulse">✨</span>
            </div>
            
            <h1 className={`font-serif text-5xl md:text-7xl font-normal tracking-tight text-[#1A1A1A] leading-[1.1] transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Built for Creators,<br />
              <span className="italic font-light text-[#1A1A1A]/80">Brands & Real Stories.</span>
            </h1>
            
            <p className={`max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-[#1A1A1A]/60 font-light leading-relaxed transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Welcome to Studio 101, where every corner tells a story and your vision comes to life. Your content gets a whole unique personality the moment you step inside.
            </p>
            
            <div className={`pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a href="#spaces" className="w-full sm:w-auto text-center border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3.5 uppercase text-xs font-medium tracking-widest transition-all duration-500 hover:bg-[#1A1A1A] hover:text-[#F4F2EE] hover:shadow-lg hover:-translate-y-1">
                Explore Spaces
              </a>
              <Link href="/booking" className="w-full sm:w-auto text-center bg-[#1A1A1A] text-[#F4F2EE] px-8 py-3.5 uppercase text-xs font-medium tracking-widest transition-all duration-500 hover:bg-[#333333] hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                <span className="relative z-10">Reserve a Slot</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </Link>
            </div>
          </div>

          <div className={`lg:col-span-5 relative transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-transparent to-[#1A1A1A]/10 rounded-t-[160px] overflow-hidden p-3 border border-[#1A1A1A]/5 shadow-2xl hover:shadow-3xl transition-shadow duration-700">
              <div className="w-full h-full rounded-t-[150px] overflow-hidden bg-[#D2C9BE] relative group">
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 transition-transform duration-[20s] group-hover:scale-110" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?q=80&w=600&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#F4F2EE]/90 premium-blur border border-white/20 shadow-lg transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                  <p className="font-serif text-lg italic">"Without you, it's just walls."</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 mt-1">Studio 101 Creative Engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE SPACES CONTENT GRID */}
      <section id="spaces" className="py-24 bg-[#EAE6DF] border-t border-[#1A1A1A]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight hover:scale-105 transition-transform duration-500 cursor-default">Explore Our Setup</h2>
            <div className="w-12 h-[1px] bg-[#1A1A1A]/40 mx-auto"></div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60">Every corner tells a completely unique story</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. THE CYC WALL */}
            <div className="bg-[#F4F2EE] p-4 border border-[#1A1A1A]/5 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/studio-rooms/DSC01877.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">The Cyc Wall</h3>
                <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 group-hover:text-amber-700 transition-colors duration-300">Infinite White Canvas</span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 mt-1 font-light">High-key production zone paired with professional softboxes and boom mounts for clean catalogs, high-end e-commerce, and brand lookbooks.</p>
            </div>

            {/* 2. EDITORIAL ARCH & PROPS */}
            <div className="bg-[#F4F2EE] p-4 border border-[#1A1A1A]/5 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/studio-rooms/props.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">Editorial Arch & Props</h3>
                <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 group-hover:text-amber-700 transition-colors duration-300">Warm Minimalism</span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 mt-1 font-light">Classic, clean molded structural alcove environments. Outfitted with high-seating bar stools and subtle design props for modern profile framing.</p>
            </div>

            {/* 3. THE CREATIVE LOUNGE */}
            {/* 3. THE PODCAST SUITE (Previously Creative Lounge) */}
            <div className="bg-[#F4F2EE] p-4 border border-[#1A1A1A]/5 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/studio-rooms/creative lounge.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">The Podcast Suite</h3>
                {/* The subtitle <span> tag has been completely removed here */}
              </div>
              <p className="text-xs text-[#1A1A1A]/60 mt-1 font-light">Acoustically friendly, multi-angle seating configurations designed specifically for premium video podcasts, high-end interviews, and deep-dive conversational content.</p>
            </div>

            {/* 4. GLAM & VANITY AREA */}
            <div className="bg-[#F4F2EE] p-4 border border-[#1A1A1A]/5 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/studio-rooms/vanity  room.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">Glam & Vanity Area</h3>
                <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 group-hover:text-amber-700 transition-colors duration-300">Backstage Premium</span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 mt-1 font-light">Hollywood bulb-lined preparation mirrors paired with playful staging props (including the iconic giant studio panda) for warm b-roll or getting-ready content.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}