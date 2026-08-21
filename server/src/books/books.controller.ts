import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BooksService, Book, SalesLogEntry } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(
    @Query('mainCategory') mainCategory?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('kidsOnly') kidsOnly?: string
  ): Book[] {
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
  getSalesLogs(): SalesLogEntry[] {
    return this.booksService.getSalesLogs();
  }

  @Post('sales-entry')
  recordSalesEntry(
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
  ): SalesLogEntry {
    return this.booksService.recordSalesEntry(body);
  }

  @Get(':id')
  getBookById(@Param('id') id: string): Book {
    return this.booksService.findOne(id);
  }

  @Post()
  createBook(@Body() bookData: Omit<Book, 'id'>): Book {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  updateBook(@Param('id') id: string, @Body() bookData: Partial<Book>): Book {
    return this.booksService.update(id, bookData);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
