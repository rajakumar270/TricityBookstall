import React from 'react';
import { Building, Tent, MessageCircle, BookMarked } from 'lucide-react';

export default function WhatWeDoV2() {
  const cards = [
    {
      title: 'Schools & Colleges',
      description: 'Bringing value-based literature closer to students and educators.',
      icon: Building,
    },
    {
      title: 'Events & Fairs',
      description: 'Engaging communities through book fairs, melas, and cultural events.',
      icon: Tent,
    },
    {
      title: 'Meaningful Dialogue',
      description: 'Encouraging conversations that nurture clarity, character and compassion.',
      icon: MessageCircle,
    },
    {
      title: 'Curated Selection',
      description: 'Handpicked books on philosophy, self-growth, indian thought and mindful living.',
      icon: BookMarked,
    },
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold tracking-[0.25em] text-[#A36B42] uppercase">
          What We Do
        </div>
        
        <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#242220] font-normal">
          Creating Spaces for Wisdom & Growth
        </h2>
      </div>

      {/* 4 Cards Grid - Parchment Vintage Aesthetic */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-[#EFEBE2] p-8 rounded-3xl border border-[#A36B42]/15 hover:border-[#A36B42]/40 transition-all duration-300 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 shadow-sm"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#F7F4EE] border border-[#A36B42]/25 flex items-center justify-center text-[#A36B42]">
                <Icon className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h3 className="font-serif-editorial text-xl font-bold text-[#242220]">
                {card.title}
              </h3>

              <p className="text-xs text-[#5C554E] leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
}
