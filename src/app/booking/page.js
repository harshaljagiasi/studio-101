"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; 

export default function BookingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Dynamic Database Data & Hardcoded Equipment List
  const [equipmentList, setEquipmentList] = useState([
    { id: 'cam-1', name: 'Camera - Sony Mark IV (Entire slot excluding lens)', price: 2000 },
    { id: 'light-1', name: 'Per Video Light (Entire slot)', price: 500 },
    { id: 'mic-1', name: 'Mic - DJI Mic Mini (Entire slot)', price: 500 }
  ]);
  const [bookedSlots, setBookedSlots] = useState([]); 

  // Client Selection State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]); 
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState([]); 
  
  // --- CLIENT IDENTIFICATION STATE ---
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState(""); // <-- Email State

  // Business Logic Variables
  const STUDIO_HOURLY_RATE = 2000; 
  const purposes = [
    "Podcasts", "Brand shoots", "Product photography", "UGC content", 
    "Fashion shoots", "Reels & social media content", "Digital campaigns", "Other (Custom)"
  ];
  
  // --- REAL-TIME CALENDAR LOGIC (90-Day Rolling Window) ---
  const now = new Date();
  const currentHour = now.getHours();
  
  const generate90Days = () => {
    const days = [];
    for (let i = 0; i <= 90; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      days.push({
        fullDate: d,
        day: d.getDate(),
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        monthName: d.toLocaleString('default', { month: 'long' })
      });
    }
    return days;
  };

  const allAvailableDays = generate90Days();

  const availableMonths = [...new Map(allAvailableDays.map(item =>
    [`${item.monthName} ${item.year}`, { name: item.monthName, year: item.year, num: item.monthNum }]
  )).values()];

  const [viewingMonth, setViewingMonth] = useState(`${availableMonths[0].name} ${availableMonths[0].year}`);

  const daysToDisplay = allAvailableDays.filter(
    d => `${d.monthName} ${d.year}` === viewingMonth
  );

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const allTimeSlots = Array.from({ length: 15 }, (_, i) => {
    const start = i + 7;
    return `${start < 10 ? '0' + start : start}:00 - ${start + 1 < 10 ? '0' + (start + 1) : start + 1}:00`;
  });

  useEffect(() => {
    setIsLoaded(true);
    // Inject Cashfree checkout script execution framework safely
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) {
        setBookedSlots([]);
        return;
      }
      
      const dateString = `${selectedDate.day} ${selectedDate.monthName} ${selectedDate.year}`;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('time_slots')
        .eq('booking_date', dateString)
        .eq('status', 'confirmed'); 
      
      if (data && !error) {
        const taken = data.flatMap(booking => booking.time_slots || []);
        setBookedSlots(taken);
      }
    };
    
    fetchBookedSlots();
  }, [selectedDate]);

  const handleDateSelect = (dayObj) => {
    setSelectedDate(dayObj);
    setSelectedTimes([]); 
  };

  const toggleTimeSlot = (slot) => {
    setSelectedTimes(prev => 
      prev.includes(slot) ? prev.filter(t => t !== slot) : [...prev, slot].sort()
    );
  };

  const toggleEquipment = (item) => {
    setSelectedEquipment(prev => 
      prev.some(e => e.id === item.id) ? prev.filter(e => e.id !== item.id) : [...prev, item]
    );
  };

  const totalHoursCost = selectedTimes.length * STUDIO_HOURLY_RATE;
  const totalEquipmentCost = selectedEquipment.reduce((sum, item) => sum + Number(item.price), 0);
  const finalLandedCost = totalHoursCost + totalEquipmentCost;

  const executeLiveBooking = async () => {
  if (!selectedDate || selectedTimes.length === 0 || !purpose || !clientName || !clientPhone || !clientEmail) {
    alert('Please complete all form fields to initialize secure payment gateways.');
    return;
  }

  setIsSubmitting(true);
  const dateString = `${selectedDate.day} ${selectedDate.monthName} ${selectedDate.year}`;

  try {
    // 1. Post to backend route to provision secure database tracking tokens 
    const response = await fetch('/api/cashfree/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName,
        clientPhone,
        clientEmail,
        bookingDate: dateString,
        selectedTimes,
        purpose,
        customPurpose: purpose === "Other (Custom)" ? customPurpose : null,
        selectedEquipment,
        fee: finalLandedCost
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to initialize security session keys.");

    // 2. Trigger the compiled Cashfree library interface elements
    if (window.Cashfree) {
      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox" // reads configurations matching operational system parameters
      });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self" // smooth single-page flow optimization redirections
      });
    } else {
      throw new Error("Payment Gateway SDK failed to process checkout array initialization correctly.");
    }

  } catch (err) {
    console.error(err);
    alert(err.message || "An exception error occurred during initialization pipelines.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section className="py-24 bg-gradient-to-b from-[#F4F2EE] to-[#EAE6DF] relative min-h-screen">
      <div className={`max-w-6xl mx-auto px-6 w-full relative z-10 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">Secure The Studio</h2>
          <div className="w-12 h-[1px] bg-[#1A1A1A]/20 mx-auto"></div>
          <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-widest">Full facility access • Granular hourly control</p>
        </div>

        <div className="bg-[#F4F2EE] border border-[#1A1A1A]/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 relative">
          
          <div className="lg:col-span-8 p-8 md:p-12 space-y-12">
            
            {/* 1. Date & Time Selection */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium">1. Schedule Matrix</label>
                  
                  <div className="relative">
                    <select 
                      value={viewingMonth} 
                      onChange={(e) => {
                        setViewingMonth(e.target.value);
                        setSelectedDate(null);
                        setSelectedTimes([]);
                      }}
                      className="appearance-none bg-transparent border-b border-[#1A1A1A]/20 pb-1 pr-6 text-xs font-serif font-bold tracking-widest uppercase text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] cursor-pointer transition-colors"
                    >
                      {availableMonths.map((m) => (
                        <option key={`${m.name} ${m.year}`} value={`${m.name} ${m.year}`}>
                          {m.name} {m.year}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-[#1A1A1A]/50 pb-1">
                      <i className="fa-solid fa-chevron-down text-[8px]"></i>
                    </div>
                  </div>

                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx} className="font-semibold text-[#1A1A1A]/40 pb-2 text-[10px]">{day}</div>
                  ))}
                  
                  {Array.from({ length: new Date(daysToDisplay[0]?.year, daysToDisplay[0]?.monthNum, 1).getDay() }).map((_, idx) => (
                    <div key={`empty-${idx}`}></div>
                  ))}
                  
                  {daysToDisplay.map(dayObj => {
                    const isSelected = selectedDate?.fullDate.getTime() === dayObj.fullDate.getTime();
                    
                    return (
                      <button
                        key={dayObj.fullDate.toISOString()}
                        onClick={() => handleDateSelect(dayObj)}
                        className={`py-2.5 transition-all duration-300 border text-xs font-medium ${
                          isSelected 
                            ? 'bg-[#1A1A1A] text-[#F4F2EE] border-[#1A1A1A] scale-105 shadow-md' 
                            : 'bg-[#EAE6DF] text-[#1A1A1A] border-[#1A1A1A]/5 hover:bg-[#1A1A1A] hover:text-[#F4F2EE] hover:-translate-y-1 hover:shadow-md'
                        }`}
                      >
                        {dayObj.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Hour Granular Time Slots */}
              <div className={`transition-all duration-500 ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium mb-3">Available Hourly Blocks</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {allTimeSlots.map(slot => {
                    const slotStartHour = parseInt(slot.split(':')[0], 10);
                    const isToday = selectedDate?.fullDate.getDate() === now.getDate() && selectedDate?.fullDate.getMonth() === now.getMonth();
                    const isPastHourToday = isToday && slotStartHour <= currentHour;
                    
                    const isBooked = bookedSlots.includes(slot) || isPastHourToday;
                    const isSelected = selectedTimes.includes(slot);

                    return (
                      <button 
                        key={slot} 
                        disabled={isBooked}
                        onClick={() => toggleTimeSlot(slot)} 
                        className={`py-3 text-[10px] tracking-wider font-medium transition-all duration-300 border ${
                          isBooked 
                            ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/30 border-transparent line-through cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-105' 
                              : 'bg-[#EAE6DF] text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#1A1A1A]/5'
                        }`}
                      >
                        {isPastHourToday ? 'PASSED' : isBooked ? 'UNAVAILABLE' : slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Purpose of Visit */}
            <div className="space-y-4 relative group">
              <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium">2. Production Purpose</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full bg-[#EAE6DF] border border-[#1A1A1A]/10 px-4 py-4 text-xs capitalize focus:outline-none focus:border-[#1A1A1A] cursor-pointer appearance-none transition-all duration-300 text-[#1A1A1A]">
                <option value="" disabled className="normal-case">Select the primary goal of your shoot...</option>
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className={`transition-all duration-500 overflow-hidden ${purpose === "Other (Custom)" ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                 <textarea value={customPurpose} onChange={(e) => setCustomPurpose(e.target.value)} placeholder="Please describe your specific requirements in detail..." className="w-full bg-[#EAE6DF] border border-[#1A1A1A]/10 px-4 py-3 text-xs resize-none focus:outline-none focus:border-[#1A1A1A]" rows="3"></textarea>
              </div>
            </div>

            {/* 3. Dynamic Equipment Add-ons */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium">3. Hardware & Crew Add-ons (Optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentList.map(item => {
                  const isSelected = selectedEquipment.some(e => e.id === item.id);
                  return (
                    <div key={item.id} onClick={() => toggleEquipment(item)} className={`p-4 border cursor-pointer transition-all duration-300 flex justify-between items-center group ${isSelected ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-md scale-[1.02]' : 'bg-[#EAE6DF] border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-white hover:shadow-sm'}`}>
                      <span className="text-xs font-medium flex-1 pr-4">{item.name}</span>
                      <span className={`text-[10px] tracking-widest font-mono whitespace-nowrap flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-[#1A1A1A]/50 group-hover:text-[#1A1A1A]'}`}>+₹{item.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Checkout & Dynamic Receipt */}
          <div className="lg:col-span-4 bg-[#EAE6DF]/60 p-8 md:p-10 border-l border-[#1A1A1A]/5 flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h4 className="font-serif text-xl border-b border-[#1A1A1A]/10 pb-3 text-[#1A1A1A] mb-4">Client Identification</h4>
                <div className="space-y-3">
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Client Name" className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-4 py-3.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors" />
                  
                  {/* === NEW EMAIL INPUT BOX === */}
                  <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Email Address for Receipt" className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-4 py-3.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors" />
                  
                  <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="WhatsApp Number" className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-4 py-3.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors" />
                </div>
              </div>

              <div className="bg-[#F4F2EE] p-6 border border-[#1A1A1A]/10 shadow-sm space-y-3 text-xs transition-all duration-300">
                <p className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 mb-4 border-b border-[#1A1A1A]/5 pb-2">Cost Breakdown</p>
                <div className="flex justify-between items-center text-[#1A1A1A]/80"><span>Full Studio Access ({selectedTimes.length} hrs)</span><span className="font-mono">₹{totalHoursCost}</span></div>
                {selectedEquipment.map(eq => <div key={eq.id} className="flex justify-between items-center text-[#1A1A1A]/80"><span className="truncate pr-4 text-[#1A1A1A]/60">{eq.name}</span><span className="font-mono text-[#1A1A1A]/60">₹{eq.price}</span></div>)}
                <div className="w-full h-[1px] bg-[#1A1A1A]/10 my-4"></div>
                <div className="flex justify-between items-center font-bold text-sm text-[#1A1A1A]"><span className="uppercase tracking-widest text-[11px]">Landed Cost</span><span className="font-mono text-base">₹{finalLandedCost}</span></div>
              </div>
            </div>

            <button onClick={executeLiveBooking} disabled={isSubmitting || finalLandedCost === 0} className="w-full bg-[#1A1A1A] text-white py-5 text-[11px] uppercase tracking-widest font-bold mt-8 transition-all duration-500 hover:bg-[#333333] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {isSubmitting ? 'Verifying Payment...' : finalLandedCost === 0 ? 'Select Slots to Calculate' : `Pay ₹${finalLandedCost} & Secure Slot`}
            </button>
          </div>
        </div>
      </div>

      {/* WHATSAPP AUTOMATION OVERLAY */}
      <div className={`fixed bottom-8 right-8 z-50 w-[22rem] bg-white shadow-2xl border-l-4 border-emerald-500 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${notification ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="p-6 relative">
          <button onClick={() => setNotification(null)} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-800 transition-colors"><i className="fa-solid fa-xmark text-sm"></i></button>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-lg shadow-sm"><i className="fa-brands fa-whatsapp"></i></div>
            <div className="space-y-2 pr-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Studio 1O1 Auto-Engine</p>
              <p className="text-xs text-neutral-700 leading-relaxed"><strong>Payment Successful!</strong> Hey {notification?.name}, your booking of <strong>₹{notification?.cost}</strong> is 100% confirmed.</p>
              <p className="text-xs text-neutral-700 leading-relaxed border-t border-neutral-100 pt-2 mt-2">An automated WhatsApp itinerary has been dispatched to your number.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}