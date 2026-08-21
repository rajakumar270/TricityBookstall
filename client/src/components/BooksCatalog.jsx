import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, CheckCircle, Info, Sparkles, Layers, Tag, Loader2, ArrowUp } from 'lucide-react';

export default function BooksCatalog({ books, onBookSelect, siteVersion = 'v2' }) {
  const [selectedMainCat, setSelectedMainCat] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Scroll Pagination State
  const BATCH_SIZE = 16;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isV2 = siteVersion === 'v2';

  const mainCategories = ['All', 'Acharya Prashant Foundation', 'Other Author'];
  const categories = ['All', 'Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics'];
  const languages = ['All', 'English', 'Hindi', 'Bilingual'];

  const apCount = books.filter(b => b.mainCategory === 'Acharya Prashant Foundation').length;
  const otherCount = books.filter(b => b.mainCategory === 'Other Author').length;

  const filteredBooks = books.filter((book) => {
    // Main category match
    const mainCatMatch =
      selectedMainCat === 'All' || book.mainCategory === selectedMainCat;

    // Sub category match
    const categoryMatch =
      selectedCategory === 'All' || (book.category && book.category.toLowerCase() === selectedCategory.toLowerCase());
    
    // Language match
    const langMatch =
      selectedLanguage === 'All' || (book.language && book.language.toLowerCase() === selectedLanguage.toLowerCase());

    // Search query match
    const searchLower = searchQuery.toLowerCase().trim();
    const searchMatch =
      !searchLower ||
      book.title.toLowerCase().includes(searchLower) ||
      (book.hinglishTitle && book.hinglishTitle.toLowerCase().includes(searchLower)) ||
      book.author.toLowerCase().includes(searchLower) ||
      (book.description && book.description.toLowerCase().includes(searchLower)) ||
      (book.problemAddressedTag && book.problemAddressedTag.toLowerCase().includes(searchLower));

    return mainCatMatch && categoryMatch && langMatch && searchMatch;
  });

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedMainCat, selectedCategory, searchQuery, selectedLanguage]);

  // Scroll listener for infinite scroll pagination
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 400;

      if (scrollPosition >= threshold && visibleCount < filteredBooks.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredBooks.length));
          setIsLoadingMore(false);
        }, 250);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredBooks.length, isLoadingMore]);

  const displayedBooks = filteredBooks.slice(0, visibleCount);

  const handleManualLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredBooks.length));
      setIsLoadingMore(false);
    }, 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="catalog" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
          isV2
            ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#A36B42]'
            : 'bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400'
        }`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>Books Management & Inventory • {books.length} Loaded</span>
        </div>
        
        <h2 className={`text-3xl sm:text-5xl font-normal tracking-tight ${isV2 ? 'font-serif-editorial text-[#242220]' : 'font-extrabold text-slate-900 dark:text-white'}`}>
          Explore Books for <span className={isV2 ? 'text-[#A36B42] italic font-semibold' : 'gradient-text-saffron'}>Youth & Seekers</span>
        </h2>
        
        <p className={`text-sm sm:text-base ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
          Curated collection featuring **{apCount} Acharya Prashant Foundation** titles & **{otherCount} Other Author** classics with problem-addressed tags.
        </p>
      </div>

      {/* Main Category Primary Selector Tabs */}
      <div className="mt-8 flex justify-center">
        <div className={`inline-flex p-1.5 rounded-2xl border shadow-md max-w-full overflow-x-auto ${
          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
        }`}>
          {mainCategories.map((mainCat) => {
            const isActive = selectedMainCat === mainCat;
            const count = mainCat === 'All' ? books.length : mainCat === 'Acharya Prashant Foundation' ? apCount : otherCount;
            return (
              <button
                key={mainCat}
                onClick={() => setSelectedMainCat(mainCat)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap flex items-center space-x-2 ${
                  isActive
                    ? isV2 
                      ? 'bg-[#242220] text-white shadow-md'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white dark:text-slate-950 shadow-lg'
                    : isV2
                      ? 'text-[#5C554E] hover:text-[#242220]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{mainCat === 'All' ? '📚 All Inventory' : mainCat === 'Acharya Prashant Foundation' ? '🚩 AP Foundation Books' : '📖 Other Author Books'}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Search & Sub-Filters */}
      <div className={`mt-6 p-4 sm:p-6 rounded-3xl space-y-4 border ${
        isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20 shadow-sm' : 'glass-panel border-slate-200 dark:border-slate-800'
      }`}>
        
        {/* Search & Language Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, or problem (fear, stress, focus)..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                isV2
                  ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500'
              }`}
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className={`text-xs font-semibold uppercase tracking-wider flex items-center space-x-1 ${isV2 ? 'text-[#A36B42]' : 'text-slate-500 dark:text-slate-400'}`}>
              <Filter className="w-3.5 h-3.5" />
              <span>Language:</span>
            </span>
            <div className={`flex p-1 rounded-xl border ${isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/20' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedLanguage === lang
                      ? isV2
                        ? 'bg-[#242220] text-white font-bold shadow-sm'
                        : 'bg-orange-500 text-white dark:text-slate-950 font-bold shadow-sm'
                      : isV2 ? 'text-[#5C554E] hover:text-[#242220]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub Category Tabs */}
        <div className={`pt-2 border-t flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none ${isV2 ? 'border-[#A36B42]/15' : 'border-slate-200/60 dark:border-slate-800/60'}`}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? isV2 
                      ? 'bg-[#242220] text-white shadow-sm'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/50 shadow-sm'
                    : isV2
                      ? 'bg-[#F7F4EE] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat === 'Kids Wisdom' ? '🎈 Kids Wisdom' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count & Scroll Pagination Indicator */}
      <div className="mt-6 flex justify-between items-center px-1">
        <span className={`text-xs font-bold ${isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}`}>
          Showing <span className={isV2 ? 'text-[#A36B42] font-black' : 'text-orange-600 dark:text-orange-400 font-black'}>{displayedBooks.length}</span> of {filteredBooks.length} books
          {filteredBooks.length > BATCH_SIZE && (
            <span className="opacity-75 font-normal ml-1"> (Scroll to load more)</span>
          )}
        </span>
        {filteredBooks.length < books.length && (
          <button
            onClick={() => {
              setSelectedMainCat('All');
              setSelectedCategory('All');
              setSearchQuery('');
              setSelectedLanguage('All');
            }}
            className={`text-xs underline font-semibold ${isV2 ? 'text-[#A36B42] hover:text-[#242220]' : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'}`}
          >
            Show All {books.length} Books
          </button>
        )}
      </div>

      {/* Books Grid */}
      <div className="mt-4">
        {filteredBooks.length === 0 ? (
          <div className={`text-center py-16 px-4 rounded-3xl border space-y-3 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'glass-panel border-slate-200 dark:border-slate-800'}`}>
            <Info className={`w-10 h-10 mx-auto opacity-80 ${isV2 ? 'text-[#A36B42]' : 'text-orange-500 dark:text-orange-400'}`} />
            <h3 className={`text-lg font-bold ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-slate-900 dark:text-white'}`}>No Books Match Your Search Filter</h3>
            <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}`}>Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSelectedMainCat('All');
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedLanguage('All');
              }}
              className={`mt-2 text-xs font-bold underline ${isV2 ? 'text-[#A36B42]' : 'text-orange-600 dark:text-orange-400'}`}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedBooks.map((book) => (
                <div
                  key={book.id}
                  className={`rounded-3xl overflow-hidden flex flex-col group border transition-all duration-300 shadow-sm ${
                    isV2
                      ? 'bg-[#EFEBE2] border-[#A36B42]/20 hover:border-[#A36B42]/50 hover:-translate-y-1'
                      : 'glass-card border-slate-200 dark:border-slate-800/80 hover:border-orange-500/50 dark:hover:border-orange-500/40'
                  }`}
                >
                  {/* Book Cover Image Container */}
                  <div className={`relative h-64 overflow-hidden flex flex-col justify-between p-4 ${
                    isV2 ? 'bg-[#242220]' : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900'
                  }`}>
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Fallback Stylized Card when image is not present */}
                    {(!book.coverImage || book.coverImage.trim() === '') && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 space-y-2.5 z-0">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                          isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#A36B42]' : 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className={`font-bold text-sm line-clamp-2 ${isV2 ? 'font-serif-editorial text-[#F7F4EE]' : 'text-slate-900 dark:text-white'}`}>{book.title}</span>
                        <span className={`text-xs font-semibold ${isV2 ? 'text-[#A36B42]' : 'text-amber-700 dark:text-amber-400'}`}>{book.author}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Main Category Badge */}
                    <div className={`absolute top-3 left-3 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md z-10 ${
                      isV2 ? 'bg-[#242220] text-[#A36B42] border border-[#A36B42]/40' : 'bg-slate-950/90 text-amber-400 border border-amber-500/30'
                    }`}>
                      {book.mainCategory === 'Acharya Prashant Foundation' ? 'AP Foundation' : 'Other Author'}
                    </div>

                    {book.isKidsSection && (
                      <div className="absolute top-3 right-3 bg-pink-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 z-10">
                        <Sparkles className="w-3 h-3" />
                        <span>Kids</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200 z-10">
                      <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                        {book.category}
                      </span>
                      <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 font-bold">
                        {book.language}
                      </span>
                    </div>
                  </div>

                  {/* Details & Pricing */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className={`text-base line-clamp-1 transition-colors ${
                        isV2 ? 'font-serif-editorial font-bold text-[#242220] group-hover:text-[#A36B42]' : 'font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'
                      }`}>
                        {book.title}
                      </h3>
                      
                      <p className={`text-xs font-medium mt-0.5 ${isV2 ? 'text-[#A36B42]' : 'text-amber-700 dark:text-amber-400'}`}>
                        {book.author}
                      </p>

                      {/* Problem Addressed Tag Pill */}
                      {book.problemAddressedTag && (
                        <div className={`mt-1.5 inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isV2 ? 'bg-[#F7F4EE] text-[#242220] border-[#A36B42]/30' : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                        }`}>
                          <Tag className={`w-3 h-3 shrink-0 ${isV2 ? 'text-[#A36B42]' : 'text-amber-600 dark:text-amber-400'}`} />
                          <span>🎯 {book.problemAddressedTag}</span>
                        </div>
                      )}

                      <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
                        {book.description}
                      </p>
                    </div>

                    <div className={`pt-3 border-t space-y-2 ${isV2 ? 'border-[#A36B42]/15' : 'border-slate-200 dark:border-slate-800/80'}`}>
                      {/* Price display */}
                      <div className="flex items-center justify-between">
                        <div>
                          {book.mrp > 0 && (
                            <span className="text-[11px] text-slate-400 line-through mr-1.5">
                              MRP ₹{book.mrp}
                            </span>
                          )}
                          <span className={`text-sm font-extrabold ${isV2 ? 'text-[#242220]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            ₹{book.sellingPrice || book.mrp || 0}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          book.availableStock > 0 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}>
                          {book.availableStock > 0 ? `${book.availableStock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => onBookSelect(book)}
                        className={`w-full font-bold text-xs py-2.5 rounded-full transition-all text-center ${
                          isV2
                            ? 'bg-[#242220] hover:bg-[#3D3834] text-white shadow-sm'
                            : 'bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white border border-orange-500/30'
                        }`}
                      >
                        View Details & Stall Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Pagination Status & Load More Controls */}
            <div className={`mt-12 text-center py-6 border-t flex flex-col items-center justify-center space-y-3 ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-200/80 dark:border-slate-800/80'}`}>
              {isLoadingMore ? (
                <div className={`flex items-center space-x-2 text-sm font-bold ${isV2 ? 'text-[#A36B42]' : 'text-orange-600 dark:text-orange-400'}`}>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading next batch of books...</span>
                </div>
              ) : visibleCount < filteredBooks.length ? (
                <div className="space-y-2">
                  <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}`}>
                    Showing <strong className={isV2 ? 'text-[#A36B42]' : 'text-orange-600 dark:text-orange-400'}>{displayedBooks.length}</strong> of {filteredBooks.length} total books. <br className="sm:hidden"/> Scroll down to load more automatically!
                  </p>
                  <button
                    onClick={handleManualLoadMore}
                    className={`font-bold text-xs px-6 py-2.5 rounded-full border transition-all ${
                      isV2
                        ? 'bg-[#242220] text-white hover:bg-[#3D3834] border-[#A36B42]/30'
                        : 'bg-slate-200 dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Load Next {Math.min(BATCH_SIZE, filteredBooks.length - visibleCount)} Books
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full max-w-md pt-2">
                  <span className={`text-xs font-semibold ${isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}`}>
                    ✨ All {filteredBooks.length} books loaded
                  </span>
                  <button
                    onClick={scrollToTop}
                    className={`flex items-center space-x-1 text-xs font-bold hover:underline ${isV2 ? 'text-[#A36B42]' : 'text-orange-600 dark:text-orange-400'}`}
                  >
                    <span>Back to top</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </section>
  );
}
