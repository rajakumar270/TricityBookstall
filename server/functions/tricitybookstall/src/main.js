// Appwrite Function API handler for Tricity Bookstall
export default async ({ req, res, log }) => {
  const path = req.path || '/';

  // Enable CORS headers for React client
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return res.empty(204, headers);
  }

  // GET /api/events or /events
  if (path.includes('events')) {
    return res.json([
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
    ], 200, headers);
  }

  // GET /api/books or /books
  if (path.includes('books')) {
    return res.json([
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
      }
    ], 200, headers);
  }

  // Default API response
  return res.json({
    status: 'ok',
    message: 'Tricity Bookstall API running on Appwrite Cloud',
    endpoints: ['/events', '/books', '/bookings', '/auth/login']
  }, 200, headers);
};
