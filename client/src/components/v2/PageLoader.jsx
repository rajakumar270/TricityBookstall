import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const WISDOM_QUOTES = [
  'Clarity of Mind • Freedom of Being',
  'Books open minds. Dialogues open possibilities.',
  'Nurturing young minds with timeless character literature...',
  'Transforming lives through higher wisdom in Tricity...',
  'Connecting students with self-reflection & purpose...',
];

export default function PageLoader({ onFinish, minDuration = 800 }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Quote rotation
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
    }, 1800);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 18) + 10;
      });
    }, 120);

    // Complete loading
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 400);
      }, 200);
    }, minDuration);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F4EE] text-[#242220] transition-opacity duration-400 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(163, 107, 66, 0.08) 0%, transparent 70%)',
      }}
    >
      <div className="flex flex-col items-center max-w-md px-6 text-center space-y-6">
        
        {/* Animated Golden Book Icon with Glow */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-[#A36B42]/15 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-[#EFEBE2] border-2 border-[#A36B42]/30 flex items-center justify-center text-[#A36B42] shadow-xl animate-bounce">
            <BookOpen className="w-10 h-10 animate-spin-slow" />
          </div>
          <div className="absolute -top-1 -right-1 text-amber-500 animate-ping">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#242220]">
            Ekatva Foundation
          </h2>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#A36B42]">
            Tricity Wisdom Literature Movement
          </p>
        </div>

        {/* Rotating Wisdom Quote */}
        <div className="h-12 flex items-center justify-center">
          <p className="font-serif-editorial italic text-sm sm:text-base text-[#5C554E] transition-all duration-300 animate-fadeIn">
            “{WISDOM_QUOTES[quoteIndex]}”
          </p>
        </div>

        {/* Smooth Delicate Progress Bar */}
        <div className="w-64 max-w-full space-y-1.5 pt-2">
          <div className="h-1.5 w-full bg-[#E5DFD3] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#A36B42] to-amber-600 rounded-full transition-all duration-200 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[#8C7A6B]">
            <span>Opening Wisdom Pages...</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
