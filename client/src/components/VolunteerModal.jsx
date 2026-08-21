import React, { useState } from 'react';
import { X, Heart, CheckCircle2, User, Phone, Mail, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VolunteerModal({ isOpen, onClose, siteVersion = 'v2' }) {
  const [volunteer, setVolunteer] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    city: 'Chandigarh',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isV2 = siteVersion === 'v2';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
        isV2 
          ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className={`p-6 relative ${
          isV2
            ? 'bg-[#242220] text-white border-b border-[#A36B42]/30'
            : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isV2 ? 'bg-[#A36B42]/20 text-[#A36B42]' : 'bg-white/20 text-white'
          }`}>
            <Heart className="w-3.5 h-3.5" />
            <span>Join the Movement</span>
          </div>

          <h3 className={`text-2xl ${isV2 ? 'font-serif-editorial font-bold text-[#F7F4EE]' : 'font-extrabold'}`}>
            Become a Youth Volunteer
          </h3>
          <p className={`text-xs mt-1 ${isV2 ? 'text-[#D4C9BC]' : 'text-amber-100'}`}>
            Help organize bookstalls, engage with students, and spread wisdom in Tricity.
          </p>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className={`text-xl font-bold ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>Welcome to the Team!</h4>
              <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-300'}`}>
                Thank you <strong className={isV2 ? 'text-[#A36B42]' : 'text-amber-400'}>{volunteer.name}</strong>. Our volunteer lead will add you to the Tricity Youth Volunteer WhatsApp circle.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className={`mt-2 font-bold text-xs px-6 py-2.5 rounded-full ${
                  isV2 ? 'bg-[#242220] text-white hover:bg-[#3D3834]' : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    required
                    value={volunteer.name}
                    onChange={(e) => setVolunteer({ ...volunteer, name: e.target.value })}
                    placeholder="Full Name"
                    className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="tel"
                      required
                      value={volunteer.phone}
                      onChange={(e) => setVolunteer({ ...volunteer, phone: e.target.value })}
                      placeholder="+91 98765..."
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="email"
                      value={volunteer.email}
                      onChange={(e) => setVolunteer({ ...volunteer, email: e.target.value })}
                      placeholder="email@domain.com"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                  College / School / Profession
                </label>
                <div className="relative">
                  <GraduationCap className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={volunteer.college}
                    onChange={(e) => setVolunteer({ ...volunteer, college: e.target.value })}
                    placeholder="e.g. Panjab University / CGC Mohali"
                    className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                  City Location
                </label>
                <select
                  value={volunteer.city}
                  onChange={(e) => setVolunteer({ ...volunteer, city: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                    isV2 
                      ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] focus:border-[#A36B42]'
                      : 'bg-slate-950 border border-slate-700 text-white focus:border-amber-500'
                  }`}
                >
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Panchkula">Panchkula</option>
                  <option value="Other">Nearby Area</option>
                </select>
              </div>

              <button
                type="submit"
                className={`w-full font-bold text-xs py-3.5 rounded-full shadow-md mt-2 transition-all ${
                  isV2
                    ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-102'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg'
                }`}
              >
                Join as Volunteer 🌟
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
