'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ChevronLeft, HelpCircle, User, CheckCircle2, ShieldCheck, Coffee, Tent, Map, Camera, Loader2 } from 'lucide-react';
import WeatherWidget from '@/components/WeatherWidget';
import { Adventure } from '@/data/adventures';

const AdventureDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/adventures?id=${id}`);
        if (!response.ok) throw new Error('Adventure not found');
        const data = await response.json();
        setAdventure(data);
      } catch (err: any) {
        setError(err.message);
        // Fallback to static data
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
        <p className="text-gray-400 font-medium animate-pulse">Loading adventure details...</p>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <h1 className="text-2xl font-bold mb-4 text-[#1A2B3C]">Adventure Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-[#1A2B3C] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-black/10"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-48 pb-24 w-full overflow-x-hidden text-[#1A2B3C]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-[#1A2B3C] mb-12 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Expeditions</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Side: Cinematic Image Section */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group">
              <div className="aspect-[16/10] overflow-hidden shadow-2xl border border-gray-100">
                <img 
                  src={adventure.image} 
                  alt={adventure.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xl border border-gray-100 text-[#1A2B3C] px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-2xl">
                View 360° Gallery
              </button>
            </div>

            {/* Overview */}
            <section className="space-y-8">
              <div className="space-y-4 border-b border-gray-100 pb-8">
                 <div className="inline-block bg-gray-50 text-[#1A2B3C] px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-gray-100">
                   The Experience
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif-luxury uppercase tracking-wider leading-tight">
                   Discover {adventure.title}
                 </h2>
              </div>
              <p className="text-gray-500 leading-relaxed text-lg font-medium opacity-80">
                {adventure.description}
              </p>
            </section>

            {/* What's Included */}
            <section className="space-y-8">
              <div className="space-y-4">
                 <div className="inline-block bg-gray-50 text-[#1A2B3C] px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-gray-100">
                   Inclusions
                 </div>
                 <h2 className="text-3xl font-serif-luxury uppercase tracking-wider">What's Included</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { icon: <Coffee className="w-5 h-5" />, label: "All Meals" },
                  { icon: <Tent className="w-5 h-5" />, label: "Luxury Tents" },
                  { icon: <ShieldCheck className="w-5 h-5" />, label: "Full Insurance" },
                  { icon: <Map className="w-5 h-5" />, label: "Local Guides" },
                  { icon: <Camera className="w-5 h-5" />, label: "Photography" },
                  { icon: <User className="w-5 h-5" />, label: "Porters" }
                ].map((inc, i) => (
                  <div key={i} className="bg-[#FDFBF7] border border-gray-100 p-6 flex flex-col items-center text-center gap-3 hover:bg-white hover:shadow-xl transition-all">
                    <div className="text-[#D4A373]">{inc.icon}</div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{inc.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Vertical Timeline Itinerary */}
            <section className="space-y-12">
               <div className="space-y-4">
                 <div className="inline-block bg-gray-50 text-[#1A2B3C] px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-gray-100">
                   Route Map
                 </div>
                 <h2 className="text-3xl font-serif-luxury uppercase tracking-wider">Vertical Itinerary</h2>
               </div>
               
               <div className="space-y-0 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                  {adventure.itinerary.map((item, index) => (
                    <div key={index} className="relative pl-16 pb-12 last:pb-0 group">
                      <div className="absolute left-0 top-1 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center z-10 group-hover:bg-[#1A2B3C] group-hover:border-[#1A2B3C] transition-colors duration-500">
                        <span className="text-[9px] font-black text-[#1A2B3C] group-hover:text-white">{item.day}</span>
                      </div>
                      <div className="space-y-3 bg-[#FDFBF7] border border-gray-100 p-8 hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all">
                        <h3 className="text-xl font-serif-luxury text-[#1A2B3C] tracking-tight uppercase">{item.title}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed opacity-80">{item.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Side: Sticky Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-48">
            <div className="bg-white border border-gray-100 p-10 space-y-10 shadow-2xl shadow-black/5">
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-gray-100 pb-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                    <span className="text-4xl font-serif-luxury text-[#1A2B3C]">{adventure.price}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex gap-1 text-[#D4A373] justify-end">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified 5.0</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#FDFBF7] p-5 border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-base font-black text-[#1A2B3C] uppercase tracking-wider">{adventure.duration}</p>
                   </div>
                   <div className="bg-[#FDFBF7] p-5 border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Difficulty</p>
                      <p className="text-base font-black text-[#D4A373] uppercase tracking-wider">{adventure.difficulty}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => router.push(`/adventures/${adventure.id}/book`)}
                  className="w-full bg-[#1A2B3C] text-white py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                >
                  Reserve Expedition
                </button>
                <button className="w-full bg-white border border-gray-200 text-[#1A2B3C] py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#D4A373]" />
                  Download PDF Info
                </button>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Trip Highlights</p>
                <div className="grid grid-cols-1 gap-4">
                  {adventure.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-6 h-6 bg-[#1A2B3C]/5 rounded flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-[#D4A373]" />
                       </div>
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-6 border border-gray-100">
                 <p className="text-[10px] text-[#D4A373] font-black uppercase tracking-widest text-center italic">Only 4 slots remaining for June</p>
              </div>

              <WeatherWidget location={adventure.title.split(' ').slice(-1)[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetailPage;
