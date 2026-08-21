import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { Book } from './books.service';

function cleanString(val: any): string {
  if (!val) return '';
  const str = val.toString().trim();
  if (str.includes('à') || str.includes('¤') || str.includes('¥')) {
    try {
      return Buffer.from(str, 'latin1').toString('utf8').trim();
    } catch (e) {
      return str;
    }
  }
  return str;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function getProblemAddressedTag(title: string, hinglishTitle: string, category: string): string {
  const t = (title + ' ' + hinglishTitle + ' ' + category).toLowerCase();
  if (t.includes('डर') || t.includes('fear') || t.includes('anxiety') || t.includes('stress')) {
    return 'Overcoming Fear & Stress';
  }
  if (t.includes('मन') || t.includes('mind') || t.includes('focus') || t.includes('विद्यार्थी') || t.includes('student')) {
    return 'Student Focus & Discipline';
  }
  if (t.includes('स्त्री') || t.includes('women') || t.includes('सम्बन्ध') || t.includes('relation') || t.includes('love')) {
    return 'Relationships & Self-Respect';
  }
  if (t.includes('बच्चो') || t.includes('parenting') || t.includes('bal ') || t.includes('kids') || t.includes('child')) {
    return 'Parenting & Character Building';
  }
  if (t.includes('कर्म') || t.includes('karma') || t.includes('action') || t.includes('duty')) {
    return 'Clarity in Right Action';
  }
  if (t.includes('वेदान्त') || t.includes('gita') || t.includes('geeta') || t.includes('upanishad') || t.includes('truth')) {
    return 'Self-Realization & Truth';
  }
  return 'Personal Freedom & Peace';
}

export function seedBooksFromCSV(): Book[] {
  const rootDir = path.resolve(__dirname, '../../../');
  const dataDir = path.join(rootDir, 'data');
  const publicBooksDir = path.join(rootDir, 'client/public/assets/books');

  const apPath = [
    path.join(dataDir, 'ap_foundation_books.xlsx'),
    path.join(dataDir, 'ap_foundation_books.csv'),
    path.join(rootDir, "Copy of Books' Inventory-Sale - Stalls_December.csv"),
  ].find(p => fs.existsSync(p));

  const otherPath = [
    path.join(dataDir, 'other_author_books.xlsx'),
    path.join(dataDir, 'other_author_books.csv'),
    path.join(rootDir, 'OtherAuthorBooks.csv'),
  ].find(p => fs.existsSync(p));

  const books: Book[] = [];
  let idCounter = 1;

  const getCoverImage = (sNo: number, preferEnglish = false): string => {
    const primarySubfolder = preferEnglish ? 'Eng_book_images' : 'book_images';
    const secondarySubfolder = preferEnglish ? 'book_images' : 'Eng_book_images';

    const exts = ['.jpg', '.png', '.jpeg'];

    for (const ext of exts) {
      const primaryPath = path.join(publicBooksDir, primarySubfolder, `book_image_${sNo}${ext}`);
      if (fs.existsSync(primaryPath)) {
        return `/assets/books/${primarySubfolder}/book_image_${sNo}${ext}`;
      }
    }

    for (const ext of exts) {
      const secondaryPath = path.join(publicBooksDir, secondarySubfolder, `book_image_${sNo}${ext}`);
      if (fs.existsSync(secondaryPath)) {
        return `/assets/books/${secondarySubfolder}/book_image_${sNo}${ext}`;
      }
    }

    return '';
  };

  // 1. Parse AP Foundation Books
  if (apPath) {
    try {
      if (apPath.endsWith('.xlsx')) {
        const workbook = XLSX.readFile(apPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        let currentSection = 'Bestsellers';

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const rowStr = row.join(' ');
          if (rowStr.includes('BEST-SELLERS')) currentSection = 'Bestsellers';
          else if (rowStr.includes('NEWLY LAUNCHED')) currentSection = 'Newly Launched';
          else if (rowStr.includes('TOP READS')) currentSection = 'Top Reads';
          else if (rowStr.includes('RECOMMENDED')) currentSection = 'Recommended';

          const sNo = parseInt(row[0]);
          if (isNaN(sNo)) continue;

          const title = cleanString(row[1]);
          if (!title || title.length < 2 || title.toLowerCase().includes('untitled')) continue;

          const hinglishTitle = cleanString(row[2]) || '';
          const langRaw = cleanString(row[3]) || 'Hindi';
          const status = cleanString(row[4]) || '';
          const pages = parseInt(row[5]) || 200;
          const mrp = parseFloat(row[6]) || 280;
          const buyingCost = parseFloat(row[7]) || 120;
          const inStockVal = parseInt(row[21]) || parseInt(row[8]) || 15;
          const sellingPrice = buyingCost > 0 ? buyingCost : Math.round(mrp * 0.6);

          let category: Book['category'] = 'Vedanta & Classics';
          let isKidsSection = false;

          const lowerTitle = (title + ' ' + hinglishTitle).toLowerCase();
          if (lowerTitle.includes('bachchon') || lowerTitle.includes('parenting') || lowerTitle.includes('bal ') || lowerTitle.includes('kids') || lowerTitle.includes('विद्यार्थी')) {
            category = 'Kids Wisdom';
            isKidsSection = true;
          } else if (lowerTitle.includes('मन') || lowerTitle.includes('mind') || lowerTitle.includes('डर') || lowerTitle.includes('fear') || lowerTitle.includes('motivation') || lowerTitle.includes('success')) {
            category = 'Mind & Character';
          } else if (lowerTitle.includes('स्त्री') || lowerTitle.includes('women') || lowerTitle.includes('सम्बन्ध') || lowerTitle.includes('love') || lowerTitle.includes('आनन्द') || lowerTitle.includes('joy')) {
            category = 'Self Discovery';
          }

          const isEng = langRaw.toLowerCase().includes('english');

          books.push({
            id: `ap_${idCounter++}`,
            title: title,
            hinglishTitle: hinglishTitle,
            author: 'Acharya Prashant',
            mainCategory: 'Acharya Prashant Foundation',
            category: category,
            isKidsSection: isKidsSection,
            isFeatured: status.toLowerCase().includes('special') || currentSection === 'Bestsellers',
            language: isEng ? 'English' : langRaw.toLowerCase().includes('bilingual') ? 'Bilingual' : 'Hindi',
            description: `Authoritative literature by Acharya Prashant exploring ${category.toLowerCase()}, self-realization, and wisdom principles for daily living.`,
            coverImage: getCoverImage(sNo, isEng),
            badge: status || (currentSection === 'Bestsellers' ? 'Bestseller' : 'AP Literature'),
            pages: pages,
            mrp: mrp,
            buyingCost: buyingCost,
            sellingPrice: sellingPrice,
            availableStock: inStockVal > 0 ? inStockVal : 10,
            problemAddressedTag: getProblemAddressedTag(title, hinglishTitle, category),
          });
        }
      } else {
        const fileContent = fs.readFileSync(apPath, 'utf-8');
        const lines = fileContent.split(/\r?\n/);
        let currentSection = 'Bestsellers';

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          if (line.includes('BEST-SELLERS')) currentSection = 'Bestsellers';
          else if (line.includes('NEWLY LAUNCHED')) currentSection = 'Newly Launched';
          else if (line.includes('TOP READS')) currentSection = 'Top Reads';
          else if (line.includes('RECOMMENDED')) currentSection = 'Recommended';

          const cols = parseCSVLine(line);
          const sNo = parseInt(cols[0]);
          if (isNaN(sNo)) continue;

          const title = cleanString(cols[1]);
          if (!title || title.length < 2 || title.toLowerCase().includes('untitled')) continue;

          const hinglishTitle = cleanString(cols[2]) || '';
          const langRaw = cleanString(cols[3]) || 'Hindi';
          const status = cleanString(cols[4]) || '';
          const pages = parseInt(cols[5]) || 200;
          const mrp = parseFloat(cols[6]) || 280;
          const buyingCost = parseFloat(cols[7]) || 120;
          const inStockVal = parseInt(cols[21]) || parseInt(cols[8]) || 15;
          const sellingPrice = buyingCost > 0 ? buyingCost : Math.round(mrp * 0.6);

          let category: Book['category'] = 'Vedanta & Classics';
          let isKidsSection = false;

          const lowerTitle = (title + ' ' + hinglishTitle).toLowerCase();
          if (lowerTitle.includes('bachchon') || lowerTitle.includes('parenting') || lowerTitle.includes('bal ') || lowerTitle.includes('kids') || lowerTitle.includes('विद्यार्थी')) {
            category = 'Kids Wisdom';
            isKidsSection = true;
          } else if (lowerTitle.includes('मन') || lowerTitle.includes('mind') || lowerTitle.includes('डर') || lowerTitle.includes('fear') || lowerTitle.includes('motivation') || lowerTitle.includes('success')) {
            category = 'Mind & Character';
          } else if (lowerTitle.includes('स्त्री') || lowerTitle.includes('women') || lowerTitle.includes('सम्बन्ध') || lowerTitle.includes('love') || lowerTitle.includes('आनन्द') || lowerTitle.includes('joy')) {
            category = 'Self Discovery';
          }

          const isEng = langRaw.toLowerCase().includes('english');

          books.push({
            id: `ap_${idCounter++}`,
            title: title,
            hinglishTitle: hinglishTitle,
            author: 'Acharya Prashant',
            mainCategory: 'Acharya Prashant Foundation',
            category: category,
            isKidsSection: isKidsSection,
            isFeatured: status.toLowerCase().includes('special') || currentSection === 'Bestsellers',
            language: isEng ? 'English' : langRaw.toLowerCase().includes('bilingual') ? 'Bilingual' : 'Hindi',
            description: `Authoritative literature by Acharya Prashant exploring ${category.toLowerCase()}, self-realization, and wisdom principles for daily living.`,
            coverImage: getCoverImage(sNo, isEng),
            badge: status || (currentSection === 'Bestsellers' ? 'Bestseller' : 'AP Literature'),
            pages: pages,
            mrp: mrp,
            buyingCost: buyingCost,
            sellingPrice: sellingPrice,
            availableStock: inStockVal > 0 ? inStockVal : 10,
            problemAddressedTag: getProblemAddressedTag(title, hinglishTitle, category),
          });
        }
      }
    } catch (e) {
      console.error('Error parsing AP books file:', e);
    }
  }

  // 2. Parse Other Author Books
  if (otherPath) {
    try {
      if (otherPath.endsWith('.xlsx')) {
        const workbook = XLSX.readFile(otherPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const sNo = parseInt(row[0]);
          if (isNaN(sNo)) continue;

          const fullName = cleanString(row[1]);
          if (!fullName || fullName.length < 2 || fullName.toLowerCase().includes('untitled')) continue;

          let title = fullName;
          let author = 'Classic Author';

          if (fullName.includes('—')) {
            const parts = fullName.split('—');
            title = parts[0].trim();
            author = parts[1].trim();
          } else if (fullName.includes('–')) {
            const parts = fullName.split('–');
            title = parts[0].trim();
            author = parts[1].trim();
          } else if (fullName.includes('-')) {
            const parts = fullName.split('-');
            title = parts[0].trim();
            author = parts[1].trim();
          }

          const mrp = parseFloat(row[2]) || 200;
          const buyingCost = parseFloat(row[3]) || 100;
          const qty = parseInt(row[4]) || 5;
          const externalLink = row[row.length - 2] && row[row.length - 2].toString().startsWith('http') ? row[row.length - 2].toString() : '';

          const lowerTitle = title.toLowerCase();
          let category: Book['category'] = 'Mind & Character';
          let isKidsSection = false;

          if (lowerTitle.includes('child') || lowerTitle.includes('stories') || lowerTitle.includes('little')) {
            category = 'Kids Wisdom';
            isKidsSection = true;
          } else if (lowerTitle.includes('gandhi') || lowerTitle.includes('truth') || lowerTitle.includes('caste') || lowerTitle.includes('autobiography')) {
            category = 'Self Discovery';
          } else if (lowerTitle.includes('freud') || lowerTitle.includes('dostoevsky') || lowerTitle.includes('marx') || lowerTitle.includes('manifesto')) {
            category = 'Vedanta & Classics';
          }

          books.push({
            id: `oth_${idCounter++}`,
            title: title,
            author: author,
            mainCategory: 'Other Author',
            category: category,
            isKidsSection: isKidsSection,
            isFeatured: idCounter % 5 === 0,
            language: 'English',
            description: `Classic literature work "${title}" by ${author}. Curated addition to the Tricity Bookstall collection.`,
            coverImage: getCoverImage(sNo, true),
            badge: 'Classics Selection',
            pages: 180,
            mrp: mrp,
            buyingCost: buyingCost,
            sellingPrice: buyingCost > 0 ? buyingCost : Math.round(mrp * 0.7),
            availableStock: qty,
            externalLink: externalLink,
            problemAddressedTag: getProblemAddressedTag(title, '', category),
          });
        }
      } else {
        const fileContent = fs.readFileSync(otherPath, 'utf-8');
        const lines = fileContent.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = parseCSVLine(line);
          const sNo = parseInt(cols[0]);
          if (isNaN(sNo)) continue;

          const fullName = cleanString(cols[1]);
          if (!fullName || fullName.length < 2 || fullName.toLowerCase().includes('untitled')) continue;

          let title = fullName;
          let author = 'Classic Author';

          if (fullName.includes('—')) {
            const parts = fullName.split('—');
            title = parts[0].trim();
            author = parts[1].trim();
          } else if (fullName.includes('–')) {
            const parts = fullName.split('–');
            title = parts[0].trim();
            author = parts[1].trim();
          } else if (fullName.includes('-')) {
            const parts = fullName.split('-');
            title = parts[0].trim();
            author = parts[1].trim();
          }

          const mrp = parseFloat(cols[2]) || 200;
          const buyingCost = parseFloat(cols[3]) || 100;
          const qty = parseInt(cols[4]) || 5;
          const externalLink = cols[cols.length - 2] && cols[cols.length - 2].startsWith('http') ? cols[cols.length - 2] : '';

          const lowerTitle = title.toLowerCase();
          let category: Book['category'] = 'Mind & Character';
          let isKidsSection = false;

          if (lowerTitle.includes('child') || lowerTitle.includes('stories') || lowerTitle.includes('little')) {
            category = 'Kids Wisdom';
            isKidsSection = true;
          } else if (lowerTitle.includes('gandhi') || lowerTitle.includes('truth') || lowerTitle.includes('caste') || lowerTitle.includes('autobiography')) {
            category = 'Self Discovery';
          } else if (lowerTitle.includes('freud') || lowerTitle.includes('dostoevsky') || lowerTitle.includes('marx') || lowerTitle.includes('manifesto')) {
            category = 'Vedanta & Classics';
          }

          books.push({
            id: `oth_${idCounter++}`,
            title: title,
            author: author,
            mainCategory: 'Other Author',
            category: category,
            isKidsSection: isKidsSection,
            isFeatured: idCounter % 5 === 0,
            language: 'English',
            description: `Classic literature work "${title}" by ${author}. Curated addition to the Tricity Bookstall collection.`,
            coverImage: getCoverImage(sNo, true),
            badge: 'Classics Selection',
            pages: 180,
            mrp: mrp,
            buyingCost: buyingCost,
            sellingPrice: buyingCost > 0 ? buyingCost : Math.round(mrp * 0.7),
            availableStock: qty,
            externalLink: externalLink,
            problemAddressedTag: getProblemAddressedTag(title, '', category),
          });
        }
      }
    } catch (e) {
      console.error('Error parsing Other author books file:', e);
    }
  }

  return books;
}
