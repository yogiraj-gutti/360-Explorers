'use client';

import React, { useState, useEffect } from 'react';
import AdventureCard from './AdventureCard';
import { useSearch } from './SearchContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { Adventure } from '../data/adventures';

const AdventureList = () => {
  const { searchQuery, selectedCategory } = useSearch();
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        const url = selectedCategory 
          ? `/api/adventures?category=${selectedCategory}` 
          : '/api/adventures';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch adventures');
        const data = await response.json();
        setAdventures(data);
      } catch (err: any) {
        setError(err.message);
        // Fallback to static data if API fails (for demo purposes)
        import('../data/adventures').then(mod => setAdventures(mod.adventures));
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, [selectedCategory]);

  const filteredAdventures = adventures.filter((adventure) => {
    const matchesSearch = adventure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adventure.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-[#D4A373] animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Curating your expeditions...</p>
      </div>
    );
  }

  return (
    <section id="adventure-list" className="max-w-7xl mx-auto px-6 py-32 w-full overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2.5 bg-[#1A2B3C]/5 text-[#1A2B3C] px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-[#1A2B3C]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            Handpicked for you
          </div>
          <h2 className="text-5xl md:text-7xl font-serif-luxury text-[#1A2B3C] tracking-tight leading-[1.1]">
            {searchQuery ? (
              <>Results for <span className="text-[#D4A373] italic">"{searchQuery}"</span></>
            ) : (
              <>Featured <br /><span className="text-[#D4A373] italic font-light">Expeditions</span></>
            )}
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl leading-relaxed">
            {searchQuery 
              ? `Found ${filteredAdventures.length} extraordinary experiences matching your search` 
              : "Discover world-class expeditions designed for the modern explorer, where luxury meets the wild."}
          </p>
        </div>
        <div className="flex gap-8 border-b border-gray-100 pb-2">
          <button className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1A2B3C] border-b-2 border-[#D4A373] pb-4 transition-all">
            Popular
          </button>
          <button className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-[#1A2B3C] transition-colors pb-4">
            Latest
          </button>
        </div>
      </div>

      {filteredAdventures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredAdventures.map((adventure) => (
            <AdventureCard key={adventure.id} adventure={adventure} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-400 font-medium">No adventures found matching your search.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-[#FF6B00] font-bold hover:underline"
          >
            Reset Search
          </button>
        </div>
      )}
    </section>
  );
};

export default AdventureList;
