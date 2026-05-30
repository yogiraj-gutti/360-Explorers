'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, User, Mail, Phone, Calendar, Users, MapPin, 
  ShieldCheck, CreditCard, Clock, CheckCircle2, QrCode, 
  Download, Printer, Share2, ChevronRight, Armchair, Tent,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Adventure } from '@/data/adventures';

const BookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'selection' | 'payment' | 'ticket'>('details');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    passengers: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/adventures?id=${id}`);
        if (!response.ok) throw new Error('Adventure not found');
        const data = await response.json();
        setAdventure(data);
      } catch (err) {
        // Fallback to static
        import('@/data/adventures').then(mod => {
          const found = mod.adventures.find(a => a.id === id);
          if (found) setAdventure(found);
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAdventure();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white space-y-4">
        <Loader2 className="w-12 h-12 text-[#D4A373] animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Initializing booking system...</p>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <h1 className="text-2xl font-bold text-[#1A2B3C] mb-4">Adventure Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-[#1A2B3C] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-black/10"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'details', label: 'Details', icon: <User className="w-4 h-4" /> },
    { id: 'selection', label: 'Selection', icon: <Armchair className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'ticket', label: 'Ticket', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const handleProceedToSelection = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bookingId = `WT-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${bookingId}?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&adventure=${encodeURIComponent(adventure.title)}&date=${formData.date}&people=${formData.passengers}`
    : '';

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}&color=1A2B3C&bgcolor=FFFFFF`;

  const handlePaymentComplete = async () => {
    if (!adventure) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adventureId: adventure.id,
          adventureTitle: adventure.title,
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email,
          userPhone: formData.phone,
          travelDate: new Date(formData.date),
          guests: formData.passengers,
          totalPrice: `₹${(parseInt(adventure.price.replace(/[^\d]/g, '')) * formData.passengers).toLocaleString('en-IN')}`
        }),
      });

      if (!response.ok) throw new Error('Booking failed');
      
      setStep('ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProgressIndicator = () => (
    <div className="max-w-3xl mx-auto mb-16 relative">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2" />
      <div 
        className="absolute top-1/2 left-0 h-px bg-[#1A2B3C] -translate-y-1/2 transition-all duration-500" 
        style={{ width: `${(steps.findIndex(s => s.id === step) / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((s, i) => {
          const isActive = step === s.id;
          const isCompleted = steps.findIndex(st => st.id === step) > i;
          return (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                  isActive ? 'bg-[#1A2B3C] border-[#1A2B3C] text-white scale-110 shadow-lg' : 
                  isCompleted ? 'bg-[#1A2B3C] border-[#1A2B3C] text-white' : 
                  'bg-white border-gray-100 text-gray-300'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#1A2B3C]' : 'text-gray-300'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (step === 'ticket') {
    return (
      <div className="bg-white min-h-screen pt-48 pb-24 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full relative group"
        >
          <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-[#1A2B3C] p-12 text-white text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <CheckCircle2 className="w-8 h-8 text-[#1A2B3C]" />
              </div>
              <h1 className="text-3xl font-serif-luxury tracking-wider uppercase">Expedition Confirmed</h1>
              <p className="text-white/60 font-black tracking-widest text-[9px] uppercase">Your digital pass is ready for boarding</p>
            </div>

            {/* Ticket Body */}
            <div className="p-12 space-y-12 relative bg-[#FDFBF7]">
              <div className="grid grid-cols-2 gap-y-10">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead Explorer</p>
                  <p className="text-lg font-black text-[#1A2B3C] uppercase">{formData.firstName} {formData.lastName}</p>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Booking ID</p>
                  <p className="text-lg font-black text-[#D4A373]">{bookingId}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Adventure</p>
                  <p className="text-base font-serif-luxury text-[#1A2B3C] uppercase tracking-wider">{adventure.title}</p>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expedition Date</p>
                  <p className="text-base font-black text-[#1A2B3C] uppercase">{formData.date}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Travelers</p>
                  <p className="text-base font-black text-[#1A2B3C] uppercase">{formData.passengers} Members</p>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount Secured</p>
                  <p className="text-2xl font-serif-luxury text-[#1A2B3C]">₹{(parseInt(adventure.price.replace(/[^\d]/g, '')) * formData.passengers).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center pt-12 border-t border-dashed border-gray-200 gap-6">
                <div className="relative p-6 bg-white border border-gray-100 shadow-sm">
                  <img src={qrCodeUrl} alt="Booking QR Code" className="w-32 h-32" />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-[10px] font-black text-[#1A2B3C] uppercase tracking-[0.3em]">Scan at Base Camp</p>
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Verification ID: {bookingId.split('-')[1]}</p>
                </div>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="bg-white p-10 flex items-center justify-center gap-6 border-t border-gray-100">
              <button className="flex items-center gap-3 border border-gray-200 px-8 py-4 text-[9px] font-black uppercase tracking-widest text-[#1A2B3C] hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button 
                onClick={() => router.push('/')}
                className="bg-[#1A2B3C] text-white px-12 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="bg-[#FDFBF7] min-h-screen pt-48 pb-24 flex flex-col items-center justify-center px-6">
        <div className="max-w-3xl w-full mb-12">
           <ProgressIndicator />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* PhonePe Header */}
          <div className="bg-[#5F259F] p-10 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <div className="w-7 h-7 bg-[#5F259F] rounded-sm" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">PhonePe</span>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Total</p>
              <p className="text-2xl font-serif-luxury tracking-tight">₹{(parseInt(adventure.price.replace(/[^\d]/g, '')) * formData.passengers).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-serif-luxury text-[#1A2B3C] tracking-tight uppercase">Secure Gateway</h2>
              <p className="text-xs text-gray-400 font-bold px-4">Demo transaction for 360 Explorer.</p>
            </div>

            <div className="space-y-4">
              <div className="p-6 border border-[#5F259F] flex items-center justify-between bg-[#5F259F]/5 cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white border border-gray-100 flex items-center justify-center font-black text-[#5F259F] shadow-sm text-xs">UPI</div>
                  <div>
                    <p className="font-black text-[#1A2B3C] text-sm uppercase tracking-tight">360 Explorer UPI</p>
                    <p className="text-[10px] text-gray-400 font-bold">explorers@phonepe</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#5F259F] flex items-center justify-center">
                   <div className="w-2.5 h-2.5 bg-[#5F259F] rounded-full" />
                </div>
              </div>
            </div>

            <button 
              onClick={handlePaymentComplete}
              disabled={isSubmitting}
              className="w-full bg-[#5F259F] text-white py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#4a1d7c] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Slot...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
            
            <button 
              onClick={() => setStep('selection')}
              className="w-full text-gray-400 font-black text-[9px] uppercase tracking-widest hover:text-[#1A2B3C] transition-colors"
            >
              Cancel Transaction
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'selection') {
    return (
      <div className="bg-white min-h-screen pt-48 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProgressIndicator />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-12">
               <div className="space-y-4 border-b border-gray-100 pb-8">
                  <h2 className="text-4xl font-serif-luxury text-[#1A2B3C] tracking-tight uppercase">Select Your Base</h2>
                  <p className="text-gray-400 font-medium text-sm tracking-wide">Choose your preferred tent/jeep allocation for the expedition.</p>
               </div>

               <div className="bg-[#FDFBF7] border border-gray-100 p-12 text-center shadow-sm">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-6 max-w-2xl mx-auto">
                    {[...Array(24)].map((_, i) => {
                      const isBooked = [3, 7, 12, 18].includes(i);
                      const isSelected = selectedSeat === i;
                      return (
                        <button
                          key={i}
                          disabled={isBooked}
                          onClick={() => setSelectedSeat(i)}
                          className={`aspect-square flex flex-col items-center justify-center gap-1 transition-all border ${
                            isBooked ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed' :
                            isSelected ? 'bg-[#1A2B3C] border-[#1A2B3C] text-white scale-110 shadow-xl' :
                            'bg-white border-gray-200 text-[#1A2B3C] hover:border-[#1A2B3C]'
                          }`}
                        >
                          <Tent className="w-4 h-4" />
                          <span className="text-[8px] font-black">{i + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-white border border-gray-200" />
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#1A2B3C]" />
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-100" />
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Occupied</span>
                    </div>
                  </div>
               </div>

               <div className="flex justify-between items-center">
                 <button 
                  onClick={() => setStep('details')}
                  className="text-gray-400 font-black text-[9px] uppercase tracking-widest hover:text-[#1A2B3C] transition-colors"
                 >
                   Back to Details
                 </button>
                 <button 
                  onClick={handleProceedToPayment}
                  disabled={selectedSeat === null}
                  className="bg-[#1A2B3C] text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-3"
                 >
                   Secure Booking
                   <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary adventure={adventure} passengers={formData.passengers} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-48 pb-24 text-[#1A2B3C]">
      <div className="max-w-7xl mx-auto px-6">
        <ProgressIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8">
            <form onSubmit={handleProceedToSelection} className="space-y-12">
              <div className="bg-[#FDFBF7] border border-gray-100 p-10 md:p-14 space-y-12 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#D4A373]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif-luxury tracking-tight uppercase">Explorer Profile</h2>
                    <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase">Enter your identification details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <InputGroup label="First Name" placeholder="e.g. John" onChange={(v) => setFormData({...formData, firstName: v})} />
                  <InputGroup label="Last Name" placeholder="e.g. Doe" onChange={(v) => setFormData({...formData, lastName: v})} />
                  <InputGroup label="Email" icon={<Mail />} placeholder="john@360.com" onChange={(v) => setFormData({...formData, email: v})} />
                  <InputGroup label="Phone" icon={<Phone />} placeholder="+91 00000 00000" onChange={(v) => setFormData({...formData, phone: v})} />
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-gray-100 p-10 md:p-14 space-y-12 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-[#D4A373]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif-luxury tracking-tight uppercase">Expedition Log</h2>
                    <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase">Schedule and preferences</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white border border-gray-200 px-8 py-5 text-[#1A2B3C] font-black focus:ring-4 focus:ring-[#D4A373]/5 focus:border-[#D4A373] outline-none transition-all"
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Total Team Members</label>
                    <div className="relative group">
                      <Users className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#D4A373] transition-colors" />
                      <select 
                        className="w-full bg-white border border-gray-200 pl-16 pr-8 py-5 text-[#1A2B3C] font-black focus:ring-4 focus:ring-[#D4A373]/5 focus:border-[#D4A373] outline-none transition-all appearance-none cursor-pointer"
                        onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} className="bg-white">{n} {n === 1 ? 'Explorer' : 'Explorers'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1A2B3C] text-white py-7 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.01] transition-all flex items-center justify-center gap-4 group"
              >
                Continue to Selection
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4">
            <OrderSummary adventure={adventure} passengers={formData.passengers} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, placeholder, icon, onChange }: { label: string, placeholder: string, icon?: React.ReactNode, onChange: (v: string) => void }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">{label}</label>
    <div className="relative group">
      {icon && React.cloneElement(icon as React.ReactElement, { className: "absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#D4A373] transition-colors" })}
      <input 
        required
        type="text" 
        placeholder={placeholder}
        className={`w-full bg-white border border-gray-200 ${icon ? 'pl-16' : 'px-8'} pr-8 py-5 text-[#1A2B3C] font-black placeholder:text-gray-200 focus:ring-4 focus:ring-[#D4A373]/5 focus:border-[#D4A373] outline-none transition-all`}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const OrderSummary = ({ adventure, passengers }: { adventure: any, passengers: number }) => (
  <div className="bg-white border border-gray-100 p-10 shadow-2xl sticky top-48 space-y-10">
    <h2 className="text-xl font-serif-luxury text-[#1A2B3C] uppercase tracking-wider">Expedition Summary</h2>
    
    <div className="flex gap-6 border-b border-gray-100 pb-8">
      <div className="w-20 h-20 overflow-hidden shadow-xl flex-shrink-0 border border-gray-100">
        <img src={adventure.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="space-y-2 py-1">
        <h3 className="font-serif-luxury text-[#1A2B3C] leading-tight text-sm uppercase tracking-wider line-clamp-2">{adventure.title}</h3>
        <div className="flex items-center gap-2 text-[#D4A373]">
          <MapPin className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-widest">{adventure.location.split(',')[0]}</span>
        </div>
      </div>
    </div>

    <div className="space-y-5 pt-2">
      <SummaryRow label="Base Fee" value={adventure.price} />
      <SummaryRow label="Explorers" value={`× ${passengers}`} />
      <SummaryRow label="Gear & Logistics" value="Included" highlight />
      
      <div className="pt-8 border-t border-gray-100">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Payable</p>
        <p className="text-4xl font-serif-luxury text-[#1A2B3C]">
          ₹{(parseInt(adventure.price.replace(/[^\d]/g, '')) * passengers).toLocaleString('en-IN')}
        </p>
      </div>
    </div>

    <div className="bg-[#FDFBF7] p-6 flex gap-4 border border-gray-100 italic">
      <Clock className="w-5 h-5 text-[#D4A373] flex-shrink-0" />
      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
        Secure your slot within <span className="text-[#1A2B3C]">15:00</span> minutes.
      </p>
    </div>
  </div>
);

const SummaryRow = ({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400 font-black uppercase tracking-widest text-[8px]">{label}</span>
    <span className={`font-black uppercase tracking-widest text-[10px] ${highlight ? 'text-[#D4A373]' : 'text-[#1A2B3C]'}`}>{value}</span>
  </div>
);

export default BookingPage;
