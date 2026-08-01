import React, { useState } from 'react';
import { Sparkles, Heart, Star, BookOpen, Smile, Award, Check, RefreshCw } from 'lucide-react';

export default function KidsSection({ books, onBookSelect }) {
  const kidsBooks = books.filter(b => b.isKidsSection);
  const [selectedAge, setSelectedAge] = useState('All');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const wisdomQuotes = [
    { quote: "Truthfulness and honesty build a courageous heart that fears nothing.", source: "Bal Prabodhanam Wisdom" },
    { quote: "A calm mind brings great focus, just like clear water reflects the bright sunshine.", source: "Stories of Clarity" },
    { quote: "Kindness is a magical gift—the more you give to others, the happier you become!", source: "Moral Tales for Young Readers" },
    { quote: "Respecting parents and teachers opens the doorway to true knowledge and wisdom.", source: "Bal Gita Series" },
  ];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % wisdomQuotes.length);
  };

  const filteredKidsBooks = kidsBooks.filter(b => {
    if (selectedAge === 'All') return true;
    if (selectedAge === '5-10' && b.readingAge?.includes('5') || b.readingAge?.includes('6')) return true;
    if (selectedAge === '11-15' && b.readingAge?.includes('11') || b.readingAge?.includes('12') || b.readingAge?.includes('14')) return true;
    return true;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Kids Corner Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 shadow-2xl shadow-purple-500/20 border border-pink-400/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-xs font-extrabold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>Bal Prabodhanam • Kids Wisdom Series</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Shaping Young Minds with <br className="hidden sm:inline" />
              <span className="text-yellow-300 underline decoration-wavy decoration-pink-300">Timeless Values & Joy!</span> 🎈
            </h2>
            
            <p className="text-base sm:text-lg text-pink-100 font-medium">
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
          <div className="w-full md:w-80 bg-slate-900/90 backdrop-blur-xl border border-pink-400/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-pink-400 uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Daily Wisdom Card</span>
              </span>
              <button 
                onClick={handleNextQuote}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                title="Next Quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <blockquote className="text-sm font-medium italic text-slate-200 min-h-[70px] flex items-center justify-center">
              "{wisdomQuotes[quoteIndex].quote}"
            </blockquote>

            <p className="text-xs text-amber-400 font-semibold">
              — {wisdomQuotes[quoteIndex].source}
            </p>

            <button
              onClick={handleNextQuote}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition-all"
            >
              Discover Another Card ✨
            </button>
          </div>
        </div>
      </div>

      {/* Age Filters */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Kids & Youth Book Collection</span>
            <span className="bg-pink-500/20 text-pink-400 text-xs px-2.5 py-1 rounded-full border border-pink-500/30">
              {filteredKidsBooks.length} Books
            </span>
          </h3>
          <p className="text-xs text-slate-400">Select age group or browse illustrated classics</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {['All', '5-10', '11-15'].map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedAge === age
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
            className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-pink-500/50 transition-all duration-300"
          >
            {/* Book Cover Container */}
            <div className="relative h-64 overflow-hidden bg-slate-900">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              {/* Badge overlay */}
              {book.badge && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg">
                  {book.badge}
                </div>
              )}

              {book.readingAge && (
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  {book.readingAge}
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                  {book.language}
                </span>
                <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                  {book.pages} Pages
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                  {book.title}
                </h4>
                <p className="text-xs text-amber-400 font-semibold mt-1">
                  By {book.author}
                </p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock ({book.availableStock})</span>
                </div>

                <button
                  onClick={() => onBookSelect(book)}
                  className="flex items-center space-x-1.5 bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white font-bold text-xs px-4 py-2 rounded-xl border border-pink-500/30 transition-all shadow-md"
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
