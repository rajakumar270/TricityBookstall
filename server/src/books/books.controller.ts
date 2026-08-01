import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BooksService, Book } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('kidsOnly') kidsOnly?: string
  ): Book[] {
    const isKids = kidsOnly === 'true';
    return this.booksService.findAll(category, search, isKids);
  }

  @Get('categories')
  getCategories(): string[] {
    return this.booksService.getCategories();
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
