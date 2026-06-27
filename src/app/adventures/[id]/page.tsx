'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ChevronLeft, Share2, MessageCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import WeatherWidget from '@/components/WeatherWidget';
import { Adventure } from '@/data/adventures';
import { useSearch } from '@/components/SearchContext';

const AdventureDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currency } = useSearch();
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5001';
        const response = await fetch(`${baseUrl}/api/adventures?id=${id}`);
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
        <h1 className="text-2xl font-bold mb-4 text-black">Adventure Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-black/10"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const price = currency === 'INR' 
    ? (adventure.priceInr || adventure.price) 
    : (adventure.priceUsd || adventure.price);

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this amazing adventure: ${adventure.title}!`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        alert('For Instagram, please copy the link and share manually!');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16 w-full overflow-x-hidden text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Expeditions</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Top Section - Name + Share */}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                {adventure.title}
              </h1>
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Share</span>
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 min-w-[150px]">
                    <div className="flex justify-end mb-2">
                      <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-black">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md text-sm">
                        WhatsApp
                      </button>
                      <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md text-sm">
                        Facebook
                      </button>
                      <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md text-sm">
                        Twitter/X
                      </button>
                      <button onClick={() => handleShare('instagram')} className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md text-sm">
                        Instagram
                      </button>
                      <button onClick={() => handleShare('copy')} className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md text-sm">
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-gray-100">
              <img 
                src={adventure.image} 
                alt={adventure.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* City/Country Below Image */}
            <div className="inline-block border border-gray-300 px-4 py-2 rounded-full">
              <span className="text-sm font-bold">{adventure.location}</span>
            </div>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase tracking-wider">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {adventure.description}
              </p>
            </section>

            {/* Itinerary */}
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider">Itinerary</h2>
              <div className="space-y-4">
                {adventure.itinerary.map((item, index) => (
                  <div key={index} className="border-l-4 border-gray-300 pl-6">
                    <h3 className="text-lg font-bold">
                      Day {item.day}: {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                    {item.details && (
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {item.details.elevation && <p><strong>Elevation:</strong> {item.details.elevation}</p>}
                        {item.details.distance && <p><strong>Distance:</strong> {item.details.distance}</p>}
                        {item.details.hikingTime && <p><strong>Hiking Time:</strong> {item.details.hikingTime}</p>}
                        {item.details.habitat && <p><strong>Habitat:</strong> {item.details.habitat}</p>}
                        {item.details.meals && <p><strong>Meals:</strong> {item.details.meals}</p>}
                        {item.details.lodging && <p><strong>Lodging:</strong> {item.details.lodging}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions */}
            {adventure.inclusions && adventure.inclusions.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-wider">Inclusion</h2>
                <ul className="space-y-2">
                  {adventure.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{inc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exclusions */}
            {adventure.exclusions && adventure.exclusions.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-wider">Exclusion</h2>
                <ul className="space-y-2">
                  {adventure.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5 border border-gray-400 rounded-full" />
                      <span className="text-gray-700">{exc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Side - Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                      <span className="text-3xl font-black">{price}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex gap-1 text-yellow-500 justify-end">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                      </div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified {adventure.rating}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                        <p className="text-sm font-black text-black uppercase">{adventure.duration}</p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Difficulty</p>
                        <p className="text-sm font-black text-[#D4A373] uppercase">{adventure.difficulty}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button 
                    onClick={() => router.push(`/adventures/${adventure.id}/book`)}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-full text-base font-black uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    Book
                  </button>
                  
                  <a 
                    href="https://wa.me/917770000206" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full border border-gray-300 py-4 rounded-full text-sm font-black uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Talk to us
                  </a>
                </div>

                <WeatherWidget location={adventure.title.split(' ').slice(-1)[0]} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Talk to us button */}
        <div className="mt-16 flex justify-center">
          <a 
            href="https://wa.me/917770000206" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-gray-300 px-12 py-4 rounded-full text-lg font-black uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Talk with us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetailPage;
