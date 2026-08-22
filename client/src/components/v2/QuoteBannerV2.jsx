import React from 'react';
import { BookOpen, Quote } from 'lucide-react';

export default function QuoteBannerV2({ cmsBlocks, siteSettings }) {
  const quoteConfig = siteSettings?.quoteConfig;
  const cmsLines = cmsBlocks?.quote_banner?.lines;

  const line1 = quoteConfig?.line1 || cmsLines?.[0] || 'Books open minds.';
  const line2 = quoteConfig?.line2 || cmsLines?.[1] || 'Dialogues open possibilities.';
  const line3 = quoteConfig?.line3 || cmsLines?.[2] || 'Together, we create change.';

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative bg-[#242220] text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border border-[#A36B42]/30 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Book Illustration */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-[#3D3834] border border-[#A36B42]/40 flex items-center justify-center text-[#A36B42]">
            <BookOpen className="w-9 h-9" />
          </div>
        </div>

        {/* Center Quote Text */}
        <div className="flex-1 text-center md:text-left space-y-2 relative">
          <Quote className="w-10 h-10 text-[#A36B42]/30 absolute -top-4 -left-4 hidden md:block" />
          <blockquote className="font-serif-editorial text-2xl sm:text-3xl text-[#F7F4EE] leading-snug font-normal">
            “{line1} <br className="hidden sm:inline" />
            {line2} <br className="hidden sm:inline" />
            <span className="text-[#A36B42] italic">{line3}”</span>
          </blockquote>
        </div>

      </div>
    </section>
  );
}
