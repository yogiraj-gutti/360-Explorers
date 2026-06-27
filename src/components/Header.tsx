'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useSearch } from './SearchContext';
import Link from 'next/link';

const Header = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="relative z-50 bg-white py-4 shadow-sm border-b border-gray-100 transition-all duration-300">
      {/* Main Navigation */}
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center cursor-pointer min-w-[180px]" 
          onClick={() => setSearchQuery('')}
        >
          <span className="text-[20px] font-serif-luxury tracking-[0.15em] leading-none text-black font-black">360 EXPLORER</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
          {[
            { name: 'Home', href: '/', hasDropdown: false },
            { name: 'Destinations', href: '/destinations', hasDropdown: true },
            { name: 'Expeditions', href: '/expeditions', hasDropdown: true },
            { name: 'About', href: '/about', hasDropdown: true },
            { name: 'Contact', href: '/contact', hasDropdown: false }
          ].map((item) => (
            <Link key={item.name} href={item.href} className="relative group cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-black hover:text-[#D4A373] transition-colors font-black">
                {item.name}
                {item.hasDropdown && (
                  <svg className="w-2.5 h-2.5 transition-transform group-hover:rotate-180 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center justify-end min-w-[180px] gap-3">
          <Link href="/expeditions" className="px-7 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl bg-black text-white hover:bg-[#D4A373] shadow-black/10 font-black">
            Plan A Trip
          </Link>
          
          <button className="lg:hidden p-2 ml-4 text-black">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
