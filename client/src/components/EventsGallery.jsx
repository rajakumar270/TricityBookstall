import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Building2, Users, ArrowRight, Award, ExternalLink, Image as ImageIcon } from 'lucide-react';

const FALLBACK_EVENTS = [
  {
    id: 'e1',
    title: 'CGC Landran Bookstall & PTM Wisdom Pavilion',
    location: 'CGC Landran Campus, Mohali',
    date: 'Feb 2026',
    category: 'University Fest',
    description: 'Engaged 1,200+ students and parents during annual day fest with interactive book displays and character literature.',
    images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg'],
    attendees: '1200+ Students',
  },
  {
    id: 'e2',
    title: 'CU Student Literature Dialogue Stall',
    location: 'Chandigarh University, Gharuan',
    date: 'Jan 2026',
    category: 'University Fest',
    description: 'Special youth literature stall focusing on mental clarity, exam stress reduction, and self-reflection books.',
    images: ['/assets/cu1.jpg', '/assets/cgc1.jpg'],
    attendees: '2500+ Youth',
  },
  {
    id: 'e3',
    title: 'Sector 17 Plaza Open Literature Bookstall',
    location: 'Sector 17 Plaza, Chandigarh',
    date: 'Jan 2026',
    category: 'Book Fair',
    description: 'Community weekend stall serving Tricity residents with Vedanta & youth development literature.',
    images: ['/assets/cgc2.jpg', '/assets/cu1.jpg'],
    attendees: '800+ Visitors',
  },
];

export default function EventsGallery({ events, onHostStall, siteVersion = 'v2' }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'University Fest', 'School PTM', 'Book Fair'];

  const isV2 = siteVersion === 'v2';

  const rawEvents = Array.isArray(events) && events.length > 0 ? events : FALLBACK_EVENTS;

  const filteredEvents = rawEvents.filter((ev) => {
    if (selectedCategory === 'All') return true;
    const evCat = (ev.category || '').toLowerCase().trim();
    const selCat = selectedCategory.toLowerCase().trim();

    // Direct exact or substring match
    if (evCat === selCat) return true;

    // Cross-match PTM categories (e.g. "PTM Stall", "School PTM", "PTM")
    if (selCat === 'school ptm' && (evCat.includes('ptm') || evCat.includes('school'))) return true;
    
    // Cross-match University / College Fest
    if (selCat === 'university fest' && (evCat.includes('fest') || evCat.includes('university') || evCat.includes('campus') || evCat.includes('college'))) return true;
    
    // Cross-match Book Fair / Community
    if (selCat === 'book fair' && (evCat.includes('fair') || evCat.includes('plaza') || evCat.includes('community') || evCat.includes('open'))) return true;

    return evCat.includes(selCat) || selCat.includes(evCat);
  });

  return (
    <section id="events" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
          isV2
            ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#A36B42]'
            : 'bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>Real Campus & Community Impact</span>
        </div>
        
        <h2 className={`text-3xl sm:text-5xl tracking-tight ${isV2 ? 'font-serif-editorial text-[#242220]' : 'font-extrabold text-slate-900 dark:text-white'}`}>
          Recent Campus <span className={isV2 ? 'text-[#A36B42] italic font-semibold' : 'bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'}>Events & Bookstalls</span>
        </h2>
        
        <p className={`text-sm sm:text-base ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
          Photographic glimpses of wisdom bookstalls hosted at Panjab University, CGC Landran, Doon Public School, and public auditoriums.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-8 flex justify-center">
        <div className={`inline-flex p-1.5 rounded-2xl border shadow-sm max-w-full overflow-x-auto ${
          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
        }`}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? isV2 
                      ? 'bg-[#242220] text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-md'
                    : isV2 ? 'text-[#5C554E] hover:text-[#242220]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map((ev) => {
          const evImages = Array.isArray(ev.images) && ev.images.length > 0
            ? ev.images
            : (ev.image ? [ev.image] : ['/assets/cgc1.jpg', '/assets/cgc2.jpg']);

          return (
            <div
              key={ev.id || ev.title}
              className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm ${
                isV2
                  ? 'bg-[#EFEBE2] border-[#A36B42]/20 hover:border-[#A36B42]/50 hover:-translate-y-1'
                  : 'glass-card border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
              }`}
            >
              <div className="p-6 space-y-4">
                
                {/* Event Badge & Title */}
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <span className={`inline-block border text-[11px] font-bold px-3 py-1 rounded-full mb-2 ${
                      isV2 ? 'bg-[#F7F4EE] text-[#A36B42] border-[#A36B42]/30' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    }`}>
                      {ev.category || 'Campus Event'}
                    </span>
                    <h3 className={`text-xl leading-snug ${isV2 ? 'font-serif-editorial font-bold text-[#242220]' : 'font-bold text-slate-900 dark:text-white'}`}>
                      {ev.title}
                    </h3>
                  </div>

                  <div className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-xl border ${
                    isV2 ? 'bg-[#F7F4EE] text-[#A36B42] border-[#A36B42]/30' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date || 'Recent'}</span>
                  </div>
                </div>

                {/* Location pin */}
                <div className={`flex items-center space-x-1.5 text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-400'}`}>
                  <MapPin className={`w-4 h-4 shrink-0 ${isV2 ? 'text-[#A36B42]' : 'text-orange-500'}`} />
                  <span>{ev.location || 'Tricity Campus'}</span>
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm leading-relaxed ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
                  {ev.description}
                </p>
              </div>

              {/* Photo Collage Thumbnail Strip */}
              <div className="px-6 pb-6 pt-2">
                <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center space-x-1 ${isV2 ? 'text-[#A36B42]' : 'text-slate-500 dark:text-slate-400'}`}>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Event Snapshots</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {evImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border group cursor-pointer ${
                        isV2 ? 'bg-[#242220] border-[#A36B42]/20' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${ev.title} photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Institutional Invite Banner */}
      <div className={`mt-14 rounded-3xl p-8 sm:p-10 border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
        isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'glass-panel border-orange-500/30'
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <h3 className={`text-2xl ${isV2 ? 'font-serif-editorial font-bold text-[#242220]' : 'font-extrabold text-slate-900 dark:text-white'}`}>
            Want to Host a Wisdom Bookstall at Your Institution?
          </h3>
          <p className={`text-sm max-w-2xl ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
            We collaborate with student councils, fests, PTMs, and NSS/NCC wings to set up engaging bookstalls with zero institutional setup cost.
          </p>
        </div>

        <button
          onClick={onHostStall}
          className={`whitespace-nowrap font-bold text-xs px-6 py-3.5 rounded-full shadow-md transition-all ${
            isV2
              ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-105'
              : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
          }`}
        >
          Submit Stall Request Form
        </button>
      </div>

    </section>
  );
}
