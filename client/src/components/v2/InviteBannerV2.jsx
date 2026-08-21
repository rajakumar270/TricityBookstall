import React from 'react';
import { ArrowRight, Building } from 'lucide-react';

export default function InviteBannerV2({ onHostStall }) {
  return (
    <section id="invite" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#EFEBE2] rounded-3xl p-8 sm:p-12 border border-[#A36B42]/20 shadow-md relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[11px] font-bold tracking-[0.25em] text-[#A36B42] uppercase">
            Be a part of the movement
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#242220] font-normal leading-tight">
            Invite a Bookstall <br />
            to Your Institution
          </h2>

          <p className="text-sm text-[#5C554E] max-w-md leading-relaxed">
            Let's bring meaningful books and conversations to your campus, event, or community.
          </p>

          <div className="pt-2">
            <button
              onClick={onHostStall}
              className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-7 py-3.5 rounded-full shadow-md flex items-center space-x-2 transition-all hover:scale-105"
            >
              <span>Invite Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Taped Photo Display */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="tape-effect relative w-full max-w-md h-64 sm:h-72 rounded-2xl overflow-hidden border-4 border-[#F7F4EE] shadow-xl">
            <img 
              src="/assets/cgc2.jpg" 
              alt="Bookstall setup at campus" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
