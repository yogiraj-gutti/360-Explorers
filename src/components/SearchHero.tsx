'use client';

import React from 'react';
import { Search, MapPin, Calendar, Compass, Users, ChevronDown } from 'lucide-react';
import { useSearch } from './SearchContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SearchHero = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();

  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop" 
          alt="Scenic Landscape" 
          className="w-full h-full object-cover brightness-90 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center gap-3 mb-10">
            <span className="text-white text-[10px] font-black tracking-[0.8em] uppercase opacity-90">360 Explorer</span>
            <div className="w-12 h-[1px] bg-[#D4A373]" />
            <span className="text-[#D4A373] text-[9px] font-bold tracking-[0.5em] uppercase">Besoke Luxury Expeditions</span>
          </div>

          <h1 className="text-6xl md:text-9xl text-white font-serif-luxury leading-[0.9] tracking-[-0.02em]">
            To the Ends <br /> 
            <span className="italic font-light">of the Earth</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
            Experience the world's most remote landscapes through 
            <span className="text-white font-medium"> curated luxury journeys </span> 
            and expert-led expeditions designed for the true explorer.
          </p>
        </motion.div>

        {/* Multi-field Search Bar (Zourney Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] max-w-4xl mx-auto border border-white/20"
        >
          <div className="flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Location */}
            <div className="flex-1 flex items-center px-6 py-3 w-full group cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#1A2B3C] group-hover:text-white transition-all duration-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where to?" 
                  className="w-full bg-transparent border-none outline-none text-[#1A2B3C] font-black placeholder:text-gray-300 text-xs tracking-tight"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 flex items-center px-6 py-3 w-full group cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#1A2B3C] group-hover:text-white transition-all duration-500">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">When</label>
                <div className="flex items-center justify-between">
                  <span className="text-[#1A2B3C] font-black text-xs tracking-tight">Anytime</span>
                  <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-[#D4A373] transition-colors" />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 flex items-center px-6 py-3 w-full group cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#1A2B3C] group-hover:text-white transition-all duration-500">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Travelers</label>
                <div className="flex items-center justify-between">
                  <span className="text-[#1A2B3C] font-black text-xs tracking-tight">2 Guests</span>
                  <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-[#D4A373] transition-colors" />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-1.5 w-full lg:w-auto">
              <button 
                onClick={() => router.push('/expeditions')}
                className="w-full lg:w-auto bg-[#1A2B3C] hover:bg-[#D4A373] text-white px-8 py-4 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 group"
              >
                <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Explore
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Chat (Visual only to match image) */}
      <div className="absolute bottom-10 right-10 z-20">
        <button className="bg-[#1A2B3C]/80 backdrop-blur-md text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl hover:bg-[#1A2B3C] transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-sm font-bold uppercase tracking-widest">Chat with us</span>
        </button>
      </div>
    </section>
  );
};

export default SearchHero;
