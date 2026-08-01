import React from 'react';
import { BookOpen, MapPin, Mail, Phone, Heart, Instagram, Facebook } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenHostModal, onOpenVolunteerModal }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 p-0.5">
                <img src="/assets/cropped-IMG-20260203-WA0031.jpg" alt="Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <span className="font-extrabold text-xl text-white">Prabodhanam</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A volunteer initiative bringing philosophical literature, kids wisdom, and reflective dialogue to schools, colleges, and communities across Chandigarh, Mohali, and Panchkula.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Home Page</button></li>
              <li><button onClick={() => setActiveTab('kids')} className="hover:text-pink-400 font-bold transition-colors">Kids Wisdom Corner 🎈</button></li>
              <li><button onClick={() => setActiveTab('books')} className="hover:text-white transition-colors">Book Catalog</button></li>
              <li><button onClick={() => setActiveTab('events')} className="hover:text-white transition-colors">Campus Events</button></li>
            </ul>
          </div>

          {/* Col 3: Get Involved */}
          <div>
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-4">Get Involved</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={onOpenHostModal} className="hover:text-amber-400 font-bold transition-colors">Invite Bookstall to School/College</button></li>
              <li><button onClick={onOpenVolunteerModal} className="hover:text-amber-400 font-bold transition-colors">Join as Youth Volunteer</button></li>
              <li><span className="text-slate-400">Tricity Outreach Team</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-4">Contact Tricity Stall</h4>
            <p className="text-xs text-slate-300 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>prabodhanambookstall@gmail.com</span>
            </p>
            <p className="text-xs text-slate-300 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-orange-400" />
              <span>+91 80544 48521</span>
            </p>
            <p className="text-xs text-slate-300 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Chandigarh • Mohali • Panchkula</span>
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Tricity Bookstall (Prabodhanam). Nurturing Clarity & Character.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Tricity Youth</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
