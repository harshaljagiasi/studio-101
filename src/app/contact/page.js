"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Connected to your database

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Push the payload to your new Supabase table
    const { error } = await supabase.from('contact_queries').insert([{
      name: name,
      email: email,
      subject: subject,
      message: message
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert('Communication node failed. Please try again or use the direct hotline.');
      return;
    }

    // Success UI & Reset
    alert('Inquiry log transferred safely into standard staging queue. Our desk will contact you shortly.');
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <section className="py-24 bg-[#1A1A1A] text-[#F4F2EE] min-h-screen relative overflow-hidden flex items-center">
      
      {/* Decorative Breathing Accent */}
      <div className="absolute -bottom-16 -right-16 w-96 h-96 border border-white/5 rounded-full pointer-events-none animate-pulse duration-1000"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none transition-all duration-[3000ms] hover:scale-150"></div>
      
      <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 w-full transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Left Info Deck Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#F4F2EE]/50 font-medium">Have queries regarding a specific detail?</p>
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-white transition-all duration-500 hover:text-white/80 cursor-default">Let's Connect.</h2>
            <div className="w-12 h-[1px] bg-white/20 pt-2"></div>
          </div>

          <p className="text-sm text-[#F4F2EE]/70 font-light leading-relaxed">
            Planning a multi-day high budget catalog campaign or an atypical setup configuration? Our technical logistics management desk is online to organize specific arrangements for you.
          </p>

          <div className="space-y-4 pt-4">
            {/* UPDATED HOTLINE LINK AND TEXT */}
            <a href="tel:+916001535455" className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-500 group hover:-translate-y-1 hover:shadow-lg rounded-sm">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F4F2EE]/40 font-medium">Direct Booking Hotline</p>
                <p className="text-sm font-medium tracking-wide text-white group-hover:text-amber-100 transition-colors">+91 6001 53 54 55</p>
              </div>
            </a>
            
            {/* UPDATED EMAIL TEXT */}
            <a href="mailto:mailtostudio1o1@gmail.com" className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-500 group hover:-translate-y-1 hover:shadow-lg rounded-sm">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F4F2EE]/40 font-medium">Electronic Inquiry Desk</p>
                <p className="text-sm font-medium tracking-wide text-white group-hover:text-amber-100 transition-colors">mailtostudio1o1@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Input Form Right Column */}
        <div className={`lg:col-span-7 bg-white/5 p-8 border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <h3 className="font-serif text-2xl mb-6 font-light">Forward a Message Block</h3>
          
          <form onSubmit={handleInquirySubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name" 
                  className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-xs placeholder-white/30 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 rounded-none transition-all duration-300 hover:bg-white/10" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-xs placeholder-white/30 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 rounded-none transition-all duration-300 hover:bg-white/10" 
                />
              </div>
            </div>
            <div>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject / Brand Type" 
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-xs placeholder-white/30 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 rounded-none transition-all duration-300 hover:bg-white/10" 
              />
            </div>
            <div>
              <textarea 
                rows="4" 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your creative configuration parameters..." 
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-xs placeholder-white/30 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 rounded-none resize-none transition-all duration-300 hover:bg-white/10"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-[#1A1A1A] py-4 text-xs uppercase tracking-widest font-bold transition-all duration-500 hover:bg-[#F4F2EE] hover:shadow-[0_8px_30px_rgb(255,255,255,0.15)] hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Send Query'}</span>
              <div className="absolute inset-0 bg-black/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}