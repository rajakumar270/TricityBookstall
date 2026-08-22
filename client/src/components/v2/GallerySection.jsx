import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight, Maximize2, Tag } from 'lucide-react';
import { fetchGalleryApi } from '../../services/api';

const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 'g1',
    image_url: '/assets/cgc1.jpg',
    caption: 'CGC Landran Bookstall Setup & Student Inquiries',
    category: 'Campus',
  },
  {
    id: 'g2',
    image_url: '/assets/cgc2.jpg',
    caption: 'Engaging Parents & Faculty at CGC Landran PTM',
    category: 'PTM',
  },
  {
    id: 'g3',
    image_url: '/assets/cu1.jpg',
    caption: 'Youth Mental Clarity Dialogue at Chandigarh University',
    category: 'Campus',
  },
  {
    id: 'g4',
    image_url: '/assets/cgc1.jpg',
    caption: 'Vedanta & Character Building Books Display',
    category: 'Stalls',
  },
  {
    id: 'g5',
    image_url: '/assets/cgc2.jpg',
    caption: 'Student Reading Circle & Self-Reflection Discussions',
    category: 'Dialogue',
  },
  {
    id: 'g6',
    image_url: '/assets/cu1.jpg',
    caption: 'Community Volunteers Sharing Higher Wisdom Literature',
    category: 'Community',
  },
];

export default function GallerySection({ onHostStall, siteVersion = 'v2' }) {
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const isV2 = siteVersion === 'v2';

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await fetchGalleryApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setPhotos(data);
      } else {
        setPhotos(DEFAULT_GALLERY_PHOTOS);
      }
    } catch (e) {
      setPhotos(DEFAULT_GALLERY_PHOTOS);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Campus', 'PTM', 'Stalls', 'Dialogue', 'Community'];

  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === 'All') return true;
    const pCat = (photo.category || '').toLowerCase().trim();
    const sCat = selectedCategory.toLowerCase().trim();
    if (pCat === sCat) return true;
    if (sCat === 'campus' && (pCat.includes('campus') || pCat.includes('university') || pCat.includes('college'))) return true;
    if (sCat === 'ptm' && (pCat.includes('ptm') || pCat.includes('school'))) return true;
    if (sCat === 'stalls' && (pCat.includes('stall') || pCat.includes('fair') || pCat.includes('book'))) return true;
    if (sCat === 'dialogue' && (pCat.includes('dialogue') || pCat.includes('discussion') || pCat.includes('reading'))) return true;
    if (sCat === 'community' && (pCat.includes('community') || pCat.includes('volunteer') || pCat.includes('public'))) return true;
    return pCat.includes(sCat) || sCat.includes(pCat);
  });

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="gallery" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
          isV2
            ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#A36B42]'
            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600'
        }`}>
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Visual Journey & Glimpses</span>
        </div>
        
        <h2 className={`text-3xl sm:text-5xl tracking-tight ${isV2 ? 'font-serif-editorial text-[#242220]' : 'font-extrabold text-slate-900 dark:text-white'}`}>
          Photo <span className={isV2 ? 'text-[#A36B42] italic font-semibold' : 'bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'}>Gallery</span>
        </h2>
        
        <p className={`text-sm sm:text-base ${isV2 ? 'text-[#5C554E]' : 'text-slate-600 dark:text-slate-300'}`}>
          Explore vibrant moments from our wisdom stalls, campus book exhibitions, student discussions, and community outreach.
        </p>
      </div>

      {/* Category Pills */}
      <div className="mt-8 flex justify-center">
        <div className={`inline-flex p-1.5 rounded-2xl border shadow-sm max-w-full overflow-x-auto ${
          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
        }`}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isV2 
                      ? 'bg-[#242220] text-white shadow-md'
                      : 'bg-emerald-600 text-white shadow-md'
                    : isV2 ? 'text-[#5C554E] hover:text-[#242220]' : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-400">Loading gallery moments...</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="py-20 text-center text-sm font-bold text-slate-400">No photos in this category yet.</div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#242220] aspect-4/3 border border-[#A36B42]/20"
            >
              <img
                src={photo.image_url}
                alt={photo.caption || 'Ekatva Foundation Event'}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => { e.target.src = '/assets/cgc1.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-3.5 left-3.5">
                <span className="bg-[#242220]/80 backdrop-blur-md border border-[#A36B42]/40 text-[#F7F4EE] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Tag className="w-2.5 h-2.5 text-[#A36B42]" />
                  <span>{photo.category || 'Event'}</span>
                </span>
              </div>

              {/* Bottom Caption & Zoom Icon */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between">
                <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 pr-2">
                  {photo.caption || 'Ekatva Bookstall Moment'}
                </p>
                <div className="w-8 h-8 rounded-full bg-[#A36B42] text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image & Caption */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].image_url}
              alt={filteredPhotos[lightboxIndex].caption || 'Gallery photo'}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-[#A36B42]/40"
            />
            <div className="mt-4 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-[#A36B42] mr-2">
                [{filteredPhotos[lightboxIndex].category || 'Moments'}]
              </span>
              <span className="text-sm font-semibold text-white">
                {filteredPhotos[lightboxIndex].caption || ''}
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                Photo {lightboxIndex + 1} of {filteredPhotos.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
