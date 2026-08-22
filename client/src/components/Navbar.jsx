import React, { useState } from 'react';
import { BookOpen, Sparkles, Calendar, Heart, ShieldCheck, Menu, X, Compass, Sun, Moon } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenHostModal,
  onOpenVolunteerModal,
  onOpenAdminModal,
  isAdmin,
  theme,
  toggleTheme,
  siteSettings,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'kids', label: 'Kids Wisdom Corner 🎈', icon: Sparkles, highlight: true },
    { id: 'books', label: 'Book Catalog', icon: BookOpen },
    { id: 'events', label: 'Campus Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={siteSettings?.logoConfig?.logoUrl || '/assets/ekatva_v3_logo_1.jpg'} 
                alt="Tricity Bookstall Logo"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/ekatva_logo_1.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {siteSettings?.logoConfig?.title || 'Ekatva Foundation'}
                </span>
                <span className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-orange-500/30">
                  Tricity
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                {siteSettings?.logoConfig?.subtitle || 'Wisdom Bookstall Initiative'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                        : 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : item.highlight
                      ? 'text-pink-600 dark:text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.highlight && !isActive ? 'animate-bounce' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Theme Switcher */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
              className="p-2.5 rounded-xl border transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              )}
            </button>

            <button
              onClick={onOpenVolunteerModal}
              className="flex items-center space-x-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Volunteer</span>
            </button>

            <button
              onClick={onOpenHostModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Invite Bookstall</span>
            </button>


          </div>

          {/* Mobile Menu & Theme Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400 fill-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                onOpenHostModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-orange-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg"
            >
              Invite Stall
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
