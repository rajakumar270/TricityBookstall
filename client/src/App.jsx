import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KidsSection from './components/KidsSection';
import BooksCatalog from './components/BooksCatalog';
import EventsGallery from './components/EventsGallery';
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

import { fetchBooks, fetchEvents, fetchBookings } from './services/api';

// Initial Fallback Seed Data
const initialBooksSeed = [
  {
    id: 'b1',
    title: 'Illustrated Bal Gita & Moral Tales',
    author: 'Ekatva Foundation Series',
    category: 'Kids Wisdom',
    isKidsSection: true,
    isFeatured: true,
    language: 'Bilingual',
    description: 'Charming illustrated stories bringing timeless ethical principles, bravery, and character-building values to young children.',
    coverImage: '/assets/books/book_images/book_image_1.jpg',
    badge: 'Kids Favorite',
    readingAge: 'Ages 6 - 12',
    pages: 120,
    availableStock: 45,
  },
  {
    id: 'b2',
    title: 'Stories of Clarity & Character',
    author: 'Ekatva Foundation Youth Edition',
    category: 'Kids Wisdom',
    isKidsSection: true,
    isFeatured: true,
    language: 'English',
    description: 'Interactive short stories designed to instill concentration, kindness, respect for elders, and mental clarity in young minds.',
    coverImage: '/assets/books/book_images/book_image_2.jpg',
    badge: 'Bestseller for Kids',
    readingAge: 'Ages 8 - 14',
    pages: 96,
    availableStock: 60,
  },
  {
    id: 'b3',
    title: 'The Science of Mind Control & Focus',
    author: 'Acharya Prashant',
    category: 'Mind & Character',
    isKidsSection: false,
    isFeatured: true,
    language: 'English',
    description: 'A practical guide for students and youth to master thoughts, overcome distraction, reduce exam stress, and achieve purposeful living.',
    coverImage: '/assets/books/book_images/book_image_3.jpg',
    badge: 'Must Read for Students',
    pages: 180,
    availableStock: 120,
  },
];

const initialEventsSeed = [
  {
    id: 'ev-1',
    title: 'साहिtyam 2026 - CGC University',
    location: 'CGC University, Landran, Mohali',
    city: 'Mohali',
    date: '03 - 04 FEB, 2026',
    description: 'Engaged thousands of college students with interactive book discussions on stress management, focus, and practical wisdom during the annual literary fest.',
    images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg', '/assets/cgc3.jpg', '/assets/cgc4.jpg'],
    category: 'University Fest',
  },
  {
    id: 'ev-3',
    title: 'PTM - Doon Public School',
    location: 'Sec 21, Panchkula, HR',
    city: 'Panchkula',
    date: '06 SEP, 2025',
    description: 'Hosted a specialized Kids & Parent Wisdom bookstall providing moral storybooks, Bal Gita, and value education guides during the Parent Teacher Meeting.',
    images: ['/assets/d2.jpg', '/assets/d3.jpg', '/assets/d4.jpg', '/assets/d5.jpg'],
    category: 'School PTM',
  },
  {
    id: 'ev-4',
    title: 'Pustak Mela - Indradhanush Auditorium',
    location: 'Sec 5, Panchkula, HR',
    city: 'Panchkula',
    date: '07 - 13 NOV, 2025',
    description: 'A 7-day public book exhibition bringing classical Indian philosophy, character building literature, and youth guidance to the Tricity community.',
    images: ['/assets/event1.jpg', '/assets/event2.jpg', '/assets/event3.jpg', '/assets/event4.jpg'],
    category: 'Book Fair',
  },
  {
    id: 'ev-2',
    title: 'Cyanide 2025 - Panjab University',
    location: 'Sec 14, Chandigarh',
    city: 'Chandigarh',
    date: '21 - 23 FEB, 2025',
    description: 'Over 3 enriching days at Panjab University, students from Philosophy, Science, and Humanities joined reflective dialogues around Vedanta and mindfulness.',
    images: ['/assets/pu1.jpg', '/assets/pu2.jpg', '/assets/pu3.jpg', '/assets/pu4.jpg'],
    category: 'University Fest',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'kids' | 'books' | 'events'
  const [books, setBooks] = useState(initialBooksSeed);
  const [events, setEvents] = useState(initialEventsSeed);
  const [bookings, setBookings] = useState([]);

  // Site Version State ('v2' Parchment Editorial OR 'v1' Modern Glass)
  const [siteVersion, setSiteVersion] = useState(() => {
    return localStorage.getItem('siteVersion') || 'v2';
  });

  useEffect(() => {
    localStorage.setItem('siteVersion', siteVersion);
  }, [siteVersion]);

  // Theme Management (Light / Dark switchable for V1)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (siteVersion === 'v1') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, siteVersion]);

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
    // Attempt fetching live data from NestJS Backend API
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
        />

        {/* V2 Main Sections */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <>
              <HeroV2
                onExploreBooks={() => setActiveTab('books')}
                onHostStall={() => setHostModalOpen(true)}
                onExploreEvents={() => setActiveTab('events')}
              />

              <WhatWeDoV2 />

              <EventsV2
                events={events}
                onExploreEvents={() => setActiveTab('events')}
              />

              <QuoteBannerV2 />

              <InviteBannerV2
                onHostStall={() => setHostModalOpen(true)}
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
        </main>

        {/* V2 Footer */}
        <FooterV2
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

        <AdminDashboard
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          userRole={userRole}
          setUserRole={setUserRole}
          books={books}
          setBooks={setBooks}
          bookings={bookings}
          setBookings={setBookings}
          siteVersion={siteVersion}
        />

      </div>
    );
  }

  // --- V1 MODERN THEME FALLBACK ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">

      {/* Version Banner for V1 */}
      <div className="bg-[#242220] text-amber-300 text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center space-x-2">
        <span>Viewing V1 Modern Theme</span>
        <button
          onClick={() => setSiteVersion('v2')}
          className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ml-2"
        >
          Switch to V2 Editorial Parchment Design →
        </button>
      </div>

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
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onExploreBooks={() => setActiveTab('books')}
              onHostStall={() => setHostModalOpen(true)}
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

      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        userRole={userRole}
        setUserRole={setUserRole}
        books={books}
        setBooks={setBooks}
        bookings={bookings}
        setBookings={setBookings}
        siteVersion={siteVersion}
      />

    </div>
  );
}
