import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Building2, Users, ArrowRight, Award, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function EventsGallery({ events, onHostStall }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'University Fest', 'School PTM', 'Book Fair'];

  const filteredEvents = events.filter(ev => {
    if (selectedCategory === 'All') return true;
    return ev.category === selectedCategory;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Real Campus & Community Impact</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recent Campus <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Events & Bookstalls</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Photographic glimpses of wisdom bookstalls hosted at Panjab University, CGC Landran, Doon Public School, and public auditoriums.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex bg-white dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-full overflow-x-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              
              {/* Event Badge & Title */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <span className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                    {ev.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {ev.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date}</span>
                </div>
              </div>

              {/* Location pin */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{ev.location}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ev.description}
              </p>
            </div>

            {/* Photo Collage Thumbnail Strip */}
            <div className="px-6 pb-6 pt-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Event Snapshots</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {ev.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 group cursor-pointer"
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
        ))}
      </div>

      {/* Institutional Invite Banner */}
      <div className="mt-14 glass-panel rounded-3xl p-8 sm:p-10 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Want to Host a Wisdom Bookstall at Your Institution?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            We collaborate with student councils, fests, PTMs, and NSS/NCC wings to set up engaging bookstalls with zero institutional setup cost.
          </p>
        </div>

        <button
          onClick={onHostStall}
          className="whitespace-nowrap bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all"
        >
          Submit Stall Request Form
        </button>
      </div>

    </section>
  );
}
