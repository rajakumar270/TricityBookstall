import { Injectable, NotFoundException } from '@nestjs/common';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Kids Wisdom' | 'Mind & Character' | 'Self Discovery' | 'Vedanta & Classics';
  isKidsSection: boolean;
  isFeatured: boolean;
  language: 'English' | 'Hindi' | 'Bilingual';
  description: string;
  coverImage: string;
  badge?: string;
  readingAge?: string;
  pages?: number;
  availableStock: number;
}

@Injectable()
export class BooksService {
  private books: Book[] = [
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
      badge: "Kids Favorite",
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

  findAll(category?: string, search?: string, kidsOnly?: boolean): Book[] {
    let result = [...this.books];
    if (kidsOnly) {
      result = result.filter(b => b.isKidsSection);
    }
    if (category && category !== 'All') {
      result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  findOne(id: string): Book {
    const book = this.books.find(b => b.id === id);
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  create(bookData: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      id: 'b' + (Date.now()),
      ...bookData,
    };
    this.books.unshift(newBook);
    return newBook;
  }

  update(id: string, bookData: Partial<Book>): Book {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) throw new NotFoundException(`Book with ID ${id} not found`);
    this.books[index] = { ...this.books[index], ...bookData };
    return this.books[index];
  }

  remove(id: string): { success: boolean } {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) throw new NotFoundException(`Book with ID ${id} not found`);
    this.books.splice(index, 1);
    return { success: true };
  }

  getCategories(): string[] {
    return ['All', 'Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics'];
  }
}
