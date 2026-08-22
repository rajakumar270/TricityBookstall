import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BooksService, Book, SalesLogEntry } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(
    @Query('mainCategory') mainCategory?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('kidsOnly') kidsOnly?: string
  ): Promise<Book[]> {
    const isKids = kidsOnly === 'true';
    return this.booksService.findAll(mainCategory, category, search, isKids);
  }

  @Get('main-categories')
  getMainCategories(): string[] {
    return this.booksService.getMainCategories();
  }

  @Get('categories')
  getCategories(): string[] {
    return this.booksService.getCategories();
  }

  @Get('sales-logs')
  async getSalesLogs(): Promise<SalesLogEntry[]> {
    return this.booksService.getSalesLogs();
  }

  @Post('sales-entry')
  async recordSalesEntry(
    @Body()
    body: {
      date: string;
      bookId: string;
      quantitySold: number;
      sellingPriceOnDate: number;
      recordedBy?: string;
      location?: string;
      notes?: string;
    }
  ): Promise<SalesLogEntry> {
    return this.booksService.recordSalesEntry(body);
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Post()
  async createBook(@Body() bookData: Omit<Book, 'id'>): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.update(id, bookData);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
