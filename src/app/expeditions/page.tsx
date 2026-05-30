import React from "react";
import AdventureList from "@/components/AdventureList";
import AITripPlanner from "@/components/AITripPlanner";
import { Sparkles } from "lucide-react";

export default function ExpeditionsPage() {
  return (
    <div className="bg-white w-full">
      {/* Expeditions Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-3 bg-[#1A2B3C]/5 text-[#1A2B3C] px-8 py-3 rounded-full text-[10px] font-black tracking-[0.4em] uppercase border border-[#1A2B3C]/10 mb-10">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          Featured Journeys
        </div>
        <h1 className="text-5xl md:text-7xl font-serif-luxury text-[#1A2B3C] tracking-tight leading-[0.9] mb-10">
          Legendary <br />
          <span className="text-[#D4A373] italic font-light">Expeditions</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Curated small-group journeys to the world's most astonishing places, led by experts who live for discovery.
        </p>
      </section>

      <AdventureList />
      <AITripPlanner />
    </div>
  );
}
