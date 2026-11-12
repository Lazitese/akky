import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Printer, 
  Sun, 
  Moon, 
  Coffee,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { LibraryItem } from '../../types/elibrary';

interface ELibraryReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LibraryItem | null;
}

export const ELibraryReaderModal: React.FC<ELibraryReaderModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [theme, setTheme] = useState<'day' | 'sepia' | 'night'>('day');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const totalPages = item.pageCount || 48;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#d8c29d]';
      case 'night':
        return 'bg-[#18181b] text-[#f4f4f5] border-[#3f3f46]';
      default:
        return 'bg-white text-black border-black';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black max-w-5xl w-full my-auto shadow-2xl flex flex-col h-[94vh]">
        
        {/* Top Control Bar */}
        <div className="p-3 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-300" />
            <div>
              <div className="text-[10px] font-mono text-neutral-400">
                ኢ-ላይብራሪ • {item.category} • {item.code}
              </div>
              <h2 className="font-bold text-xs sm:text-sm tracking-tight truncate max-w-xs sm:max-w-md">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2">
            
            {/* Reading Mode Theme */}
            <div className="flex items-center border border-neutral-700 bg-neutral-800 rounded-xs">
              <button
                onClick={() => setTheme('day')}
                className={`p-1.5 ${theme === 'day' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                title="የቀን ንባብ (ነጭ)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 ${theme === 'sepia' ? 'bg-[#fbf0d9] text-black' : 'text-neutral-400 hover:text-white'}`}
                title="ምቹ ንባብ (ሴፒያ)"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('night')}
                className={`p-1.5 ${theme === 'night' ? 'bg-black text-white' : 'text-neutral-400 hover:text-white'}`}
                title="የሌሊት ንባብ (ጥቁር)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center border border-neutral-700 bg-neutral-800 rounded-xs text-xs">
              <button
                onClick={() => setZoomLevel(Math.max(80, zoomLevel - 15))}
                className="p-1.5 hover:bg-neutral-700 text-neutral-200"
                title="አሳንስ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-neutral-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(160, zoomLevel + 15))}
                className="p-1.5 hover:bg-neutral-700 text-neutral-200"
                title="አሳድግ"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 border border-neutral-700 ${
                isBookmarked ? 'bg-white text-black' : 'hover:bg-neutral-800 text-neutral-300'
              }`}
              title="ምልክት አድርግ"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            {/* Download */}
            <button
              onClick={() => alert(`ሰነድ «${item.title}» በማውረድ ላይ ነው...`)}
              className="p-1.5 border border-neutral-700 hover:bg-neutral-800 text-neutral-300"
              title="ሰነድ አውርድ"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600"
              aria-label="ዝጋ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Body with Page Simulator */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-200 flex justify-center items-start">
          <div 
            className={`w-full max-w-3xl min-h-[700px] border-2 shadow-xl p-8 sm:p-12 transition-all flex flex-col justify-between ${getThemeClass()}`}
            style={{ fontSize: `${zoomLevel}%` }}
          >
            {/* Top Page Header */}
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-6 opacity-70 text-xs">
                <span className="font-bold uppercase tracking-wider">
                  ብልፅግና ፓርቲ • ዲጂታል ቤተ-መፅሀፍትና ኢ-ላይብራሪ
                </span>
                <span className="font-mono">ገፅ {currentPage}</span>
              </div>

              {/* Title on page 1 */}
              {currentPage === 1 && (
                <div className="text-center py-6 border-b mb-6">
                  <div className="inline-block px-3 py-1 border border-current text-xs font-bold uppercase tracking-wider mb-3">
                    {item.category}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    {item.title}
                  </h1>
                  <p className="text-sm opacity-80 max-w-lg mx-auto">
                    {item.authorOrPublisher} • ታትሞ የወጣበት ቀን፡ {item.publishDate}
                  </p>
                </div>
              )}

              {/* Page Content Simulator */}
              <div className="space-y-4 font-serif leading-relaxed text-justify">
                <p className="font-bold font-sans text-sm opacity-90 border-l-2 pl-3 border-current">
                  ምዕራፍ {currentPage}፦ የይዘት አጠቃላይ እይታ እና የአሰራር መመሪያዎች
                </p>

                <p>
                  {item.description} ይህ ሰነድ በብልፅግና ፓርቲ አቃቂ ቃሊቲ ክፍለ ከተማ ቅርንጫፍ ፅ/ቤት ለአመራሮችና ለአባላት አቅም ግንባታ የተዘጋጀ ይፋዊ ማጣቀሻ ነው።
                </p>

                <p>
                  የተቋቋመው የኢ-ላይብራሪ ሥርዓት ዓላማ አባሉና አመራሩ በቢሮ ውስጥም ሆነ በየትኛውም ቦታ ተንቀሳቃሽ ስልኩን ወይም ኮምፒውተሩን በመጠቀም የፓርቲውን ሰነዶች፣ ጥናቶችና መመሪያዎች በቀላሉ እንዲያገኝና ራሱን በእውቀት እንዲገነባ ማስቻል ነው።
                </p>

                <div className="p-4 border my-4 bg-black/5 rounded-xs font-sans text-xs space-y-2">
                  <div className="font-bold uppercase tracking-wider">
                    ቁልፍ የትኩረት ነጥቦች (Key Principles)፦
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>የፓርቲውን ርዕዮተ-ዓለምና መተዳደሪያ ደንብ በሚገባ መረዳትና ማስረፅ፤</li>
                    <li>በአካባቢው ህዝብ የሚነሱ የልማትና የመልካም አስተዳደር ጥያቄዎችን በሳይንሳዊ መንገድ መፍታት፤</li>
                    <li>የዲጂታል መረጃ ልውውጥን በማጠናከር ወረቀት-አልባና ፈጣን አሰራርን መተግበር።</li>
                  </ul>
                </div>

                <p>
                  በቀጣይ ገፆች ላይ የተመለከቱትን ዝርዝር አሰራሮች፣ ሰንጠረዦች እና የአፈጻጸም መለኪያዎችን በመከተል በየዘርፉና በየወረዳው ተጨባጭ ለውጥ ማምጣት የሁሉም አመራርና አባል ቀዳሚ ግዴታ ነው።
                </p>
              </div>
            </div>

            {/* Bottom Page Footer */}
            <div className="pt-6 border-t mt-8 flex items-center justify-between text-xs opacity-75">
              <span>{item.title}</span>
              <span className="font-mono font-bold">ገፅ {currentPage} ከ {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Offline Indicator Bar */}
        <div className="p-3 bg-white border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span className="font-bold">ከመስመር ውጭ ይገኛል (Offline Ready)</span>
            <span className="text-neutral-400 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-neutral-500">መጠን፡ {item.fileSize}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-black bg-white hover:bg-neutral-100 disabled:opacity-30 font-bold inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ቀዳሚ ገጽ</span>
            </button>

            <span className="font-mono font-bold px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 border border-black bg-white hover:bg-neutral-100 disabled:opacity-30 font-bold inline-flex items-center gap-1"
            >
              <span>ቀጣይ ገጽ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
