import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Sparkles, Send, Globe, Tag, DollarSign } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onRequestCopy }) {
  const [requested, setRequested] = useState(false);

  if (!book) return null;

  const handleCopyRequest = () => {
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      if (onRequestCopy) onRequestCopy(book);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transition-colors">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-white p-2 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Cover image container */}
          <div className="relative h-72 sm:h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}

            {(!book.coverImage || book.coverImage.trim() === '') && (
              <div className="text-center space-y-2">
                <BookOpen className="w-12 h-12 text-orange-500 mx-auto" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{book.title}</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">{book.author}</p>
              </div>
            )}
            
            {book.badge && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                {book.badge}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{book.category}</span>
                {book.readingAge && (
                  <span className="text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30">
                    {book.readingAge}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">
                {book.title}
              </h3>

              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
                By {book.author}
              </p>

              {/* Problem Addressed Tag */}
              {book.problemAddressedTag && (
                <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-lg">
                  <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>🎯 Addresses: {book.problemAddressedTag}</span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-1 font-bold">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>Language: {book.language}</span>
                </span>
                <span className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-bold">
                  Selling Cost: ₹{book.sellingPrice || book.mrp || 0}
                </span>
                {book.mrp > 0 && (
                  <span className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 line-through text-slate-400">
                    MRP: ₹{book.mrp}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Available Stock:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{book.availableStock > 0 ? `${book.availableStock} copies in stock` : 'Out of stock'}</span>
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
