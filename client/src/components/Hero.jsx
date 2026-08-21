import React from 'react';
import { BookOpen, Sparkles, MapPin, Users, HeartHandshake, CheckCircle2, ArrowRight, Award } from 'lucide-react';

export default function Hero({ onExploreBooks, onHostStall }) {
  const stats = [
    { label: 'Books Distributed', value: '5,000+', icon: BookOpen, color: 'from-orange-500 to-amber-500' },
    { label: 'Campus Events Conducted', value: '25+', icon: MapPin, color: 'from-amber-500 to-yellow-500' },
    { label: 'Students & Youth Engaged', value: '10,000+', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Dedicated Volunteers', value: '50+', icon: HeartHandshake, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 border border-orange-500/30 rounded-full px-4 py-1.5 shadow-xl shadow-orange-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span className="text-xs font-bold tracking-wide uppercase text-orange-600 dark:text-orange-300">
              A Volunteer Youth Initiative for Tricity Educational Institutions
            </span>
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Nurturing <span className="gradient-text-saffron">Clarity & Character</span> Through Timeless Wisdom
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
            We bring curated philosophical books, value education, kids wisdom, and reflective dialogue directly to schools, colleges, and public spaces across <strong className="text-orange-600 dark:text-orange-400">Chandigarh, Mohali, and Panchkula</strong>.
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onExploreBooks}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all text-sm"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Book Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onHostStall}
              className="flex items-center space-x-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700 px-6 py-3.5 rounded-2xl transition-all text-sm shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Invite to Your Campus</span>
            </button>
          </div>
        </div>

        {/* Live Impact Statistics Counters */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl text-center relative group overflow-hidden"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} p-2.5 text-slate-950 shadow-md mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Campus Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Recent Institutional Bookstalls Hosted At
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {[
              'Panjab University, Sector 14',
              'CGC University, Mohali',
              'Doon Public School, Sector 21',
              'Indradhanush Auditorium, Sector 5'
            ].map((institution, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{institution}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
