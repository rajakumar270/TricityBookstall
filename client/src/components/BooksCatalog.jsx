import React, { useState } from 'react';
import { Search, Filter, BookOpen, CheckCircle, Info, Sparkles } from 'lucide-react';

export default function BooksCatalog({ books, onBookSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const categories = ['All', 'Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics'];
  const languages = ['All', 'English', 'Hindi', 'Bilingual'];

  const filteredBooks = books.filter((book) => {
    // Category match
    const categoryMatch =
      selectedCategory === 'All' || book.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Language match
    const langMatch =
      selectedLanguage === 'All' || book.language.toLowerCase() === selectedLanguage.toLowerCase();

    // Search query match
    const searchLower = searchQuery.toLowerCase().trim();
    const searchMatch =
      !searchLower ||
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.description.toLowerCase().includes(searchLower);

    return categoryMatch && langMatch && searchMatch;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Literature & Wisdom Collection</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Books for <span className="gradient-text-saffron">Youth & Seekers</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300">
          Carefully selected titles on mind control, self-discovery, character building, kids wisdom, and classical Indian philosophy.
        </p>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="mt-10 glass-panel p-4 sm:p-6 rounded-2xl space-y-4 border border-slate-800">
        
        {/* Search & Language Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Language:</span>
            </span>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'Kids Wisdom' ? '🎈 Kids Wisdom' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid */}
      <div className="mt-8">
        {filteredBooks.length === 0 ? (
          <div className="glass-panel text-center py-16 px-4 rounded-2xl border border-slate-800 space-y-3">
            <Info className="w-10 h-10 text-orange-400 mx-auto opacity-80" />
            <h3 className="text-lg font-bold text-white">No Books Match Your Filter</h3>
            <p className="text-xs text-slate-400">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedLanguage('All');
              }}
              className="mt-2 text-xs font-bold text-orange-400 underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300"
              >
                {/* Book Cover Image */}
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Badge Overlay */}
                  {book.badge && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      {book.badge}
                    </div>
                  )}

                  {book.isKidsSection && (
                    <div className="absolute top-3 right-3 bg-pink-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Kids</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                      {book.category}
                    </span>
                    <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                      {book.language}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium mt-1">
                      {book.author}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>In Stock</span>
                    </div>

                    <button
                      onClick={() => onBookSelect(book)}
                      className="bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-xl border border-orange-500/30 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
