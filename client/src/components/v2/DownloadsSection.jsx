import React, { useState } from 'react';
import { BookOpen, FileText, Download, Eye, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DownloadsSection({ onOpenViewer, siteSettings }) {
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const downloadsConfig = siteSettings?.downloadsConfig || {
    showCatalogueButton: true,
    showBrochureButton: true,
    showDirectDownload: true,
    catalogueUrl: '/assets/docs/ekatva_book_catalogue.pdf',
    brochureUrl: '/assets/docs/ekatva_campus_brochure.pdf',
    catalogueTitle: 'Ekatva Book Catalogue 2026',
    brochureTitle: 'Campus Bookstall Brochure',
  };

  const showCatalogue = downloadsConfig.showCatalogueButton !== false;
  const showBrochure = downloadsConfig.showBrochureButton !== false;
  const showDownloadBtn = downloadsConfig.showDirectDownload !== false;

  if (!showCatalogue && !showBrochure) return null;

  const handleDirectDownload = (docType, url, filename) => {
    setDownloadingDoc(docType);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingDoc(null);
    }, 2500);
  };

  return (
    <section className="bg-[#EFEBE2]/80 border-y border-[#A36B42]/15 py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background embellishments */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#A36B42]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F7F4EE] border border-[#A36B42]/30 text-[#A36B42] text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Publications & Resources</span>
          </div>

          <h2 className="font-serif-editorial text-2xl sm:text-4xl text-[#242220] font-bold">
            Explore Literature & Campus Guidelines
          </h2>

          <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            Read online directly within the website or download PDF copies of our complete book collection and campus bookstall information.
          </p>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Book Catalogue */}
          {showCatalogue && (
            <div className="bg-[#F7F4EE] rounded-2xl p-6 sm:p-8 border border-[#A36B42]/25 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group">
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#242220] text-amber-300 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFEBE2] text-[#A36B42] px-3 py-1 rounded-full border border-[#A36B42]/20">
                    14 Pages • Complete Catalog
                  </span>
                </div>

                <h3 className="font-serif-editorial font-bold text-xl sm:text-2xl text-[#242220] mb-2 group-hover:text-[#A36B42] transition-colors">
                  {downloadsConfig.catalogueTitle || 'Ekatva Book Catalogue 2026'}
                </h3>

                <p className="text-xs text-[#5C554E] leading-relaxed mb-6">
                  Browse our complete curated collection of wisdom, philosophy, Gita, Upanishads, youth clarity, and kids character-building books with MRP details.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-[#A36B42]/15">
                <button
                  onClick={() => onOpenViewer('catalogue')}
                  className="flex-1 bg-[#242220] hover:bg-[#3D3834] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>Open in Website</span>
                </button>

                {showDownloadBtn && (
                  <button
                    onClick={() => handleDirectDownload('catalogue', downloadsConfig.catalogueUrl || '/assets/docs/ekatva_book_catalogue.pdf', 'Ekatva_Book_Catalogue.pdf')}
                    className={`px-4 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all border cursor-pointer ${
                      downloadingDoc === 'catalogue'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[#EFEBE2] hover:bg-[#E5DFD3] text-[#242220] border-[#A36B42]/30 hover:border-[#A36B42]'
                    }`}
                    title="Download Catalogue PDF"
                  >
                    {downloadingDoc === 'catalogue' ? (
                      <CheckCircle2 className="w-4 h-4 animate-bounce text-white" />
                    ) : (
                      <Download className="w-4 h-4 text-[#A36B42]" />
                    )}
                    <span className="hidden sm:inline">
                      {downloadingDoc === 'catalogue' ? 'Downloaded' : 'Download'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Card 2: Campus Brochure */}
          {showBrochure && (
            <div className="bg-[#F7F4EE] rounded-2xl p-6 sm:p-8 border border-[#A36B42]/25 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group">
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#A36B42] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFEBE2] text-[#A36B42] px-3 py-1 rounded-full border border-[#A36B42]/20">
                    Campus & PTM Guide
                  </span>
                </div>

                <h3 className="font-serif-editorial font-bold text-xl sm:text-2xl text-[#242220] mb-2 group-hover:text-[#A36B42] transition-colors">
                  {downloadsConfig.brochureTitle || 'Campus Bookstall Brochure'}
                </h3>

                <p className="text-xs text-[#5C554E] leading-relaxed mb-6">
                  Learn how schools, colleges, and institutions host Ekatva literature bookstalls, what students gain, and our campus collaboration framework.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-[#A36B42]/15">
                <button
                  onClick={() => onOpenViewer('brochure')}
                  className="flex-1 bg-[#242220] hover:bg-[#3D3834] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>Open in Website</span>
                </button>

                {showDownloadBtn && (
                  <button
                    onClick={() => handleDirectDownload('brochure', downloadsConfig.brochureUrl || '/assets/docs/ekatva_campus_brochure.pdf', 'Ekatva_Campus_Brochure.pdf')}
                    className={`px-4 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all border cursor-pointer ${
                      downloadingDoc === 'brochure'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[#EFEBE2] hover:bg-[#E5DFD3] text-[#242220] border-[#A36B42]/30 hover:border-[#A36B42]'
                    }`}
                    title="Download Brochure PDF"
                  >
                    {downloadingDoc === 'brochure' ? (
                      <CheckCircle2 className="w-4 h-4 animate-bounce text-white" />
                    ) : (
                      <Download className="w-4 h-4 text-[#A36B42]" />
                    )}
                    <span className="hidden sm:inline">
                      {downloadingDoc === 'brochure' ? 'Downloaded' : 'Download'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
