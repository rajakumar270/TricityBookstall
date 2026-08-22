import React from 'react';
import { Building, Tent, MessageCircle, BookMarked } from 'lucide-react';

const ICONS = [Building, Tent, MessageCircle, BookMarked];

export default function WhatWeDoV2({ cmsBlocks }) {
  const whatWeDo = cmsBlocks?.what_we_do;
  const cards = whatWeDo?.cards || [
    {
      title: 'Schools & Colleges',
      description: 'Bringing value-based literature closer to students and educators.',
    },
    {
      title: 'Events & Fairs',
      description: 'Engaging communities through book fairs, melas, and cultural events.',
    },
    {
      title: 'Meaningful Dialogue',
      description: 'Encouraging conversations that nurture clarity, character and compassion.',
    },
    {
      title: 'Curated Selection',
      description: 'Handpicked books on philosophy, self-growth, indian thought and mindful living.',
    },
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      
      {/* Section Subheading / Label */}
      <div className="text-[11px] font-bold tracking-[0.25em] text-[#A36B42] uppercase mb-3">
        {whatWeDo?.sectionTitle || 'What We Do'}
      </div>

      {/* Section Title */}
      <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#242220] font-normal mb-12">
        {whatWeDo?.sectionSubtitle || 'Spreading clarity & character through books and conversation'}
      </h2>

      {/* 4 Cards Grid - Light Parchment Cards with Top Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {cards.map((card, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          return (
            <div 
              key={idx}
              className="bg-[#EFEBE2] rounded-3xl p-6 border border-[#A36B42]/20 hover:border-[#A36B42]/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-[#A36B42]/30 flex items-center justify-center text-[#A36B42] mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Card Title */}
                <h3 className="font-serif-editorial text-xl text-[#242220] font-bold mb-2">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Subtle Tag */}
              <div className="pt-4 mt-4 border-t border-[#A36B42]/10 flex items-center justify-between text-[10px] font-bold tracking-wider text-[#A36B42] uppercase">
                <span>Pillar 0{idx + 1}</span>
                <span>✦</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
