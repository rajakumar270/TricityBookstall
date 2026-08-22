import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Users, Heart, ArrowRight } from 'lucide-react';

const DEFAULT_BANNER_IMAGES = [
  '/assets/cgc1.jpg',
  '/assets/cgc2.jpg',
  '/assets/cu1.jpg',
  '/assets/ekatva_v3_logo_1.jpg',
];

const DEFAULT_STATS = [
  { label: 'Books Distributed', value: '55+', icon: BookOpen },
  { label: 'Events Conducted', value: '185+', icon: Calendar },
  { label: 'Students Engaged', value: '10K+', icon: Users },
  { label: 'Dedicated Volunteers', value: '50+', icon: Heart },
];

export default function HeroV2({ onExploreBooks, onHostStall, onExploreEvents, siteSettings, cmsBlocks }) {
  const heroCms = cmsBlocks?.hero_section || {};
  const statsCms = cmsBlocks?.impact_stats?.stats || null;
  const homeBanner = siteSettings?.homeBanner || {};

  const badgeText = heroCms.badge || homeBanner.badge || 'Clarity of Mind, Freedom of Being • स्पष्ट मन, मुक्त जीवन';
  const titleText = heroCms.title || homeBanner.title || 'Timeless Wisdom. Meaningful Dialogues. Stronger Communities.';
  const subtitleText = heroCms.subtitle || homeBanner.subtitle || 'We bring philosophical books and reflective dialogue to schools, colleges, institutions, and public events across the Tri-City.';

  const stats = statsCms && Array.isArray(statsCms) && statsCms.length === 4
    ? statsCms.map((st, i) => ({
        label: st.label,
        value: st.value,
        icon: DEFAULT_STATS[i]?.icon || BookOpen,
      }))
    : DEFAULT_STATS;

  const rawImages = homeBanner.bannerImages && homeBanner.bannerImages.length > 0
    ? homeBanner.bannerImages
    : (homeBanner.imageUrl ? [homeBanner.imageUrl, ...DEFAULT_BANNER_IMAGES.slice(1)] : DEFAULT_BANNER_IMAGES);

  const imagesList = Array.isArray(rawImages) ? rawImages.filter(Boolean) : DEFAULT_BANNER_IMAGES;

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    if (imagesList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % imagesList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [imagesList.length]);

  return (
    <section className="bg-[#F7F4EE] pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#A36B42] uppercase">
              {badgeText}
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl text-[#242220] font-normal leading-[1.12]">
              {titleText}
            </h1>

            <p className="text-sm sm:text-base text-[#5C554E] max-w-lg leading-relaxed font-normal">
              {subtitleText}
            </p>

            {/* Buttons Row */}
            <div className="pt-3 flex items-center space-x-6">
              <button
                onClick={onHostStall}
                className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-7 py-3.5 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>{heroCms.ctaSecondary || 'Invite a Bookstall'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreEvents}
                className="text-xs font-extrabold text-[#242220] hover:text-[#A36B42] underline decoration-2 underline-offset-4 transition-colors cursor-pointer"
              >
                Explore Events
              </button>
            </div>

          </div>

          {/* Right Column: Watercolor Brush Photo Frame Graphic */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            {/* Watercolor Brush Stroke Frame Container */}
            <div className="relative w-80 sm:w-96 lg:w-[420px] h-80 sm:h-96 lg:h-[420px] p-4">
              {/* Outer decorative watercolor ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#A36B42]/20 bg-[#EFEBE2]/60 blur-xs transform -rotate-3" />
              
              {/* Main Photo Frame with Animated Slideshow */}
              <div className="relative w-full h-full rounded-[45%_55%_52%_48%/52%_48%_52%_48%] overflow-hidden border-4 border-[#F7F4EE] shadow-2xl bg-[#242220]">
                {imagesList.map((imgUrl, idx) => (
                  <img 
                    key={idx}
                    src={imgUrl} 
                    alt={`Campus stall literature movement ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                      idx === activeImgIdx
                        ? 'opacity-100 scale-105 z-10'
                        : 'opacity-0 scale-110 z-0'
                    }`}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ))}

                {/* Slideshow Progress Pill Indicators */}
                <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-1.5 pointer-events-none">
                  {imagesList.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx === activeImgIdx ? 'w-5 bg-[#A36B42]' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Hand-drawn Stacked Books Sketch Asset on Bottom Right */}
              <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-[#EFEBE2] p-2.5 rounded-2xl border border-[#A36B42]/30 shadow-lg flex flex-col items-center justify-center text-center z-20">
                <BookOpen className="w-8 h-8 text-[#A36B42]" />
                <span className="text-[10px] font-bold text-[#242220] mt-1">Value Books</span>
              </div>
            </div>

          </div>

        </div>

        {/* Impact Statistics Bar */}
        <div id="impact" className="mt-16 bg-[#EFEBE2] rounded-3xl p-6 sm:p-8 border border-[#A36B42]/20 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center space-y-2 border-r last:border-r-0 border-[#A36B42]/20 px-2">
                <div className="w-10 h-10 rounded-full bg-[#F7F4EE] border border-[#A36B42]/30 flex items-center justify-center text-[#A36B42]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif-editorial font-bold text-2xl sm:text-3xl text-[#242220]">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-[#5C554E]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
