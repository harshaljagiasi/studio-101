"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history' | 'inbox'
  const [viewMode, setViewMode] = useState('list'); 
  const [dateFilter, setDateFilter] = useState(null); 
  const [notification, setNotification] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [queries, setQueries] = useState([]); // NEW: State for contact messages

  // --- MODAL STATE ---
  const [editingBooking, setEditingBooking] = useState(null);
  const [editSelectedSlots, setEditSelectedSlots] = useState([]);
  const [editDisabledSlots, setEditDisabledSlots] = useState([]);

  // Current Time Variables 
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  
  const daysInCurrentMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const allTimeSlots = Array.from({ length: 12 }, (_, i) => {
    const start = i + 9;
    return `${start < 10 ? '0' + start : start}:00 - ${start + 1 < 10 ? '0' + (start + 1) : start + 1}:00`;
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch Live Data (Bookings & Queries)
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        // Fetch Bookings
        const { data: bData, error: bError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false }); 
        if (bData && !bError) setBookings(bData);

        // Fetch Queries
        const { data: qData, error: qError } = await supabase
          .from('contact_queries')
          .select('*')
          .order('created_at', { ascending: false });
        if (qData && !qError) setQueries(qData);
      };
      
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleAction = async (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    
    if (newStatus === 'completed') {
      setNotification(`Shoot logged as Completed.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // NEW: Handler for Contact Queries
  const handleQueryAction = async (id, newStatus) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    await supabase.from('contact_queries').update({ status: newStatus }).eq('id', id);
    
    setNotification(`Message marked as ${newStatus}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SCHEDULE MODIFICATION ENGINE ---
  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setEditSelectedSlots([...(booking.time_slots || [])]);

    const otherBookings = bookings.filter(b => b.booking_date === booking.booking_date && b.id !== booking.id && b.status !== 'cancelled');
    const takenByOthers = otherBookings.flatMap(b => b.time_slots || []);
    setEditDisabledSlots(takenByOthers);
  };

  const toggleEditSlot = (slot) => {
    setEditSelectedSlots(prev => prev.includes(slot) ? prev.filter(t => t !== slot) : [...prev, slot].sort());
  };

  const saveScheduleChanges = async () => {
    if (!editingBooking) return;

    const oldSlots = editingBooking.time_slots || [];
    const newSlots = editSelectedSlots;

    const addedSlots = newSlots.filter(slot => !oldSlots.includes(slot));
    const removedSlots = oldSlots.filter(slot => !newSlots.includes(slot));

    if (addedSlots.length === 0 && removedSlots.length === 0) {
      setEditingBooking(null);
      return;
    }

    const logEntry = {
      timestamp: new Date().toLocaleString(),
      added: addedSlots,
      removed: removedSlots
    };

    const existingLogs = editingBooking.extension_logs || [];
    const updatedLogs = [...existingLogs, logEntry];

    setBookings(prev => prev.map(b => b.id === editingBooking.id ? { 
      ...b, time_slots: newSlots, extension_logs: updatedLogs
    } : b));

    await supabase.from('bookings').update({ 
      time_slots: newSlots, extension_logs: updatedLogs
    }).eq('id', editingBooking.id);

    setNotification(`Schedule modified and audit log created.`);
    setTimeout(() => setNotification(null), 4000);
    setEditingBooking(null);
  };

  // --- AUTO-ARCHIVE LOGIC ---
  const checkIsPast = (booking) => {
    if (!booking.booking_date || !booking.time_slots || booking.time_slots.length === 0) return false;
    
    const bDay = parseInt(booking.booking_date.split(' ')[0], 10);
    const bMonth = booking.booking_date.split(' ')[1];
    
    if (bMonth !== currentMonthName) return true; 
    if (bDay < currentDay) return true; 
    if (bDay > currentDay) return false; 

    const highestEndHour = Math.max(...booking.time_slots.map(slot => parseInt(slot.split('-')[1].trim(), 10)));
    return highestEndHour <= currentHour;
  };

  // Sort buckets
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && !checkIsPast(b));
  const historyBookings = bookings.filter(b => checkIsPast(b) || b.status === 'completed' || b.status === 'cancelled');

  let displayBookings = activeTab === 'upcoming' ? upcomingBookings : historyBookings;
  if (dateFilter) {
    displayBookings = displayBookings.filter(b => b.booking_date.startsWith(`${dateFilter} `));
  }

  // Calculate unread queries for the badge
  const unreadCount = queries.filter(q => q.status === 'unread').length;

  // --- LOGIN SCREEN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className={`w-full max-w-md bg-white/5 border border-white/10 p-10 backdrop-blur-md shadow-2xl relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20">
               <span className="text-white font-serif font-bold tracking-widest text-lg">101</span>
            </div>
            <h1 className="text-white font-serif text-2xl tracking-wide">Studio Command</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-2">Authorized Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="email" placeholder="Admin Email" defaultValue="owner@studio101.com" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors" required />
            <input type="password" placeholder="Password" defaultValue="••••••••" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors" required />
            <button type="submit" className="w-full bg-white text-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#F4F2EE] transition-colors mt-4">Authenticate Engine</button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#F4F2EE] font-sans text-[#1A1A1A] pb-20 relative">
      
      <header className="bg-[#1A1A1A] text-white py-4 px-6 border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><span className="font-serif font-bold text-[10px]">101</span></div>
             <div><h1 className="text-sm font-serif tracking-wide">Command Center</h1><p className="text-[9px] text-white/50 uppercase tracking-widest">Live Auto-Engine</p></div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">Terminate Session</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex justify-between items-end border-b border-[#1A1A1A]/10 mb-6">
          <div className="flex space-x-6">
            <button onClick={() => { setActiveTab('upcoming'); setDateFilter(null); setViewMode('list'); }} className={`pb-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 relative ${activeTab === 'upcoming' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70'}`}>
              Upcoming {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]"></span>}
            </button>
            <button onClick={() => { setActiveTab('history'); setDateFilter(null); setViewMode('list'); }} className={`pb-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 relative ${activeTab === 'history' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70'}`}>
              History {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]"></span>}
            </button>
            <button onClick={() => { setActiveTab('inbox'); setDateFilter(null); }} className={`pb-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 relative ${activeTab === 'inbox' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70'}`}>
              Inbox {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
              {activeTab === 'inbox' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]"></span>}
            </button>
          </div>
          
          {/* Hide Calendar/List toggle if on Inbox tab */}
          {activeTab !== 'inbox' && (
            <div className="flex space-x-2 pb-3">
              <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-all ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#1A1A1A]/20 text-[#1A1A1A]/60'}`}>List</button>
              <button onClick={() => setViewMode('calendar')} className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-all ${viewMode === 'calendar' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#1A1A1A]/20 text-[#1A1A1A]/60'}`}>Calendar</button>
            </div>
          )}
        </div>

        {viewMode === 'list' && activeTab !== 'inbox' && (
          <div className="mb-6 flex items-center space-x-4">
            <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 flex-shrink-0">Filter Date:</span>
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide w-full">
              <button onClick={() => setDateFilter(null)} className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-medium border ${dateFilter === null ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-[#1A1A1A]/10'}`}>All</button>
              {daysArray.map(day => (
                <button key={day} onClick={() => setDateFilter(day)} className={`flex-shrink-0 w-8 py-1.5 text-[10px] font-medium border ${dateFilter === day ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-[#1A1A1A]/10'}`}>{day}</button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inbox' ? (
          /* INBOX VIEW */
          <div className="bg-white border border-[#1A1A1A]/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAE6DF]/50 text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">
                  <tr>
                    <th className="px-6 py-4 font-medium">Query ID</th>
                    <th className="px-6 py-4 font-medium">Sender Details</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Message Parameter</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/5">
                  {queries.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-[#1A1A1A]/40 font-serif italic text-lg">Inbox is completely clear.</td></tr>
                  ) : (
                    queries.map((q) => {
                      const isUnread = q.status === 'unread';
                      return (
                        <tr key={q.id} className={`transition-colors group ${isUnread ? 'bg-white' : 'bg-[#F4F2EE]/40 hover:bg-[#EAE6DF]/20'}`}>
                          <td className="px-6 py-4 font-medium uppercase font-mono tracking-wider text-[#1A1A1A]/60">{q.id.split('-')[0]}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold flex items-center">
                              {isUnread && <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>}
                              {q.name}
                            </p>
                            <p className="text-[10px] text-[#1A1A1A]/50 font-mono mt-0.5">{q.email}</p>
                          </td>
                          <td className="px-6 py-4 font-medium">{q.subject}</td>
                          <td className="px-6 py-4 max-w-md">
                            <p className="text-[#1A1A1A]/80 leading-relaxed break-words">{q.message}</p>
                            <p className="text-[9px] text-[#1A1A1A]/40 uppercase tracking-widest mt-2">{new Date(q.created_at).toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isUnread ? (
                              <button onClick={() => handleQueryAction(q.id, 'read')} className="px-4 py-2 text-[9px] uppercase tracking-widest font-bold transition-all bg-[#1A1A1A] text-white hover:bg-neutral-700 rounded-sm">
                                Mark as Read
                              </button>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 text-[9px] uppercase tracking-widest border border-neutral-200 rounded-sm font-bold">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          /* BOOKINGS LIST VIEW */
          <div className="bg-white border border-[#1A1A1A]/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAE6DF]/50 text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">
                  <tr>
                    <th className="px-6 py-4 font-medium">Log ID</th>
                    <th className="px-6 py-4 font-medium">Client Detail</th>
                    <th className="px-6 py-4 font-medium">Purpose & Add-ons</th>
                    <th className="px-6 py-4 font-medium">Schedule Matrix & Audit Log</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/5">
                  {displayBookings.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-[#1A1A1A]/40 font-serif italic text-lg">No bookings match this filter.</td></tr>
                  ) : (
                    displayBookings.map((booking) => {
                      const hasLogs = booking.extension_logs && booking.extension_logs.length > 0;
                      return (
                        <tr key={booking.id} className="hover:bg-[#EAE6DF]/20 transition-colors group">
                          <td className="px-6 py-4 font-medium uppercase font-mono tracking-wider">{booking.id.split('-')[0]}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold">{booking.client_name}</p>
                            <p className="text-[10px] text-[#1A1A1A]/50 font-mono mt-0.5">{booking.client_phone}</p>
                          </td>
                          <td className="px-6 py-4 max-w-[200px] truncate">
                            <p className="font-medium text-[#1A1A1A]/80">{booking.purpose}</p>
                            {booking.equipment_addons && booking.equipment_addons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {booking.equipment_addons.map((eq, i) => <span key={i} className="text-[8px] uppercase tracking-widest bg-[#1A1A1A]/5 text-[#1A1A1A]/60 px-1.5 py-0.5 rounded-sm">{eq.name}</span>)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{booking.booking_date}</p>
                              {hasLogs && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[8px] uppercase tracking-widest rounded-sm border border-amber-200">Modified</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                              {booking.time_slots?.map((time, i) => (
                                <span key={i} className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">{time}</span>
                              ))}
                            </div>
                            {hasLogs && (
                              <div className="mt-3 space-y-1.5 border-t border-[#1A1A1A]/5 pt-2">
                                <p className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">Audit Log:</p>
                                {booking.extension_logs.map((log, index) => (
                                  <div key={index} className="text-[9px] font-mono text-[#1A1A1A]/60">
                                    <span className="text-[#1A1A1A]/40">[{log.timestamp.split(',')[0]}]</span> 
                                    {log.added.length > 0 && <span className="text-emerald-600 ml-1">Added: {log.added.join(', ')}</span>}
                                    {log.removed.length > 0 && <span className="text-red-500 ml-1">Removed: {log.removed.join(', ')}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {booking.status === 'confirmed' ? (
                              <div className="flex flex-col items-end space-y-2">
                                <button onClick={() => handleAction(booking.id, 'completed')} className="px-4 py-2 text-[9px] uppercase tracking-widest font-bold transition-all bg-[#1A1A1A] text-white hover:bg-emerald-600">
                                  Mark Completed
                                </button>
                                <button onClick={() => openEditModal(booking)} className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 hover:text-amber-600 underline decoration-[#1A1A1A]/20 hover:decoration-amber-600 underline-offset-4 transition-colors">
                                  <i className="fa-solid fa-pen mr-1"></i> Modify Slots
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 text-[9px] uppercase tracking-widest border border-neutral-200 rounded-sm font-bold">Archived</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* BOOKINGS CALENDAR GRID VIEW */
          <div className="bg-white border border-[#1A1A1A]/10 shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl text-[#1A1A1A]">{currentMonthName} {currentYear}</h3>
            </div>
            <div className="grid grid-cols-7 gap-4 mb-2">
              {weekDays.map(d => <div key={d} className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/40 text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              <div className="min-h-[100px] md:min-h-[120px] p-2 bg-[#F4F2EE]/50 border border-[#1A1A1A]/5 rounded-sm"></div>
              {daysArray.map(day => {
                const dayBookings = displayBookings.filter(b => b.booking_date === `${day} ${currentMonthName} ${currentYear}`);
                return (
                  <div key={day} className={`min-h-[100px] md:min-h-[120px] p-2 bg-[#F4F2EE] border border-[#1A1A1A]/10 rounded-sm flex flex-col gap-1.5 overflow-hidden`}>
                    <div className="text-[11px] font-serif font-bold text-[#1A1A1A]/60 border-b border-[#1A1A1A]/5 pb-1 mb-1">{day}</div>
                    {dayBookings.map(b => (
                        <div key={b.id} title={`${b.client_name} - ${b.purpose}`} className={`px-1.5 py-1 text-[8px] md:text-[9px] uppercase tracking-wider font-mono truncate rounded-sm border-l-2 bg-emerald-50 text-emerald-900 border-emerald-500`}>
                          {b.time_slots[0]?.split(' ')[0]} {b.client_name.split(' ')[0]}
                        </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* --- EDIT SCHEDULE MODAL OVERLAY --- */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-sm p-6">
          <div className="bg-[#F4F2EE] w-full max-w-2xl shadow-2xl overflow-hidden border border-[#1A1A1A]/20">
            <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-serif text-xl">Modify Schedule</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Client: {editingBooking.client_name} • {editingBooking.booking_date}</p>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-white/50 hover:text-white"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 font-medium mb-3">Adjust Hourly Blocks</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {allTimeSlots.map(slot => {
                    const isTakenBySomeoneElse = editDisabledSlots.includes(slot);
                    const isSelected = editSelectedSlots.includes(slot);
                    const wasOriginallySelected = editingBooking.time_slots.includes(slot);

                    return (
                      <button 
                        key={slot} 
                        disabled={isTakenBySomeoneElse}
                        onClick={() => toggleEditSlot(slot)} 
                        className={`py-3 px-2 text-[10px] tracking-wider font-medium transition-all duration-200 border relative ${
                          isTakenBySomeoneElse 
                            ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/30 border-transparent line-through cursor-not-allowed'
                            : isSelected 
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-105' 
                              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A]/50'
                        }`}
                      >
                        {isTakenBySomeoneElse ? 'TAKEN' : slot}
                        {wasOriginallySelected && !isSelected && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full" title="Originally Booked"></span>}
                        {isSelected && !wasOriginallySelected && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" title="New Addition"></span>}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex space-x-4 text-[9px] uppercase tracking-widest text-[#1A1A1A]/50 font-bold">
                  <span className="flex items-center"><div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div> Removed</span>
                  <span className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></div> Newly Added</span>
                  <span className="flex items-center"><div className="w-2 h-0.5 bg-[#1A1A1A]/30 mr-1"></div> Taken by others</span>
                </div>
              </div>
            </div>

            <div className="bg-white px-8 py-5 border-t border-[#1A1A1A]/10 flex justify-end space-x-4">
              <button onClick={() => setEditingBooking(null)} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">Cancel</button>
              <button onClick={saveScheduleChanges} disabled={editSelectedSlots.length === 0} className="px-6 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50">
                Save & Record Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className={`fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-6 py-4 shadow-2xl transition-all duration-500 flex items-center space-x-3 ${notification ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>
        <p className="text-xs font-mono tracking-wide">{notification}</p>
      </div>

    </div>
  );
}