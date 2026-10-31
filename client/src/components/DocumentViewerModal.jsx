import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function DocumentViewerModal({
  isOpen,
  onClose,
  initialDoc = 'catalogue', // 'catalogue' | 'brochure'
  siteSettings,
}) {
  const [activeDoc, setActiveDoc] = useState(initialDoc);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const downloadsConfig = siteSettings?.downloadsConfig || {
    showCatalogueButton: true,
    showBrochureButton: true,
    showDirectDownload: true,
    catalogueUrl: '/assets/docs/ekatva_book_catalogue.pdf',
    brochureUrl: '/assets/docs/ekatva_campus_brochure.pdf',
    catalogueTitle: 'Ekatva Book Catalogue 2026',
    brochureTitle: 'Campus Bookstall Brochure',
  };

  const isCatalogue = activeDoc === 'catalogue';
  const currentTitle = isCatalogue 
    ? (downloadsConfig.catalogueTitle || 'Ekatva Book Catalogue 2026')
    : (downloadsConfig.brochureTitle || 'Campus Bookstall Brochure');

  const currentUrl = isCatalogue 
    ? (downloadsConfig.catalogueUrl || '/assets/docs/ekatva_book_catalogue.pdf')
    : (downloadsConfig.brochureUrl || '/assets/docs/ekatva_campus_brochure.pdf');

  const showDownloadBtn = downloadsConfig.showDirectDownload !== false;

  const handleDownload = (e) => {
    if (e) e.stopPropagation();
    
    // Trigger direct file download parallel with keeping viewer open
    const link = document.createElement('a');
    link.href = currentUrl;
    link.download = isCatalogue ? 'Ekatva_Book_Catalogue.pdf' : 'Ekatva_Campus_Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn">
      
      {/* Container Card */}
      <div 
        className={`bg-[#F7F4EE] text-[#242220] rounded-2xl shadow-2xl flex flex-col w-full overflow-hidden transition-all border border-[#A36B42]/30 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl h-[92vh]'
        }`}
      >
        
        {/* Top Header Toolbar - Mobile Friendly Flex Wrap */}
        <div className="bg-[#242220] text-white px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#A36B42]/30 shrink-0">
          
          {/* Left: Branding & Document Title */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#A36B42] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
              {isCatalogue ? <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif-editorial font-bold text-sm sm:text-lg text-white leading-tight truncate max-w-[160px] sm:max-w-xs">
                {currentTitle}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-amber-200/80 font-mono truncate">
                Interactive Document Reader
              </p>
            </div>
          </div>

          {/* Center: Document Switcher Tabs */}
          <div className="flex items-center bg-[#181716] p-1 rounded-full border border-white/10 text-[11px] sm:text-xs">
            {downloadsConfig.showCatalogueButton !== false && (
              <button
                onClick={() => { setActiveDoc('catalogue'); setZoomLevel(100); }}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer min-h-[36px] ${
                  isCatalogue ? 'bg-[#A36B42] text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Catalogue</span>
              </button>
            )}

            {downloadsConfig.showBrochureButton !== false && (
              <button
                onClick={() => { setActiveDoc('brochure'); setZoomLevel(100); }}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer min-h-[36px] ${
                  !isCatalogue ? 'bg-[#A36B42] text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Brochure</span>
              </button>
            )}
          </div>

          {/* Right: Controls & Parallel Download Button */}
          <div className="flex items-center space-x-1.5 ml-auto sm:ml-0">
            
            {/* Zoom Controls (Hidden on small mobile screens to save space) */}
            <div className="hidden md:flex items-center bg-[#181716] rounded-lg p-0.5 border border-white/10 text-xs text-gray-300">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] min-w-[40px] text-center font-bold">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 100 && (
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer text-amber-300"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Parallel Download CTA */}
            {showDownloadBtn && (
              <button
                onClick={handleDownload}
                className={`px-3 sm:px-4 py-2 rounded-full font-extrabold text-xs flex items-center space-x-1 sm:space-x-1.5 transition-all shadow-md cursor-pointer min-h-[36px] ${
                  downloadSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105'
                }`}
                title="Download PDF file while reading online"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">Download</span>
                  </>
                )}
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors hidden md:block cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-red-600/80 transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Close Document Reader"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Mobile Viewport Hint Bar */}
        <div className="bg-[#181716] text-amber-300 px-3 py-1.5 text-[11px] font-semibold flex items-center justify-between border-b border-white/10 sm:hidden">
          <div className="flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Mobile Viewer Active</span>
          </div>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-white bg-[#A36B42] hover:bg-[#8B5833] px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1"
          >
            <span>Full Screen Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Document Viewer Canvas / Iframe */}
        <div className="flex-1 bg-[#EFEBE2] overflow-auto relative flex justify-center p-1 sm:p-4">
          <div 
            className="w-full h-full max-w-5xl bg-white rounded-xl shadow-lg border border-[#A36B42]/20 overflow-hidden transition-transform duration-200 origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* High Performance Embedded PDF Reader */}
            <iframe
              src={`${currentUrl}#toolbar=1&navpanes=0&view=FitH`}
              title={currentTitle}
              className="w-full h-full border-none min-h-[400px] sm:min-h-[500px]"
            />
          </div>
        </div>

        {/* Bottom Bar: Quick Info & External Link */}
        <div className="bg-[#E5DFD3] border-t border-[#A36B42]/20 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-[#5C554E] gap-2 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-[#A36B42] shrink-0" />
            <span className="font-semibold text-[#242220] truncate">
              Viewing {isCatalogue ? 'Catalogue' : 'Brochure'} online.
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#A36B42] hover:text-[#242220] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>

            {showDownloadBtn && (
              <button
                onClick={handleDownload}
                className="text-[#242220] hover:text-[#A36B42] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Save Copy</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
