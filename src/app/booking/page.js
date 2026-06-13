"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Connected to your live database

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
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Business Logic Variables
  const STUDIO_HOURLY_RATE = 2000; 
  const purposes = [
    "Podcasts", "Brand shoots", "Product photography", "UGC content", 
    "Fashion shoots", "Reels & social media content", "Digital campaigns", "Other (Custom)"
  ];
  
  // Real-Time Clock Configuration
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  
  // Dynamically calculate days in the current month
  const daysInCurrentMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const totalDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate 1-hour slots from 7 AM to 10 PM (15 slots total)
  const allTimeSlots = Array.from({ length: 15 }, (_, i) => {
    const start = i + 7;
    return `${start < 10 ? '0' + start : start}:00 - ${start + 1 < 10 ? '0' + (start + 1) : start + 1}:00`;
  });

  // 1. Initial Load State
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 2. Fetch unavailable slots whenever the user selects a date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) {
        setBookedSlots([]);
        return;
      }
      
      const dateString = `${selectedDate} ${currentMonthName} ${currentYear}`;
      
      // Ping Supabase for all explicitly confirmed bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('time_slots')
        .eq('booking_date', dateString)
        .eq('status', 'confirmed'); // ONLY look for confirmed slots to block
      
      if (data && !error) {
        const taken = data.flatMap(booking => booking.time_slots || []);
        setBookedSlots(taken);
      }
    };
    
    fetchBookedSlots();
  }, [selectedDate, currentMonthName, currentYear]);

  // UI Handlers
  const handleDateSelect = (day) => {
    setSelectedDate(day);
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

  // Dynamic Cost Calculations
  const totalHoursCost = selectedTimes.length * STUDIO_HOURLY_RATE;
  const totalEquipmentCost = selectedEquipment.reduce((sum, item) => sum + Number(item.price), 0);
  const finalLandedCost = totalHoursCost + totalEquipmentCost;

  // The Live Auto-Confirmation Function
  const executeLiveBooking = async () => {
    if (!selectedDate || selectedTimes.length === 0 || !purpose || !clientName || !clientPhone) {
      alert('Please complete all form fields to process payment and confirm booking.');
      return;
    }

    setIsSubmitting(true);

    // Push to Supabase and INSTANTLY CONFIRM
    const { error } = await supabase.from('bookings').insert([{
      client_name: clientName,
      client_phone: clientPhone,
      booking_date: `${selectedDate} ${currentMonthName} ${currentYear}`, 
      time_slots: selectedTimes, 
      purpose: purpose,
      custom_purpose: purpose === "Other (Custom)" ? customPurpose : null,
      equipment_addons: selectedEquipment, 
      fee: finalLandedCost,
      status: 'confirmed' // <--- The Magic Word. Bypasses admin approval.
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("System failed to secure slot. Someone may have just booked this block.");
      return;
    }

    // Trigger WhatsApp Success UI
    setNotification({ name: clientName, cost: finalLandedCost });
    
    // Optimistically update the UI to instantly block the newly bought slots
    setBookedSlots(prev => [...prev, ...selectedTimes]);
    
    // Reset Form
    setSelectedDate(null); setSelectedTimes([]); setPurpose(""); 
    setCustomPurpose(""); setSelectedEquipment([]); setClientName(""); setClientPhone("");
    
    setTimeout(() => setNotification(null), 10000);
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
                  <span className="text-xs font-serif italic text-[#1A1A1A]/70">{currentMonthName} {currentYear}</span>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx} className="font-semibold text-[#1A1A1A]/40 pb-2 text-[10px]">{day}</div>
                  ))}
                  <div></div>
                  
                  {totalDays.map(day => {
                    const isSelected = selectedDate === day;
                    // Auto-block any day that has already passed in the current month
                    const isPastDay = day < currentDay;

                    return (
                      <button
                        key={day}
                        disabled={isPastDay}
                        onClick={() => handleDateSelect(day)}
                        className={`py-2.5 transition-all duration-300 border text-xs font-medium ${
                          isPastDay
                            ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/20 border-transparent line-through cursor-not-allowed'
                            : isSelected 
                              ? 'bg-[#1A1A1A] text-[#F4F2EE] border-[#1A1A1A] scale-105 shadow-md' 
                              : 'bg-[#EAE6DF] text-[#1A1A1A] border-[#1A1A1A]/5 hover:bg-[#1A1A1A] hover:text-[#F4F2EE] hover:-translate-y-1 hover:shadow-md'
                        }`}
                      >
                        {day}
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
                    // Extract the starting hour of the slot (e.g. "07:00 - 08:00" -> 7)
                    const slotStartHour = parseInt(slot.split(':')[0], 10);
                    
                    // Auto-block the hour if the user selected TODAY and the hour has already passed
                    const isPastHourToday = selectedDate === currentDay && slotStartHour <= currentHour;
                    
                    // Final block logic
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
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full bg-[#EAE6DF] border border-[#1A1A1A]/10 px-4 py-4 text-xs focus:outline-none focus:border-[#1A1A1A] cursor-pointer appearance-none transition-all duration-300 text-[#1A1A1A]">
                <option value="" disabled>Select the primary goal of your shoot...</option>
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className={`transition-all duration-500 overflow-hidden ${purpose === "Other (Custom)" ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                 <textarea value={customPurpose} onChange={(e) => setCustomPurpose(e.target.value)} placeholder="Please describe your specific requirements in detail..." className="w-full bg-[#EAE6DF] border border-[#1A1A1A]/10 px-4 py-3 text-xs resize-none focus:outline-none focus:border-[#1A1A1A]" rows="3"></textarea>
              </div>
            </div>

            {/* 3. Dynamic Equipment Add-ons */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium">3. Hardware & Crew Add-ons (Optional)</label>
              {equipmentList.length === 0 ? (
                <p className="text-xs text-[#1A1A1A]/50 italic border border-[#1A1A1A]/5 p-4 text-center">Loading inventory...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipmentList.map(item => {
                    const isSelected = selectedEquipment.some(e => e.id === item.id);
                    return (
                      <div key={item.id} onClick={() => toggleEquipment(item)} className={`p-4 border cursor-pointer transition-all duration-300 flex justify-between items-center group ${isSelected ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-md scale-[1.02]' : 'bg-[#EAE6DF] border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-white hover:shadow-sm'}`}>
                        {/* Added flex-1 and pr-4 to give the name room to breathe without pushing the price */}
                        <span className="text-xs font-medium flex-1 pr-4">{item.name}</span>
                        {/* Added whitespace-nowrap and flex-shrink-0 to prevent the price from breaking lines */}
                        <span className={`text-[10px] tracking-widest font-mono whitespace-nowrap flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-[#1A1A1A]/50 group-hover:text-[#1A1A1A]'}`}>+₹{item.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Checkout & Dynamic Receipt */}
          <div className="lg:col-span-4 bg-[#EAE6DF]/60 p-8 md:p-10 border-l border-[#1A1A1A]/5 flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h4 className="font-serif text-xl border-b border-[#1A1A1A]/10 pb-3 text-[#1A1A1A] mb-4">Client Identification</h4>
                <div className="space-y-3">
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Client Name" className="w-full bg-[#F4F2EE] border border-[#1A1A1A]/10 px-4 py-3.5 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors" />
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Studio 101 Auto-Engine</p>
              <p className="text-xs text-neutral-700 leading-relaxed"><strong>Payment Successful!</strong> Hey {notification?.name}, your booking of <strong>₹{notification?.cost}</strong> is 100% confirmed.</p>
              <p className="text-xs text-neutral-700 leading-relaxed border-t border-neutral-100 pt-2 mt-2">An automated WhatsApp itinerary has been dispatched to your number.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}