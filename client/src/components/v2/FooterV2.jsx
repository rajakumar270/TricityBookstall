import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function FooterV2({ setActiveTab, onOpenHostModal, siteSettings }) {
  const logoTitle = siteSettings?.logoConfig?.title || 'Ekatva Foundation';
  const logoSubtitle = siteSettings?.logoConfig?.subtitle || 'Clarity of Mind • Freedom of Being';
  const logoImg = siteSettings?.logoConfig?.logoUrl || '/assets/ekatva_v3_logo_1.jpg';
  const contact = siteSettings?.contactInfo || {};

  return (
    <footer className="bg-[#F7F4EE] border-t border-[#A36B42]/20 pt-14 pb-8 text-[#242220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#A36B42]/20">
          
          {/* Col 1: Brand & Socials */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-[#EFEBE2] border border-[#A36B42]/30 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={logoImg}
                  alt={logoTitle}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.src = '/assets/ekatva_logo_1.jpg'; }}
                />
              </div>
              <div>
                <span className="font-serif-editorial font-bold text-xl text-[#242220] block leading-none">{logoTitle}</span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#A36B42]">{logoSubtitle}</span>
              </div>
            </div>

            <p className="text-xs text-[#5C554E] max-w-sm leading-relaxed">
              Spreading wisdom. Cultivating character. Transforming communities across Chandigarh, Mohali, and Panchkula through character-building literature.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#EFEBE2] border border-[#A36B42]/30 flex items-center justify-center text-[#242220] hover:text-[#A36B42] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#EFEBE2] border border-[#A36B42]/30 flex items-center justify-center text-[#242220] hover:text-[#A36B42] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.youtube && (
                <a href={contact.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#EFEBE2] border border-[#A36B42]/30 flex items-center justify-center text-[#242220] hover:text-[#A36B42] transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#A36B42] uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#5C554E]">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#242220]">About Us</button></li>
              <li><button onClick={() => setActiveTab('books')} className="hover:text-[#242220]">Book Catalog</button></li>
              <li><button onClick={() => setActiveTab('events')} className="hover:text-[#242220]">Campus Events</button></li>
              <li><button onClick={onOpenHostModal} className="hover:text-[#242220]">Invite a Bookstall</button></li>
              <li><button onClick={() => setActiveTab('kids')} className="hover:text-[#242220]">Kids Wisdom Corner</button></li>
            </ul>
          </div>

          {/* Col 3: Get In Touch */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#A36B42] uppercase">
              Get In Touch
            </h4>
            
            <div className="space-y-2.5 text-xs text-[#5C554E]">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#A36B42] shrink-0" />
                <span>{contact.phone || '+91 80544 48521'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#A36B42] shrink-0" />
                <span>{contact.email || 'ekatvafoundation.bookstall@gmail.com'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#A36B42] shrink-0" />
                <span>{contact.address || 'Chandigarh (Tri-City), India'}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 text-center text-xs text-[#5C554E]">
          © {new Date().getFullYear()} {logoTitle} Bookstall Initiative. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
