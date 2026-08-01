import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Sparkles, Send, Globe } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onRequestCopy }) {
  const [requested, setRequested] = useState(false);

  if (!book) return null;

  const handleCopyRequest = () => {
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      onRequestCopy(book);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-950/80 hover:bg-slate-800 text-white p-2 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Cover image container */}
          <div className="relative h-72 sm:h-full bg-slate-950">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            
            {book.badge && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                {book.badge}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-orange-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{book.category}</span>
                {book.readingAge && (
                  <span className="text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30">
                    {book.readingAge}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-snug">
                {book.title}
              </h3>

              <p className="text-xs text-amber-400 font-semibold mt-1">
                By {book.author}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center space-x-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>Language: {book.language}</span>
                </span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  Pages: {book.pages || 150}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Availability:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>In Stock ({book.availableStock} copies)</span>
                </span>
              </div>

              <button
                onClick={handleCopyRequest}
                disabled={requested}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                {requested ? (
                  <span className="text-white flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span>Copy Requested!</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Copy for Stall / School</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
