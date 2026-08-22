import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

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
  problemAddressedTag?: string;
}

export interface SalesLogEntry {
  id: string;
  date: string;
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
  constructor(private readonly db: DatabaseService) {}

  private mapRowToBook(row: any): Book {
    return {
      id: row.id,
      title: row.title,
      hinglishTitle: row.hinglish_title || '',
      author: row.author,
      mainCategory: row.main_category,
      category: row.category,
      isKidsSection: Boolean(row.is_kids_section),
      isFeatured: Boolean(row.is_featured),
      language: row.language,
      description: row.description || '',
      coverImage: row.cover_image || '',
      badge: row.badge || '',
      readingAge: row.reading_age || '',
      pages: Number(row.pages) || 0,
      mrp: Number(row.mrp) || 0,
      buyingCost: Number(row.buying_cost) || 0,
      sellingPrice: Number(row.selling_price) || 0,
      availableStock: Number(row.available_stock) || 0,
      externalLink: row.external_link || '',
      problemAddressedTag: row.problem_addressed_tag || '',
    };
  }

  private mapRowToSalesLog(row: any): SalesLogEntry {
    return {
      id: row.id,
      date: row.sale_date ? (row.sale_date instanceof Date ? row.sale_date.toISOString().split('T')[0] : String(row.sale_date)) : '',
      bookId: row.book_id,
      bookTitle: row.book_title,
      mainCategory: row.main_category,
      quantitySold: Number(row.quantity_sold) || 1,
      sellingPriceOnDate: Number(row.selling_price_on_date) || 0,
      totalAmount: Number(row.total_amount) || 0,
      recordedBy: row.recorded_by || 'Stall Volunteer',
      location: row.location || 'Tricity Stall',
      notes: row.notes || '',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    };
  }

  async findAll(mainCategory?: string, category?: string, search?: string, kidsOnly?: boolean): Promise<Book[]> {
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params: any[] = [];

    if (mainCategory && mainCategory !== 'All') {
      sql += ' AND main_category = ?';
      params.push(mainCategory);
    }

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (kidsOnly) {
      sql += ' AND is_kids_section = 1';
    }

    if (search && search.trim() !== '') {
      const q = `%${search.toLowerCase().trim()}%`;
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(hinglish_title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(description) LIKE ? OR LOWER(problem_addressed_tag) LIKE ?)';
      params.push(q, q, q, q, q);
    }

    sql += ' ORDER BY created_at DESC';
    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(r => this.mapRowToBook(r));
  }

