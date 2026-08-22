import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import { seedBooksFromCSV } from '../src/books/books.seed';

async function migrate() {
  console.log('🚀 Starting Ekatva Foundation MySQL Data Migration...');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ekatva_bookstall_db',
    multipleStatements: true,
  };

  let connection: mysql.Connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(`✅ Connected to MySQL Server at ${dbConfig.host}:${dbConfig.port}`);
  } catch (err: any) {
    console.error(`❌ Failed to connect to MySQL database "${dbConfig.database}":`, err.message);
    console.log(`💡 Please make sure MySQL is running and database "${dbConfig.database}" is created.`);
    process.exit(1);
  }

  try {
    // 1. Run DDL Schema File
    const schemaPath = path.resolve(__dirname, '../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlSchema = fs.readFileSync(schemaPath, 'utf-8');
      await connection.query(sqlSchema);
      console.log('✅ MySQL Database Schema & Tables initialized!');
    }

    // 2. Load Books Data (from JSON or CSV)
    let books: any[] = [];
    const booksJsonPath = path.resolve(__dirname, '../data/books.json');
    if (fs.existsSync(booksJsonPath)) {
      books = JSON.parse(fs.readFileSync(booksJsonPath, 'utf-8'));
    } else {
      books = seedBooksFromCSV();
    }

    console.log(`📚 Migrating ${books.length} Books to MySQL 'books' table...`);
    for (const b of books) {
      await connection.execute(
        `INSERT INTO books 
          (id, title, hinglish_title, author, main_category, category, is_kids_section, is_featured, language, description, cover_image, badge, reading_age, pages, mrp, buying_cost, selling_price, available_stock, external_link, problem_addressed_tag)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          title=VALUES(title),
          mrp=VALUES(mrp),
          buying_cost=VALUES(buying_cost),
          selling_price=VALUES(selling_price),
          available_stock=VALUES(available_stock),
          cover_image=VALUES(cover_image),
          problem_addressed_tag=VALUES(problem_addressed_tag)`,
        [
          b.id,
          b.title,
          b.hinglishTitle || '',
          b.author,
          b.mainCategory || 'Acharya Prashant Foundation',
          b.category || 'Mind & Character',
          b.isKidsSection ? 1 : 0,
          b.isFeatured ? 1 : 0,
          b.language || 'Hindi',
          b.description || '',
          b.coverImage || '',
          b.badge || '',
          b.readingAge || '',
          b.pages || 150,
          b.mrp || 0,
          b.buyingCost || 0,
          b.sellingPrice || b.mrp || 0,
          b.availableStock || 0,
          b.externalLink || '',
          b.problemAddressedTag || 'Personal Growth & Freedom',
        ]
      );
    }
    console.log(`✅ ${books.length} Books migrated successfully to MySQL!`);

    // 3. Load Sales Logs
    const salesJsonPath = path.resolve(__dirname, '../data/sales_logs.json');
    if (fs.existsSync(salesJsonPath)) {
      const salesLogs = JSON.parse(fs.readFileSync(salesJsonPath, 'utf-8'));
      console.log(`📊 Migrating ${salesLogs.length} Sales Logs to MySQL...`);
      for (const s of salesLogs) {
        await connection.execute(
          `INSERT INTO sales_logs
            (id, sale_date, book_id, book_title, main_category, quantity_sold, selling_price_on_date, total_amount, recorded_by, location, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity_sold=VALUES(quantity_sold)`,
          [
            s.id,
            s.date || new Date().toISOString().split('T')[0],
            s.bookId,
            s.bookTitle || 'Book',
            s.mainCategory || 'Acharya Prashant Foundation',
            s.quantitySold || 1,
            s.sellingPriceOnDate || 0,
            s.totalAmount || 0,
            s.recordedBy || 'Stall Volunteer',
            s.location || 'Tricity Stall',
            s.notes || '',
          ]
        );
      }
      console.log(`✅ ${salesLogs.length} Sales Logs migrated successfully!`);
    }

    // 4. Seed Default Admin & Volunteer Users
    console.log('👤 Seeding Default Users (Admin & Volunteer)...');
    await connection.execute(
      `INSERT INTO users (username, password_hash, full_name, role)
       VALUES ('admin', 'admin123', 'Ekatva Foundation Admin', 'Admin')
       ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)`
    );
    await connection.execute(
      `INSERT INTO users (username, password_hash, full_name, role)
       VALUES ('volunteer', 'volunteer123', 'Tricity Youth Volunteer', 'Volunteer')
       ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)`
    );
    console.log('✅ Default users seeded!');

    console.log('🎉 Migration Completed Cleanly!');
    await connection.end();
  } catch (err: any) {
    console.error('❌ Migration Error:', err);
    if (connection) await connection.end();
  }
}

migrate();
