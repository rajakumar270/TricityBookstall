import React, { useState } from 'react';
import { Sparkles, Heart, Star, BookOpen, Smile, Award, Check, RefreshCw } from 'lucide-react';

export default function KidsSection({ books, onBookSelect, siteVersion = 'v2' }) {
  const kidsBooks = books.filter(b => b.isKidsSection);
  const [selectedAge, setSelectedAge] = useState('All');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const isV2 = siteVersion === 'v2';

  const wisdomQuotes = [
    { quote: "Truthfulness and honesty build a courageous heart that fears nothing.", source: "Bal Ekatva Wisdom" },
    { quote: "A calm mind brings great focus, just like clear water reflects the bright sunshine.", source: "Stories of Clarity" },
    { quote: "Kindness is a magical gift—the more you give to others, the happier you become!", source: "Moral Tales for Young Readers" },
    { quote: "Respecting parents and teachers opens the doorway to true knowledge and wisdom.", source: "Bal Gita Series" },
  ];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % wisdomQuotes.length);
  };

  const filteredKidsBooks = kidsBooks.filter(b => {
    if (selectedAge === 'All') return true;
    if (selectedAge === '5-10' && (b.readingAge?.includes('5') || b.readingAge?.includes('6'))) return true;
    if (selectedAge === '11-15' && (b.readingAge?.includes('11') || b.readingAge?.includes('12') || b.readingAge?.includes('14'))) return true;
    return true;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Kids Corner Header Banner */}
      <div className={`relative rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border text-white ${
        isV2
          ? 'bg-[#242220] border-[#A36B42]/30'
          : 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 border-pink-400/30'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase ${
              isV2 ? 'bg-[#A36B42]/20 text-[#A36B42]' : 'bg-white/20 text-white'
            }`}>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>Bal Ekatva • Kids Wisdom Series</span>
            </div>
            
            <h2 className={`text-3xl sm:text-5xl tracking-tight leading-tight ${isV2 ? 'font-serif-editorial text-[#F7F4EE]' : 'font-black text-white'}`}>
              Shaping Young Minds with <br className="hidden sm:inline" />
              <span className={isV2 ? 'text-[#A36B42] italic font-semibold' : 'text-yellow-300 underline decoration-wavy decoration-pink-300'}>Timeless Values & Joy!</span> 🎈
            </h2>
            
            <p className={`text-base sm:text-lg font-medium ${isV2 ? 'text-[#D4C9BC]' : 'text-pink-100'}`}>
              Vibrant, beautifully illustrated storybooks, Bal Gita, and moral tales designed to nurture courage, kindness, focus, and character in children.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Illustrated Stories</span>
              </span>
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300" />
                <span>Value Education</span>
              </span>
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Smile className="w-3.5 h-3.5 text-cyan-300" />
                <span>Bilingual & Easy Hindi/English</span>
              </span>
            </div>
          </div>

          {/* Interactive Daily Quote Card for Kids */}
          <div className={`w-full md:w-80 rounded-2xl p-6 shadow-2xl text-center space-y-4 border ${
            isV2
              ? 'bg-[#EFEBE2] border-[#A36B42]/30 text-[#242220]'
              : 'bg-slate-900/90 backdrop-blur-xl border-pink-400/40 text-white'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${isV2 ? 'text-[#A36B42]' : 'text-pink-400'}`}>
              <span className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Daily Wisdom Card</span>
              </span>
              <button 
                onClick={handleNextQuote}
                className={`p-1 rounded-lg ${isV2 ? 'bg-[#F7F4EE] text-[#242220]' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                title="Next Quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <blockquote className={`text-sm font-medium italic min-h-[70px] flex items-center justify-center ${isV2 ? 'text-[#5C554E]' : 'text-slate-200'}`}>
              "{wisdomQuotes[quoteIndex].quote}"
            </blockquote>

            <p className={`text-xs font-semibold ${isV2 ? 'text-[#A36B42]' : 'text-amber-400'}`}>
              — {wisdomQuotes[quoteIndex].source}
            </p>

            <button
              onClick={handleNextQuote}
              className={`w-full font-bold text-xs py-2.5 rounded-xl shadow-md transition-all ${
                isV2
                  ? 'bg-[#242220] hover:bg-[#3D3834] text-white'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-extrabold'
              }`}
            >
              Discover Another Card ✨
            </button>
          </div>
        </div>
      </div>

      {/* Age Filters */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className={`text-2xl font-bold flex items-center space-x-2 ${isV2 ? 'font-serif-editorial text-[#242220]' : 'font-extrabold text-slate-900 dark:text-white'}`}>
            <span>Kids & Youth Book Collection</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${isV2 ? 'bg-[#EFEBE2] text-[#A36B42] border-[#A36B42]/30' : 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30'}`}>
              {filteredKidsBooks.length} Books
            </span>
          </h3>
          <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}`}>Select age group or browse illustrated classics</p>
        </div>

        <div className={`flex items-center space-x-2 p-1.5 rounded-2xl border shadow-sm ${
          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
        }`}>
          {['All', '5-10', '11-15'].map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedAge === age
                  ? isV2 
                    ? 'bg-[#242220] text-white shadow-md'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : isV2 ? 'text-[#5C554E] hover:text-[#242220]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {age === 'All' ? 'All Ages' : `Ages ${age}`}
            </button>
          ))}
        </div>
      </div>

      {/* Kids Books Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredKidsBooks.map((book) => (
          <div
            key={book.id}
            className={`rounded-3xl overflow-hidden flex flex-col group border transition-all duration-300 shadow-sm ${
              isV2
                ? 'bg-[#EFEBE2] border-[#A36B42]/20 hover:border-[#A36B42]/50 hover:-translate-y-1'
                : 'glass-card border-slate-200 dark:border-slate-800 hover:border-pink-500/50'
            }`}
          >
            {/* Book Cover Container */}
            <div className={`relative h-64 overflow-hidden flex flex-col justify-between p-4 ${
              isV2 ? 'bg-[#242220]' : 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:via-slate-900 dark:to-slate-950'
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

              {(!book.coverImage || book.coverImage.trim() === '') && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-3 space-y-2.5 z-0">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                    isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#A36B42]' : 'bg-pink-500/20 border-pink-500/40 text-pink-600 dark:text-pink-300'
                  }`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className={`font-bold text-sm line-clamp-2 ${isV2 ? 'font-serif-editorial text-[#F7F4EE]' : 'text-slate-900 dark:text-white'}`}>{book.title}</span>
                  <span className={`text-xs font-semibold ${isV2 ? 'text-[#A36B42]' : 'text-pink-600 dark:text-pink-300'}`}>{book.author}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Badge overlay */}
              {book.badge && (
                <div className={`absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg z-10 ${
                  isV2 ? 'bg-[#242220] text-[#A36B42] border border-[#A36B42]/40' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                }`}>
                  {book.badge}
                </div>
              )}

              {book.readingAge && (
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30 z-10">
                  {book.readingAge}
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 z-10">
                <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                  {book.language}
                </span>
                <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                  {book.pages || 120} Pages
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className={`text-lg line-clamp-1 transition-colors ${
                  isV2 ? 'font-serif-editorial font-bold text-[#242220] group-hover:text-[#A36B42]' : 'font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400'
                }`}>
                  {book.title}
                </h4>
                <p className={`text-xs font-semibold mt-1 ${isV2 ? 'text-[#A36B42]' : 'text-amber-700 dark:text-amber-400'}`}>
                  By {book.author}
                </p>
                <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
                  {book.description}
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between ${isV2 ? 'border-[#A36B42]/15' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock ({book.availableStock})</span>
                </div>

                <button
                  onClick={() => onBookSelect(book)}
                  className={`flex items-center space-x-1.5 font-bold text-xs px-4 py-2 rounded-full transition-all shadow-sm ${
                    isV2
                      ? 'bg-[#242220] hover:bg-[#3D3834] text-white'
                      : 'bg-pink-500/10 hover:bg-pink-500 text-pink-600 hover:text-white dark:text-pink-400 border border-pink-500/30'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Preview Book</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
