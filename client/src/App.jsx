import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KidsSection from './components/KidsSection';
import BooksCatalog from './components/BooksCatalog';
import EventsGallery from './components/EventsGallery';
import GallerySection from './components/v2/GallerySection';
import HostStallModal from './components/HostStallModal';
import VolunteerModal from './components/VolunteerModal';
import BookDetailModal from './components/BookDetailModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

// V2 Parchment Editorial Theme Components
import NavbarV2 from './components/v2/NavbarV2';
import HeroV2 from './components/v2/HeroV2';
import WhatWeDoV2 from './components/v2/WhatWeDoV2';
import EventsV2 from './components/v2/EventsV2';
import QuoteBannerV2 from './components/v2/QuoteBannerV2';
import InviteBannerV2 from './components/v2/InviteBannerV2';
import FooterV2 from './components/v2/FooterV2';

import { fetchBooks, fetchEvents, fetchBookings, fetchSettingsApi, fetchCmsBlocksApi } from './services/api';

// Initial Fallback Seed Data
const initialBooksSeed = [
  {
    id: 'b1',
    title: 'Illustrated Bal Gita & Moral Tales',
    author: 'Ekatva Foundation Series',
    category: 'Kids Wisdom',
    isKidsSection: true,
    isFeatured: true,
    language: 'Hindi',
    mrp: 180,
    buyingCost: 75,
    sellingPrice: 80,
    availableStock: 45,
    description: 'Beautifully illustrated Gita stories for young kids focusing on moral values, courage, and mindfulness.',
    coverImage: '/assets/books/bal_gita.jpg',
    problemAddressedTag: 'Kids Focus & Values',
  },
  {
    id: 'b2',
    title: 'Sankalp (Mind & Action)',
    author: 'Acharya Prashant',
    category: 'Mind & Character',
    isKidsSection: false,
    isFeatured: true,
    language: 'Hindi',
    mrp: 280,
    buyingCost: 110,
    sellingPrice: 120,
    availableStock: 60,
    description: 'Transforming distraction into unwavering focus. Essential wisdom for students preparing for competitive exams.',
    coverImage: '/assets/books/sankalp.jpg',
    problemAddressedTag: 'Student Focus & Discipline',
  },
  {
    id: 'b3',
    title: 'Fearless Youth (Nirbhay Yuva)',
    author: 'Acharya Prashant',
    category: 'Self Discovery',
    isKidsSection: false,
    isFeatured: true,
    language: 'English',
    mrp: 250,
    buyingCost: 100,
    sellingPrice: 110,
    availableStock: 35,
    description: 'Breaking free from peer pressure, societal expectations, and career anxiety.',
    coverImage: '/assets/books/fearless_youth.jpg',
    problemAddressedTag: 'Overcoming Peer Pressure',
  },
  {
    id: 'b4',
    title: 'Bhagavad Gita Essentials for Students',
    author: 'Vedanta Wisdom Series',
    category: 'Vedanta & Classics',
    isKidsSection: false,
    isFeatured: true,
    language: 'Bilingual',
    mrp: 320,
    buyingCost: 140,
    sellingPrice: 150,
    availableStock: 25,
    description: 'Practical chapter summaries of Gita applied directly to modern student challenges.',
    coverImage: '/assets/books/gita_essentials.jpg',
    problemAddressedTag: 'Clarity & Self Knowledge',
  },
];

