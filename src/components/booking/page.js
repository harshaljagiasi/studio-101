"use client"; // Required because of interactive state (useState)

import { useState } from 'react';

export default function BookingPage() {
  // React State replaces standard javascript variables
  const [selectedSetup, setSelectedSetup] = useState("Cyc Wall Setup");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notification, setNotification] = useState(null);

  // Calendar logic directly mapped
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const totalDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const blockedDays = [4, 12, 18, 19, 26]; // Randomly blocked out days
  const timeSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00'];

  const executeMockBooking = () => {
    if (!clientName || !clientPhone) {
      alert('Please register client parameter metrics completely to clear staging queue.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('Please map slot coordinates accurately (Date & Hour Block window).');
      return;
    }

    // Trigger WhatsApp Simulation Overlay
    setNotification({
      name: clientName,
      space: selectedSetup,
      day: selectedDate,
      time: selectedTime
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      setNotification(null);
    }, 8000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#F4F2EE] to-[#EAE6DF] relative min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-serif text-4xl font-normal tracking-tight">Reserve Production Time</h2>
          <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-widest">Select your schedule slots seamlessly below</p>
        </div>

        <div className="bg-[#F4F2EE] border border-[#1A1A1A]/10 shadow-2xl rounded-none p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden">
          
          {/* Interactive Selector: Left Column */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 mb-2 font-medium">1. Choose Production Setup</label>
              <select 
                value={selectedSetup}
                onChange={(e) => setSelectedSetup(e.target.value)}
                className="w-full bg-[#EAE6DF] border border-[#1A1A1A]/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-[#1A1A1A] rounded-none text-[#1A1A1A]"
              >
                <option value="Cyc Wall Setup">Full Cyc Wall & Continuous Studio Lighting Blocks</option>
                <option value="Editorial Minimalist Arch">Warm Minimalist Archway Studio Session</option>
                <option value="Modular Lounge Experience">The Creative Lounge Setup (Multi-Chair Config)</option>
                <option value="Backstage Hollywood Glam Session">Hollywood Lighted Mirror Studio Session</option>
              </select>
            </div>

            {/* Custom Built Date Grid Block */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium">2. Select Calendar Date</label>
                <span className="text-xs font-serif italic text-[#1A1A1A]/70">June 2026</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {/* Days Header */}
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="font-semibold text-[#1A1A1A]/40 pb-1 text-[10px]">{day}</div>
                ))}
                {/* 1 Spacer for Sunday starting */}
                <div></div>
                
                {/* Days Loop */}
                {totalDays.map(day => {
                  const isBlocked = blockedDays.includes(day);
                  const isSelected = selectedDate === day;
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSelectedDate(day)}
                      className={`py-2 rounded-none transition-all duration-150 font-medium text-xs focus:outline-none border border-[#1A1A1A]/5 
                        ${isBlocked ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/30 line-through cursor-not-allowed' : 
                          isSelected ? 'bg-[#1A1A1A] text-[#F4F2EE]' : 'bg-[#EAE6DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F2EE]'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots System Block */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 mb-2 font-medium">3. Available Hours Window</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`border border-[#1A1A1A]/10 py-2.5 text-xs tracking-wider font-medium transition-all duration-200 
                      ${selectedTime === slot ? 'bg-[#1A1A1A] text-[#F4F2EE]' : 'bg-[#EAE6DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F2EE]'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Logistics Data: Right Column */}
          <div className="md:col-span-5 bg-[#EAE6DF]/60 p-6 border-l border-[#1A1A1A]/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-serif text-lg tracking-wide border-b border-[#1A1A1A]/10 pb-2">Client Identification</h4>
              
              <div>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Full Name" 
                  className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-3 py-2.5 text-xs placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] rounded-none" 
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="WhatsApp Number (e.g. +91...)" 
                  className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-3 py-2.5 text-xs placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] rounded-none" 
                />
              </div>
              
              <div className="bg-[#F4F2EE] p-3 border border-[#1A1A1A]/5 space-y-1.5 text-[11px] text-[#1A1A1A]/70">
                <div className="flex justify-between"><span>Base Space Fee:</span><span className="font-medium">Calculated</span></div>
                <div className="flex justify-between text-[#1A1A1A]"><span>Automated WA Alert:</span><span className="text-emerald-700 font-semibold"><i className="fa-solid fa-circle-check mr-1"></i>Active</span></div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={executeMockBooking} 
              className="w-full bg-[#1A1A1A] text-[#F4F2EE] py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A]/80 transition-all duration-300 shadow-md"
            >
              Confirm Studio Booking
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATED WHATSAPP OVERLAY (Controlled by React State) */}
      <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white shadow-2xl border-l-4 border-emerald-500 rounded-none transition-all duration-500 transform ${notification ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
        <div className="p-4 relative">
          <button onClick={() => setNotification(null)} className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 text-xs"><i className="fa-solid fa-xmark"></i></button>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Studio 101 Dispatcher</p>
              <p className="text-xs text-neutral-800 leading-normal">
                <strong>Studio 101 Confirmed!</strong> Hey {notification?.name}, your booking slot for <strong>{notification?.space}</strong> on June {notification?.day}, 2026 during hours [{notification?.time}] has been successfully saved. — Team 101
              </p>
              <p className="text-[9px] text-neutral-400 pt-1">Just now • Automated Confirmation Engine</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}