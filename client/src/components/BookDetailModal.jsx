import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Sparkles, Send, Globe, Tag } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onRequestCopy, siteVersion = 'v2' }) {
  const [requested, setRequested] = useState(false);

  if (!book) return null;

  const handleCopyRequest = () => {
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      if (onRequestCopy) onRequestCopy(book);
    }, 1500);
  };

  const isV2 = siteVersion === 'v2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        isV2 
          ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}>
        
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
            isV2
              ? 'bg-[#EFEBE2] hover:bg-[#E5DFD3] text-[#242220]'
              : 'bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Cover image container */}
          <div className={`relative h-72 sm:h-full flex items-center justify-center p-4 ${
            isV2 ? 'bg-[#EFEBE2]' : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900'
          }`}>
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-2xl shadow-md border border-[#A36B42]/15"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}

            {(!book.coverImage || book.coverImage.trim() === '') && (
              <div className="text-center space-y-2">
                <BookOpen className={`w-12 h-12 mx-auto ${isV2 ? 'text-[#A36B42]' : 'text-orange-500'}`} />
                <h4 className="font-extrabold text-base">{book.title}</h4>
                <p className={`text-xs ${isV2 ? 'text-[#A36B42]' : 'text-amber-600 dark:text-amber-400'}`}>{book.author}</p>
              </div>
            )}
            
            {book.badge && (
              <div className={`absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg ${
                isV2
                  ? 'bg-[#242220] text-white border border-[#A36B42]/40'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
              }`}>
                {book.badge}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className={`flex items-center space-x-2 text-xs font-bold ${isV2 ? 'text-[#A36B42]' : 'text-orange-600 dark:text-orange-400'}`}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{book.category}</span>
                {book.readingAge && (
                  <span className="text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30">
                    {book.readingAge}
                  </span>
                )}
              </div>

              <h3 className={`mt-2 leading-snug ${isV2 ? 'font-serif-editorial text-2xl font-bold text-[#242220]' : 'text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white'}`}>
                {book.title}
              </h3>

              <p className={`text-xs font-semibold mt-1 ${isV2 ? 'text-[#A36B42]' : 'text-amber-700 dark:text-amber-400'}`}>
                By {book.author}
              </p>

              {/* Problem Addressed Tag */}
              {book.problemAddressedTag && (
                <div className={`mt-2.5 inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${
                  isV2
                    ? 'bg-[#EFEBE2] text-[#242220] border-[#A36B42]/30'
                    : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                }`}>
                  <Tag className={`w-3.5 h-3.5 shrink-0 ${isV2 ? 'text-[#A36B42]' : 'text-amber-500'}`} />
                  <span>🎯 Addresses: {book.problemAddressedTag}</span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1 font-bold ${
                  isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20 text-[#5C554E]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <Globe className="w-3 h-3 opacity-60" />
                  <span>Language: {book.language}</span>
                </span>
                <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                  isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20 text-[#242220]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                }`}>
                  Selling Cost: ₹{book.sellingPrice || book.mrp || 0}
                </span>
                {book.mrp > 0 && (
                  <span className={`px-2.5 py-1 rounded-lg border line-through text-slate-400 ${
                    isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}>
                    MRP: ₹{book.mrp}
                  </span>
                )}
              </div>

              <p className={`text-xs mt-4 leading-relaxed ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
                {book.description}
              </p>
            </div>

            <div className={`pt-4 border-t space-y-3 ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={isV2 ? 'text-[#5C554E]' : 'text-slate-500 dark:text-slate-400'}>Available Stock:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{book.availableStock > 0 ? `${book.availableStock} copies in stock` : 'Out of stock'}</span>
                </span>
              </div>

              <button
                onClick={handleCopyRequest}
                disabled={requested}
                className={`w-full font-bold text-xs py-3 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all ${
                  isV2
                    ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-102'
                    : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                }`}
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
