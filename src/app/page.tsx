import React from "react";
import SearchHero from "@/components/SearchHero";
import AdventureCard from "@/components/AdventureCard";
import JourneyGallery from "@/components/JourneyGallery";
import Sponsorship from "@/components/Sponsorship";
import { adventures } from "@/data/adventures";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featuredAdventures = adventures.slice(0, 4);

  return (
    <div className="bg-white w-full overflow-x-hidden">
      <SearchHero />
      
      {/* Expeditions Teaser (Updated with Cards) */}
      <section className="bg-[#FDFBF7] py-16 overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-[#1A2B3C]/5 text-[#1A2B3C] px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-[#1A2B3C]/10">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                Handpicked Journeys
              </div>
              <h2 className="text-4xl md:text-7xl font-serif-luxury text-[#1A2B3C] tracking-tight leading-none">
                Legendary <br />
                <span className="text-[#D4A373] italic font-light">Expeditions</span>
              </h2>
            </div>
            <Link 
              href="/expeditions"
              className="group flex items-center gap-4 text-[#1A2B3C] font-black text-[11px] uppercase tracking-[0.3em] hover:text-[#D4A373] transition-colors mb-2"
            >
              Explore All
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#D4A373] group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredAdventures.map((adventure) => (
              <AdventureCard key={adventure.id} adventure={adventure} />
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center space-y-8">
         <h2 className="text-4xl md:text-6xl font-serif-luxury text-[#1A2B3C] tracking-tight leading-none">
           Committed to <br />
           <span className="text-[#D4A373] italic font-light">Excellence</span>
         </h2>
         <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
           Our mission is to provide unparalleled luxury expeditions that respect the environment and empower local communities.
         </p>
         <Link 
            href="/about"
            className="inline-block text-[#1A2B3C] font-black text-[11px] uppercase tracking-[0.2em] border-b-2 border-[#D4A373] pb-2 hover:text-[#D4A373] transition-colors"
         >
           Read Our Story
         </Link>
      </section>

      <JourneyGallery />
      <Sponsorship />
    </div>
  );
}
