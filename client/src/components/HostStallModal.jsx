import React, { useState } from 'react';
import { X, BookOpen, Send, CheckCircle2, Sparkles, Building2, MapPin, Phone, Mail, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitBooking } from '../services/api';

export default function HostStallModal({ isOpen, onClose, siteVersion = 'v2' }) {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'College',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    city: 'Chandigarh',
    eventLocation: '',
    preferredDate: '',
    estimatedFootfall: '500-1000 Students',
    additionalNotes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isV2 = siteVersion === 'v2';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitBooking(formData);
      setLoading(false);
      setSubmitted(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        isV2 
          ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' 
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className={`p-6 sm:p-8 relative ${
          isV2
            ? 'bg-[#242220] text-white border-b border-[#A36B42]/30'
            : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isV2 ? 'bg-[#A36B42]/20 text-[#A36B42]' : 'bg-white/20 text-white'
          }`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Institutional Bookstall Request</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isV2 ? 'font-serif-editorial text-[#F7F4EE]' : 'font-extrabold'}`}>
            Invite Ekatva Foundation Bookstall to Your Campus
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${isV2 ? 'text-[#D4C9BC]' : 'text-orange-100'}`}>
            Free setup for schools, colleges, and youth events across Chandigarh, Mohali, and Panchkula.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className={`text-2xl font-bold ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>Invitation Received!</h4>
              <p className={`text-sm max-w-md mx-auto ${isV2 ? 'text-[#5C554E]' : 'text-slate-300'}`}>
                Thank you for inviting Ekatva Foundation Bookstall. Our volunteer coordinator will reach out to <strong className={isV2 ? 'text-[#A36B42]' : 'text-orange-400'}>{formData.email}</strong> within 24 hours to confirm setup details.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className={`mt-4 font-bold px-6 py-2.5 rounded-full shadow-md ${
                  isV2 ? 'bg-[#242220] text-white hover:bg-[#3D3834]' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Institution / Event Name *
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      required
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      placeholder="e.g. Panjab University / Doon Public School"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Institution Type
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white focus:border-orange-500'
                    }`}
                  >
                    <option value="College">College / Degree College</option>
                    <option value="University">University Campus</option>
                    <option value="School">School (Senior Secondary / Middle)</option>
                    <option value="Public Event">Public Exhibition / Book Fair</option>
                    <option value="Other">Other Community Space</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Contact Person Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Your Full Name"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Teacher / Event Coordinator"
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@institution.edu"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isV2 ? 'text-[#8C847B]' : 'text-slate-400'}`} />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                        isV2 
                          ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                          : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    City Location
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white focus:border-orange-500'
                    }`}
                  >
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Mohali">Mohali</option>
                    <option value="Panchkula">Panchkula</option>
                    <option value="Other">Nearby Tricity Area</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white focus:border-orange-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                    Est. Student Footfall
                  </label>
                  <select
                    value={formData.estimatedFootfall}
                    onChange={(e) => setFormData({ ...formData, estimatedFootfall: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white focus:border-orange-500'
                    }`}
                  >
                    <option value="100-500 Students">100 - 500 Students</option>
                    <option value="500-1000 Students">500 - 1,000 Students</option>
                    <option value="1000-3000 Students">1,000 - 3,000 Students</option>
                    <option value="3000+ Students">3,000+ Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>
                  Specific Requests / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="e.g. Requesting Kids Wisdom literature for PTM / College Fest stall space available..."
                  className={`w-full rounded-xl p-3 text-xs outline-none resize-none transition-all ${
                    isV2 
                      ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                      : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-bold text-xs py-3.5 rounded-full shadow-md flex items-center justify-center space-x-2 transition-all ${
                    isV2
                      ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-102'
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Request...' : 'Submit Bookstall Invitation'}</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
