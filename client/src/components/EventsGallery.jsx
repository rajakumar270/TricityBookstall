import React, { useState } from 'react';
import { MapPin, Calendar, Camera, X, ExternalLink, Sparkles } from 'lucide-react';

export default function EventsGallery({ events }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [previewImage, setPreviewImage] = useState(null);

  const locations = ['All', 'Panjab University', 'CGC University', 'Doon Public School', 'Indradhanush Auditorium'];

  const filteredEvents = events.filter((ev) => {
    if (activeFilter === 'All') return true;
    return ev.title.toLowerCase().includes(activeFilter.toLowerCase()) || ev.location.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Live Stalls & Campus Footprints</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Recent Campus <span className="text-blue-400">Events & Bookstalls</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300">
          Inspiring dialogues, student interactions, and philosophical exploration across schools, colleges, and auditoriums in Tricity.
        </p>
      </div>

      {/* Campus Filters */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveFilter(loc)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === loc
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="mt-10 space-y-12">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6"
          >
            {/* Title & Metadata Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
                    {event.category}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{event.location}</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {event.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewImage(imgUrl)}
                  className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-800"
                >
                  <img
                    src={imgUrl}
                    alt={`${event.title} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Photo</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/80 text-white p-2 rounded-full hover:bg-slate-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Campus Event Preview"
              className="w-full max-h-[80vh] object-contain bg-black"
            />
          </div>
        </div>
      )}

    </section>
  );
}
