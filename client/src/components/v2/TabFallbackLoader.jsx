import React from 'react';
import { BookOpen } from 'lucide-react';

export default function TabFallbackLoader({ label = 'Loading section...' }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#EFEBE2] border border-[#A36B42]/30 flex items-center justify-center text-[#A36B42] animate-pulse shadow-sm">
        <BookOpen className="w-6 h-6" />
      </div>
      <p className="font-serif-editorial text-sm font-semibold text-[#5C554E] animate-bounce">
        {label}
      </p>
    </div>
  );
}
