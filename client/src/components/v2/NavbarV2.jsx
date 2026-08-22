import React, { useState } from 'react';
import { BookOpen, ArrowRight, Menu, X, Layers } from 'lucide-react';

export default function NavbarV2({
  activeTab,
  setActiveTab,
  onOpenHostModal,
  onOpenAdminModal,
  isAdmin,
  siteVersion,
  setSiteVersion,
  siteSettings,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoTitle = siteSettings?.logoConfig?.title || 'Ekatva Foundation';
  const logoSubtitle = siteSettings?.logoConfig?.subtitle || 'Clarity of Mind • Freedom of Being';
  const showVersionToggle = siteSettings?.showVersionToggle === true;

  const navLinks = [
    { id: 'home', label: 'About Us' },
    { id: 'impact', label: 'Our Impact' },
    { id: 'books', label: 'Book Catalog' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
  ];

  const handleNavClick = (linkId) => {
    if (linkId === 'impact') {
      const el = document.getElementById('impact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveTab('home');
      }
    } else if (linkId === 'gallery' || linkId === 'events') {
      setActiveTab('events');
    } else {
      setActiveTab(linkId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#A36B42]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22 py-3">
          
          {/* Logo & Branding - Dynamic Logo Title & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-full bg-[#EFEBE2] border border-[#A36B42]/30 flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/assets/ekatva_v3_logo_1.jpg" 
                alt="Ekatva Foundation Logo" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/cropped-IMG-20260203-WA0031.jpg';
                }}
              />
            </div>
            <div>
              <div className="font-serif-editorial font-bold text-xl sm:text-2xl text-[#242220] tracking-tight group-hover:text-[#A36B42] transition-colors leading-none">
                {logoTitle}
              </div>
              <div className="text-[10px] font-bold tracking-wider text-[#A36B42] mt-0.5">
                {logoSubtitle}
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-[#4A443E]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`hover:text-[#242220] transition-colors relative py-1 ${
                  (activeTab === link.id || (link.id === 'gallery' && activeTab === 'events')) ? 'text-[#242220] font-bold border-b-2 border-[#A36B42]' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Optional Version Toggle Badge (Only shown if enabled in Admin Settings) */}
            {showVersionToggle && (
              <button
                onClick={() => setSiteVersion(siteVersion === 'v2' ? 'v1' : 'v2')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#EFEBE2] text-[#A36B42] border border-[#A36B42]/30 hover:bg-[#E5DFD3] transition-all"
                title="Switch Site Design Version"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Version: <strong>v2 Editorial</strong></span>
              </button>
            )}

            {/* Dark Textured Pill CTA */}
            <button
              onClick={onOpenHostModal}
              className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
            >
              Invite a Bookstall
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {showVersionToggle && (
              <button
                onClick={() => setSiteVersion(siteVersion === 'v2' ? 'v1' : 'v2')}
                className="p-2 rounded-full bg-[#EFEBE2] text-[#A36B42] text-xs font-bold"
              >
                v2
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#EFEBE2] text-[#242220]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F4EE] border-b border-[#A36B42]/20 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                handleNavClick(link.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#242220] hover:bg-[#EFEBE2]"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenHostModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center bg-[#242220] text-white font-bold text-xs py-3 rounded-full shadow-md"
          >
            Invite a Bookstall
          </button>
        </div>
      )}
    </header>
  );
}