const initialEventsSeed = [
  {
    id: 'e1',
    title: 'CGC Landran Bookstall & PTM Wisdom Pavilion',
    location: 'CGC Landran Campus, Mohali',
    date: 'Feb 2026',
    description: 'Engaged 1,200+ students and parents during annual day fest with interactive book displays and character literature.',
    images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg'],
    image: '/assets/cgc1.jpg',
    attendees: '1200+ Students',
  },
  {
    id: 'e2',
    title: 'CU Student Literature Dialogue Stall',
    location: 'Chandigarh University, Gharuan',
    date: 'Jan 2026',
    description: 'Special youth literature stall focusing on mental clarity, exam stress reduction, and self-reflection books.',
    images: ['/assets/cu1.jpg', '/assets/cgc1.jpg'],
    image: '/assets/cu1.jpg',
    attendees: '2500+ Youth',
  },
  {
    id: 'e3',
    title: 'Sector 17 Plaza Open Literature Bookstall',
    location: 'Sector 17 Plaza, Chandigarh',
    date: 'Jan 2026',
    description: 'Community weekend stall serving Tricity residents with Vedanta & youth development literature.',
    images: ['/assets/cgc2.jpg', '/assets/cu1.jpg'],
    image: '/assets/cgc2.jpg',
    attendees: '800+ Visitors',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'kids' | 'books' | 'events' | 'gallery'
  const [siteVersion, setSiteVersion] = useState('v2'); // 'v2' (Editorial Parchment) | 'v1' (Modern)
  const [theme, setTheme] = useState('dark');

  // App Data state
  const [books, setBooks] = useState(initialBooksSeed);
  const [events, setEvents] = useState(initialEventsSeed);
  const [bookings, setBookings] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [cmsBlocks, setCmsBlocks] = useState(null);

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('Admin');

  useEffect(() => {
    // Secret route check for /admin or /portal in URL
    if (typeof window !== 'undefined' && window.location) {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path === '/admin/' || path === '/portal' || path === '/portal/') {
        setAdminModalOpen(true);
      }
    }

    // Fetch site settings (feature toggles, contact info, home banner, logo)
    fetchSettingsApi().then((data) => {
      if (data) {
        setSiteSettings(data);
        if (data.logoConfig?.faviconUrl) {
          const link = document.querySelector("link[rel*='icon']");
          if (link) link.href = data.logoConfig.faviconUrl;
        }
      }
    });

    // Fetch CMS Content Blocks
    fetchCmsBlocksApi().then((blocks) => {
      if (blocks) setCmsBlocks(blocks);
    });

    // Fetch live data from NestJS Backend API
    fetchBooks().then((res) => {
      if (res && res.length > 0) setBooks(res);
    });
    fetchEvents().then((res) => {
      if (res && res.length > 0) setEvents(res);
    });
    fetchBookings().then((res) => {
      if (res) setBookings(res);
    });
  }, []);

  const isCatalogActive = isAdmin || (siteSettings ? siteSettings.catalogEnabled : false);

  // ═══════════════════════════════════════════════════════════════════
  // FULL-PAGE ADMIN VIEW
  // ═══════════════════════════════════════════════════════════════════
  if (adminModalOpen) {
    return (
      <AdminDashboard
        isOpen={true}
        onClose={() => {
          setAdminModalOpen(false);
          // If on /admin URL, clean up URL history without page reload
          if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/portal')) {
            window.history.pushState({}, '', '/');
          }
        }}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        userRole={userRole}
        setUserRole={setUserRole}
        books={books}
        setBooks={setBooks}
        events={events}
        setEvents={setEvents}
        bookings={bookings}
        setBookings={setBookings}
        siteVersion={siteVersion}
        setSiteVersion={setSiteVersion}
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
        onSettingsUpdated={(newSettings) => {
          setSiteSettings(newSettings);
          if (newSettings?.logoConfig?.faviconUrl) {
            const link = document.querySelector("link[rel*='icon']");
            if (link) link.href = newSettings.logoConfig.faviconUrl;
          }
        }}
      />
    );
  }

  // --- V2 EDITORIAL PARCHMENT THEME ---
  if (siteVersion === 'v2') {
    return (
      <div className="min-h-screen bg-[#F7F4EE] text-[#242220] flex flex-col font-sans selection:bg-[#A36B42] selection:text-white transition-colors duration-300">

        {/* V2 Header Navbar */}
        <NavbarV2
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenHostModal={() => setHostModalOpen(true)}
          onOpenAdminModal={() => setAdminModalOpen(true)}
          isAdmin={isAdmin}
          siteVersion={siteVersion}
          setSiteVersion={setSiteVersion}
          siteSettings={siteSettings}
        />

        {/* V2 Main Sections */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <>
              <HeroV2
                onExploreBooks={() => setActiveTab('books')}
                onHostStall={() => setHostModalOpen(true)}
                onExploreEvents={() => setActiveTab('events')}
                siteSettings={siteSettings}
                cmsBlocks={cmsBlocks}
              />

              <WhatWeDoV2 cmsBlocks={cmsBlocks} />

              <EventsV2
                events={events}
                onExploreEvents={() => setActiveTab('events')}
              />

              <QuoteBannerV2 cmsBlocks={cmsBlocks} siteSettings={siteSettings} />

              <InviteBannerV2
                onHostStall={() => setHostModalOpen(true)}
                cmsBlocks={cmsBlocks}
              />
            </>
          )}

          {activeTab === 'kids' && (
            <div className="py-8 bg-[#F7F4EE]">
              <KidsSection
                books={books}
                onBookSelect={(book) => setSelectedBook(book)}
                siteVersion={siteVersion}
              />
            </div>
          )}

          {activeTab === 'books' && (
            <div className="py-8 bg-[#F7F4EE]">
              <BooksCatalog
                books={books}
                onBookSelect={(book) => setSelectedBook(book)}
                siteVersion={siteVersion}
                catalogEnabled={isCatalogActive}
                onHostStall={() => setHostModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="py-8 bg-[#F7F4EE]">
              <EventsGallery
                events={events}
                onHostStall={() => setHostModalOpen(true)}
                siteVersion={siteVersion}
              />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="py-8 bg-[#F7F4EE]">
              <GallerySection
                onHostStall={() => setHostModalOpen(true)}
                siteVersion={siteVersion}
              />
            </div>
          )}
        </main>

        {/* V2 Footer */}
        <FooterV2
          setActiveTab={setActiveTab}
          onOpenHostModal={() => setHostModalOpen(true)}
          siteSettings={siteSettings}
        />

        {/* Interactive Modals */}
        <HostStallModal
          isOpen={hostModalOpen}
          onClose={() => setHostModalOpen(false)}
          siteVersion={siteVersion}
          onSubmitSuccess={(newBooking) => {
            setBookings([newBooking, ...bookings]);
          }}
        />

        <VolunteerModal
          isOpen={volunteerModalOpen}
          onClose={() => setVolunteerModalOpen(false)}
          siteVersion={siteVersion}
        />

        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          siteVersion={siteVersion}
          onHostStall={() => {
            setSelectedBook(null);
            setHostModalOpen(true);
          }}
        />

      </div>
    );
  }

  // --- V1 MODERN THEME FALLBACK ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">

      {/* Version Banner for V1 (Only shown if showVersionToggle is enabled in Admin Settings) */}
      {siteSettings?.showVersionToggle && (
        <div className="bg-[#242220] text-amber-300 text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center space-x-2">
          <span>Viewing V1 Modern Theme</span>
          <button
            onClick={() => setSiteVersion('v2')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ml-2"
          >
            Switch to V2 Editorial Parchment Design →
          </button>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHostModal={() => setHostModalOpen(true)}
        onOpenVolunteerModal={() => setVolunteerModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        isAdmin={isAdmin}
        theme={theme}
        toggleTheme={toggleTheme}
        siteSettings={siteSettings}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onExploreBooks={() => setActiveTab('books')}
              onHostStall={() => setHostModalOpen(true)}
              siteSettings={siteSettings}
            />

            <KidsSection
              books={books}
              onBookSelect={(book) => setSelectedBook(book)}
              siteVersion={siteVersion}
            />

            <EventsGallery
              events={events}
              onHostStall={() => setHostModalOpen(true)}
              siteVersion={siteVersion}
            />
          </>
        )}

        {activeTab === 'kids' && (
          <div className="py-8">
            <KidsSection
              books={books}
              onBookSelect={(book) => setSelectedBook(book)}
              siteVersion={siteVersion}
            />
          </div>
        )}

        {activeTab === 'books' && (
          <div className="py-8">
            <BooksCatalog
              books={books}
              onBookSelect={(book) => setSelectedBook(book)}
              siteVersion={siteVersion}
              catalogEnabled={isCatalogActive}
              onHostStall={() => setHostModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="py-8">
            <EventsGallery
              events={events}
              onHostStall={() => setHostModalOpen(true)}
              siteVersion={siteVersion}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="py-8">
            <GallerySection
              onHostStall={() => setHostModalOpen(true)}
              siteVersion={siteVersion}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenHostModal={() => setHostModalOpen(true)}
      />

      {/* Interactive Modals */}
      <HostStallModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        siteVersion={siteVersion}
        onSubmitSuccess={(newBooking) => {
          setBookings([newBooking, ...bookings]);
        }}
      />

      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        siteVersion={siteVersion}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        siteVersion={siteVersion}
        onHostStall={() => {
          setSelectedBook(null);
          setHostModalOpen(true);
        }}
      />

    </div>
  );
}
