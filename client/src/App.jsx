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
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Bestseller for Kids',
    readingAge: 'Ages 8 - 14',
    pages: 96,
    availableStock: 60,
  },
  {
    id: 'b3',
    title: 'The Science of Mind Control & Focus',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Mind & Character',
    isKidsSection: false,
    isFeatured: true,
    language: 'English',
    description: 'A practical guide for students and youth to master thoughts, overcome distraction, reduce exam stress, and achieve purposeful living.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    badge: 'Must Read for Students',
    pages: 180,
    availableStock: 120,
  },
  {
    id: 'b4',
    title: 'Bhagavad-gita As It Is (Student Edition)',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Vedanta & Classics',
    isKidsSection: false,
    isFeatured: true,
    language: 'Bilingual',
    description: 'The definitive philosophical text explaining karma, consciousness, self-realization, and ethical duty in modern life with clear commentary.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    badge: 'Timeless Masterpiece',
    pages: 850,
    availableStock: 200,
  },
  {
    id: 'b5',
    title: 'The Journey Within: Unlocking Inner Potential',
    author: 'Radhanath Swami',
    category: 'Self Discovery',
    isKidsSection: false,
    isFeatured: true,
    language: 'English',
    description: 'An intimate, uplifting guide exploring spiritual resilience, finding peace amidst academic/career pressure, and living with compassion.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular in Colleges',
    pages: 310,
    availableStock: 80,
  },
  {
    id: 'b6',
    title: 'Bal Ramayana & Timeless Heroes',
    author: 'Prabodhanam Junior Press',
    category: 'Kids Wisdom',
    isKidsSection: true,
    isFeatured: false,
    language: 'Hindi',
    description: 'Beautifully narrative stories of duty, courage, friendship, and truthfulness for young readers.',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    badge: 'New Release',
    readingAge: 'Ages 5 - 11',
    pages: 110,
    availableStock: 50,
  },
  {
    id: 'b7',
    title: 'Perfection of Yoga & Meditation',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Self Discovery',
    isKidsSection: false,
    isFeatured: false,
    language: 'English',
    description: 'Unveiling real yoga beyond physical exercise—connecting the mind to higher consciousness and lasting inner calmness.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    badge: 'Youth Choice',
    pages: 140,
    availableStock: 95,
  },
  {
    id: 'b8',
    title: 'Sri Isopanisad: Discovering Universal Harmony',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Vedanta & Classics',
    isKidsSection: false,
    isFeatured: false,
    language: 'English',
    description: '18 essential mantras providing philosophical answers to life’s deepest questions regarding nature, humanity, and supreme truth.',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    pages: 160,
    availableStock: 75,
  }
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

  // Modals state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHostModal={() => setHostModalOpen(true)}
        onOpenVolunteerModal={() => setVolunteerModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              setActiveTab={setActiveTab}
              onOpenHostModal={() => setHostModalOpen(true)}
            />

            {/* Kids Corner Preview Banner */}
            <div className="bg-gradient-to-r from-pink-900/30 via-purple-900/20 to-slate-950 border-y border-pink-500/20 py-10 my-8">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Special Feature</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Bal Prabodhanam • Kids Wisdom Corner 🎈</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">Illustrated moral stories, Bal Gita, and character tales for school children.</p>
                </div>
                <button
                  onClick={() => setActiveTab('kids')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform"
                >
                  Explore Kids Collection
                </button>
              </div>
            </div>

            <BooksCatalog
              books={books}
              onBookSelect={(b) => setSelectedBook(b)}
            />

            <EventsGallery events={events} />
          </>
        )}

        {activeTab === 'kids' && (
          <KidsSection
            books={books}
            onBookSelect={(b) => setSelectedBook(b)}
          />
        )}

        {activeTab === 'books' && (
          <BooksCatalog
            books={books}
            onBookSelect={(b) => setSelectedBook(b)}
          />
        )}

        {activeTab === 'events' && (
          <EventsGallery events={events} />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenHostModal={() => setHostModalOpen(true)}
        onOpenVolunteerModal={() => setVolunteerModalOpen(true)}
      />

      {/* Interactive Modals */}
      <HostStallModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />

      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onRequestCopy={(b) => {
          setSelectedBook(null);
          setHostModalOpen(true);
        }}
      />

      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        books={books}
        setBooks={setBooks}
        bookings={bookings}
        setBookings={setBookings}
      />

    </div>
  );
}
