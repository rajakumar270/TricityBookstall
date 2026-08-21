import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { seedBooksFromCSV } from './books.seed';

export interface Book {
  id: string;
  title: string;
  hinglishTitle?: string;
  author: string;
  mainCategory: 'Acharya Prashant Foundation' | 'Other Author';
  category: 'Kids Wisdom' | 'Mind & Character' | 'Self Discovery' | 'Vedanta & Classics';
  isKidsSection: boolean;
  isFeatured: boolean;
  language: 'English' | 'Hindi' | 'Bilingual';
  description?: string;
  coverImage: string;
  badge?: string;
  readingAge?: string;
  pages?: number;
  mrp: number;
  buyingCost: number;
  sellingPrice: number;
  availableStock: number;
  externalLink?: string;
  problemAddressedTag?: string; // Problem / Theme addressed tag
}

export interface SalesLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  bookId: string;
  bookTitle: string;
  mainCategory: string;
  quantitySold: number;
  sellingPriceOnDate: number;
  totalAmount: number;
  recordedBy: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

@Injectable()
export class BooksService {
  private booksFile = path.resolve(__dirname, '../../data/books.json');
  private salesLogsFile = path.resolve(__dirname, '../../data/sales_logs.json');
  private books: Book[] = [];
  private salesLogs: SalesLogEntry[] = [];

  constructor() {
    this.ensureDataDirectory();
    this.loadBooks();
    this.loadSalesLogs();
  }

  private ensureDataDirectory() {
    const dataDir = path.dirname(this.booksFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadBooks() {
    if (fs.existsSync(this.booksFile)) {
      try {
        const fileData = fs.readFileSync(this.booksFile, 'utf-8');
        this.books = JSON.parse(fileData);
        if (Array.isArray(this.books) && this.books.length > 0) {
          return;
        }
      } catch (e) {
        console.error('Error reading books.json, re-seeding...', e);
      }
    }
    // Seed books from CSV / XLSX files
    this.books = seedBooksFromCSV();
    this.saveBooksToDisk();
  }

  private saveBooksToDisk() {
    try {
      fs.writeFileSync(this.booksFile, JSON.stringify(this.books, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing books.json:', e);
    }
  }

  private loadSalesLogs() {
    if (fs.existsSync(this.salesLogsFile)) {
      try {
        const fileData = fs.readFileSync(this.salesLogsFile, 'utf-8');
        this.salesLogs = JSON.parse(fileData);
      } catch (e) {
        console.error('Error reading sales_logs.json:', e);
        this.salesLogs = [];
      }
    }
  }

  private saveSalesLogsToDisk() {
    try {
      fs.writeFileSync(this.salesLogsFile, JSON.stringify(this.salesLogs, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing sales_logs.json:', e);
    }
  }

  findAll(mainCategory?: string, category?: string, search?: string, kidsOnly?: boolean): Book[] {
    let result = this.books;

    if (mainCategory && mainCategory !== 'All') {
      result = result.filter(b => b.mainCategory === mainCategory);
    }

    if (category && category !== 'All') {
      result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }

    if (kidsOnly) {
      result = result.filter(b => b.isKidsSection);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          (b.hinglishTitle && b.hinglishTitle.toLowerCase().includes(q)) ||
          b.author.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q)) ||
          (b.problemAddressedTag && b.problemAddressedTag.toLowerCase().includes(q)),
      );
    }

    return result;
  }

  findOne(id: string): Book {
    const book = this.books.find(b => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  create(bookData: Partial<Book>): Book {
    const newBook: Book = {
      id: `b_${Date.now()}`,
      title: bookData.title || 'Untitled Book',
      hinglishTitle: bookData.hinglishTitle || '',
      author: bookData.author || 'Unknown Author',
      mainCategory: bookData.mainCategory || 'Acharya Prashant Foundation',
      category: bookData.category || 'Mind & Character',
      isKidsSection: !!bookData.isKidsSection,
      isFeatured: !!bookData.isFeatured,
      language: bookData.language || 'English',
      description: bookData.description || '',
      coverImage: bookData.coverImage || '',
      badge: bookData.badge || '',
      readingAge: bookData.readingAge || '',
      pages: bookData.pages || 150,
      mrp: Number(bookData.mrp) || 0,
      buyingCost: Number(bookData.buyingCost) || 0,
      sellingPrice: Number(bookData.sellingPrice) || Number(bookData.mrp) || 0,
      availableStock: Number(bookData.availableStock) || 0,
      externalLink: bookData.externalLink || '',
      problemAddressedTag: bookData.problemAddressedTag || 'Personal Growth & Freedom',
    };

    this.books.unshift(newBook);
    this.saveBooksToDisk();
    return newBook;
  }

  update(id: string, updateData: Partial<Book>): Book {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    const updatedBook = {
      ...this.books[index],
      ...updateData,
      mrp: updateData.mrp !== undefined ? Number(updateData.mrp) : this.books[index].mrp,
      buyingCost: updateData.buyingCost !== undefined ? Number(updateData.buyingCost) : this.books[index].buyingCost,
      sellingPrice: updateData.sellingPrice !== undefined ? Number(updateData.sellingPrice) : this.books[index].sellingPrice,
      availableStock: updateData.availableStock !== undefined ? Number(updateData.availableStock) : this.books[index].availableStock,
    };

    this.books[index] = updatedBook;
    this.saveBooksToDisk();
    return updatedBook;
  }

  remove(id: string): { success: boolean } {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    this.books.splice(index, 1);
    this.saveBooksToDisk();
    return { success: true };
  }

  // --- Sales Logging Methods ---

  recordSalesEntry(entryData: Partial<SalesLogEntry>): SalesLogEntry {
    const book = this.findOne(entryData.bookId);
    const qty = Math.max(1, Number(entryData.quantitySold) || 1);
    const priceOnDate = Number(entryData.sellingPriceOnDate) || book.sellingPrice || book.mrp || 0;
    const total = qty * priceOnDate;

    const salesEntry: SalesLogEntry = {
      id: `sale_${Date.now()}`,
      date: entryData.date || new Date().toISOString().split('T')[0],
      bookId: book.id,
      bookTitle: book.title,
      mainCategory: book.mainCategory,
      quantitySold: qty,
      sellingPriceOnDate: priceOnDate,
      totalAmount: total,
      recordedBy: entryData.recordedBy || 'Stall Volunteer',
      location: entryData.location || 'Stall Location',
      notes: entryData.notes || '',
      createdAt: new Date().toISOString(),
    };

    // Update book stock & current selling price
    book.availableStock = Math.max(0, book.availableStock - qty);
    book.sellingPrice = priceOnDate;
    this.saveBooksToDisk();

    this.salesLogs.unshift(salesEntry);
    this.saveSalesLogsToDisk();

    return salesEntry;
  }

  getSalesLogs(): SalesLogEntry[] {
    return this.salesLogs;
  }

  getMainCategories(): string[] {
    return ['Acharya Prashant Foundation', 'Other Author'];
  }

  getCategories(): string[] {
    return ['Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics'];
  }
}