  async findOne(id: string): Promise<Book> {
    const rows = await this.db.query<any[]>('SELECT * FROM books WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return this.mapRowToBook(rows[0]);
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    const id = `b_${Date.now()}`;
    const newBook: Book = {
      id,
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
      pages: Number(bookData.pages) || 150,
      mrp: Number(bookData.mrp) || 0,
      buyingCost: Number(bookData.buyingCost) || 0,
      sellingPrice: Number(bookData.sellingPrice) || Number(bookData.mrp) || 0,
      availableStock: Number(bookData.availableStock) || 0,
      externalLink: bookData.externalLink || '',
      problemAddressedTag: bookData.problemAddressedTag || 'Personal Growth & Freedom',
    };

    await this.db.query(
      `INSERT INTO books (id, title, hinglish_title, author, main_category, category, is_kids_section, is_featured, language, description, cover_image, badge, reading_age, pages, mrp, buying_cost, selling_price, available_stock, external_link, problem_addressed_tag)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newBook.id,
        newBook.title,
        newBook.hinglishTitle,
        newBook.author,
        newBook.mainCategory,
        newBook.category,
        newBook.isKidsSection ? 1 : 0,
        newBook.isFeatured ? 1 : 0,
        newBook.language,
        newBook.description,
        newBook.coverImage,
        newBook.badge,
        newBook.readingAge,
        newBook.pages,
        newBook.mrp,
        newBook.buyingCost,
        newBook.sellingPrice,
        newBook.availableStock,
        newBook.externalLink,
        newBook.problemAddressedTag,
      ],
    );

    return newBook;
  }

  async update(id: string, updateData: Partial<Book>): Promise<Book> {
    const existing = await this.findOne(id);
    const updatedBook: Book = {
      ...existing,
      ...updateData,
      mrp: updateData.mrp !== undefined ? Number(updateData.mrp) : existing.mrp,
      buyingCost: updateData.buyingCost !== undefined ? Number(updateData.buyingCost) : existing.buyingCost,
      sellingPrice: updateData.sellingPrice !== undefined ? Number(updateData.sellingPrice) : existing.sellingPrice,
      availableStock: updateData.availableStock !== undefined ? Number(updateData.availableStock) : existing.availableStock,
    };

    await this.db.query(
      `UPDATE books SET 
        title = ?, hinglish_title = ?, author = ?, main_category = ?, category = ?, 
        is_kids_section = ?, is_featured = ?, language = ?, description = ?, cover_image = ?, 
        badge = ?, reading_age = ?, pages = ?, mrp = ?, buying_cost = ?, selling_price = ?, 
        available_stock = ?, external_link = ?, problem_addressed_tag = ?
       WHERE id = ?`,
      [
        updatedBook.title,
        updatedBook.hinglishTitle,
        updatedBook.author,
        updatedBook.mainCategory,
        updatedBook.category,
        updatedBook.isKidsSection ? 1 : 0,
        updatedBook.isFeatured ? 1 : 0,
        updatedBook.language,
        updatedBook.description,
        updatedBook.coverImage,
        updatedBook.badge,
        updatedBook.readingAge,
        updatedBook.pages,
        updatedBook.mrp,
        updatedBook.buyingCost,
        updatedBook.sellingPrice,
        updatedBook.availableStock,
        updatedBook.externalLink,
        updatedBook.problemAddressedTag,
        id,
      ],
    );

    return updatedBook;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.findOne(id);
    await this.db.query('DELETE FROM books WHERE id = ?', [id]);
    return { success: true };
  }

  async recordSalesEntry(entryData: Partial<SalesLogEntry>): Promise<SalesLogEntry> {
    const book = await this.findOne(entryData.bookId!);
    const qty = Math.max(1, Number(entryData.quantitySold) || 1);
    const priceOnDate = Number(entryData.sellingPriceOnDate) || book.sellingPrice || book.mrp || 0;
    const total = qty * priceOnDate;
    const saleId = `sale_${Date.now()}`;
    const saleDate = entryData.date || new Date().toISOString().split('T')[0];

    const salesEntry: SalesLogEntry = {
      id: saleId,
      date: saleDate,
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

    await this.db.query(
      `INSERT INTO sales_logs (id, sale_date, book_id, book_title, main_category, quantity_sold, selling_price_on_date, total_amount, recorded_by, location, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        salesEntry.id,
        salesEntry.date,
        salesEntry.bookId,
        salesEntry.bookTitle,
        salesEntry.mainCategory,
        salesEntry.quantitySold,
        salesEntry.sellingPriceOnDate,
        salesEntry.totalAmount,
        salesEntry.recordedBy,
        salesEntry.location,
        salesEntry.notes,
      ],
    );

    const newStock = Math.max(0, book.availableStock - qty);
    await this.db.query(
      'UPDATE books SET available_stock = ?, selling_price = ? WHERE id = ?',
      [newStock, priceOnDate, book.id],
    );

    return salesEntry;
  }

  async getSalesLogs(): Promise<SalesLogEntry[]> {
    const rows = await this.db.query<any[]>('SELECT * FROM sales_logs ORDER BY created_at DESC');
    return rows.map(r => this.mapRowToSalesLog(r));
  }

  getMainCategories(): string[] {
    return ['Acharya Prashant Foundation', 'Other Author'];
  }

  getCategories(): string[] {
    return ['Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics'];
  }
}
