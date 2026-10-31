import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function EventsV2({ events, onExploreEvents, cmsBlocks }) {
  const sectionTag = cmsBlocks?.events_header?.sectionTag || 'Past Events';
  const viewAllText = cmsBlocks?.events_header?.viewAllText || 'View All Events';

  const displayEvents = events && events.length > 0 ? events.slice(0, 4) : [
    {
      id: 'ev-1',
      date: '03 - 04 FEB, 2026',
      title: 'Sahityam 2026 - CGC University',
      location: 'Mohali, PB',
      images: ['/assets/cgc1.jpg'],
    },
    {
      id: 'ev-3',
      date: '06 SEP, 2025',
      title: 'PTM - Doon Public School',
      location: 'Sec 21, Panchkula, HR',
      images: ['/assets/d2.jpg'],
    },
    {
      id: 'ev-4',
      date: '07 - 13 NOV, 2025',
      title: 'Pustak Mela - Indradhanush Auditorium',
      location: 'Sec 5, Panchkula, HR',
      images: ['/assets/event1.jpg'],
    },
    {
      id: 'ev-2',
      date: '21 - 23 FEB, 2025',
      title: 'Cyanide 2025 - Panjab University',
      location: 'Sec 14, Chandigarh',
      images: ['/assets/pu1.jpg'],
    },
  ];

  return (
    <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header with View All link */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-[0.25em] text-[#A36B42] uppercase">
            {sectionTag}
          </div>
        </div>

        <button
          onClick={onExploreEvents}
          className="text-xs font-bold text-[#242220] hover:text-[#A36B42] flex items-center space-x-1 underline decoration-1 underline-offset-4"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Cards Grid - Exact replica of attached mockup */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-[#EFEBE2] rounded-3xl overflow-hidden border border-[#A36B42]/15 hover:border-[#A36B42]/40 transition-all duration-300 flex flex-col justify-between shadow-sm hover:-translate-y-1"
          >
            {/* Event Photo */}
            <div className="relative h-48 overflow-hidden bg-[#242220]">
              <img
                src={ev.images && ev.images[0] ? ev.images[0] : '/assets/cgc1.jpg'}
                alt={ev.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Event Info */}
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A36B42] flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{ev.date}</span>
                </div>

                <h4 className="font-bold text-sm text-[#242220] mt-1 line-clamp-2 leading-snug">
                  {ev.title}
                </h4>
              </div>

              <div className="pt-2 flex items-center space-x-1 text-[11px] text-[#5C554E]">
                <MapPin className="w-3.5 h-3.5 text-[#A36B42] shrink-0" />
                <span>{ev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
