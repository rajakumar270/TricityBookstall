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

import { fetchBooks, fetchEvents, fetchBookings } from './services/api';

// Initial Fallback Seed Data
const initialBooksSeed = [
  {
    id: 'b1',
    title: 'Illustrated Bal Gita & Moral Tales',
    author: 'Prabodhanam Wisdom Series',
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
    author: 'Prabodhanam Youth Edition',
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
    date: '03-04 February 2026',
    description: 'Engaged thousands of college students with interactive book discussions on stress management, focus, and practical wisdom during the annual literary fest.',
    images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg', '/assets/cgc3.jpg', '/assets/cgc4.jpg'],
    category: 'University Fest',
  },
  {
    id: 'ev-2',
    title: 'Cyanide 2025 - Panjab University',
    location: 'Panjab University, Sector 14, Chandigarh',
    city: 'Chandigarh',
    date: '21-23 February 2025',
    description: 'Over 3 enriching days at Panjab University, students from Philosophy, Science, and Humanities joined reflective dialogues around Vedanta and mindfulness.',
    images: ['/assets/pu1.jpg', '/assets/pu2.jpg', '/assets/pu3.jpg', '/assets/pu4.jpg'],
    category: 'University Fest',
  },
  {
    id: 'ev-3',
    title: 'PTM Bookstall - Doon Public School',
    location: 'Sector 21, Panchkula',
    city: 'Panchkula',
    date: '06 September 2025',
    description: 'Hosted a specialized Kids & Parent Wisdom bookstall providing moral storybooks, Bal Gita, and value education guides during the Parent Teacher Meeting.',
    images: ['/assets/d2.jpg', '/assets/d3.jpg', '/assets/d4.jpg', '/assets/d5.jpg'],
    category: 'School PTM',
  },
  {
    id: 'ev-4',
    title: 'Tricity Pustak Mela - Indradhanush Auditorium',
    location: 'Indradhanush Auditorium, Sector 5, Panchkula',
    city: 'Panchkula',
    date: '07-13 November 2025',
    description: 'A 7-day public book exhibition bringing classical Indian philosophy, character building literature, and youth guidance to the Tricity community.',
    images: ['/assets/event1.jpg', '/assets/event2.jpg', '/assets/event3.jpg', '/assets/event4.jpg'],
    category: 'Book Fair',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'kids' | 'books' | 'events'
  const [books, setBooks] = useState(initialBooksSeed);
  const [events, setEvents] = useState(initialEventsSeed);
  const [bookings, setBookings] = useState([]);

  // Theme Management (Light / Dark switchable)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
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
            />

            <EventsGallery
              events={events}
              onHostStall={() => setHostModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'kids' && (
          <div className="py-8">
            <KidsSection
              books={books}
              onBookSelect={(book) => setSelectedBook(book)}
            />
          </div>
        )}

        {activeTab === 'books' && (
          <div className="py-8">
            <BooksCatalog
              books={books}
              onBookSelect={(book) => setSelectedBook(book)}
            />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="py-8">
            <EventsGallery
              events={events}
              onHostStall={() => setHostModalOpen(true)}
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
        onSubmitSuccess={(newBooking) => {
          setBookings([newBooking, ...bookings]);
        }}
      />

      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
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
      />

    </div>
  );
}
