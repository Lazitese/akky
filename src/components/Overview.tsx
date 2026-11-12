import React from 'react';
import { 
  FolderArchive, 
  FileCheck2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Plus, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { DocumentItem } from '../types/dms';

interface OverviewProps {
  documents: DocumentItem[];
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenVerifier: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  documents,
  setActiveTab,
  onOpenUpload,
  onOpenVerifier,
}) => {
  const totalDocs = documents.length;
  const approvedDocs = documents.filter((d) => d.status === 'የጸደቀ').length;
  const pendingDocs = documents.filter((d) => d.status === 'በግምገማ ላይ').length;
  const revisionDocs = documents.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length;

  return (
    <div className="space-y-4">
      {/* Official Welcome Notice */}
      <div className="border-2 border-black bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3 mb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
              የአቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ቅ/ፅ/ቤት
            </span>
            <h1 className="text-lg font-bold text-black tracking-tight">
              የዲጂታል ሰነድና ፋይል ማህደር ማጠቃለያ
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVerifier}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-black hover:bg-neutral-100"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR አረጋግጥ</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-black text-white hover:bg-neutral-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ሰነድ አስገባ</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl">
          የወረቀት ፋይሎችን በማስቀረት በክፍለ ከተማው 5 ዘርፎች እና በ14ቱ ወረዳዎች የሚገኙ ሰነዶችን በዲጂታል ፋይል ቦክስ ማደራጀት፣ በQR ኮድ መከታተል እና ፈጣን ግብረ-መልስ መስጠት።
        </p>
      </div>

      {/* 4 Stat Cards in Black and White */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Boxes */}
        <div 
          onClick={() => setActiveTab('boxes')}
          className="border-2 border-black bg-white p-3 cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-1">
            <span className="text-[11px] font-bold">ፋይል ቦክሶች</span>
            <FolderArchive className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-bold font-mono text-black">19</div>
          <div className="text-[10px] text-neutral-500 mt-1">5 ክ/ከተማ + 14 ወረዳዎች</div>
        </div>

        {/* Total Documents */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="border-2 border-black bg-white p-3 cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-1">
            <span className="text-[11px] font-bold">ጠቅላላ ሰነዶች</span>
            <ShieldCheck className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-bold font-mono text-black">{totalDocs}</div>
          <div className="text-[10px] text-neutral-500 mt-1">በQR የተመዘገቡ</div>
        </div>

        {/* Approved */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="border-2 border-black bg-white p-3 cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-1">
            <span className="text-[11px] font-bold">የጸደቁ</span>
            <FileCheck2 className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-bold font-mono text-black">{approvedDocs}</div>
          <div className="text-[10px] text-neutral-500 mt-1">ተረጋግጠው ያለቁ</div>
        </div>

        {/* Revisions Needed */}
        <div 
          onClick={() => setActiveTab('feedbacks')}
          className="border-2 border-black bg-white p-3 cursor-pointer hover:bg-neutral-50 transition-colors relative"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-1">
            <span className="text-[11px] font-bold">ማሻሻያ የሚሹ</span>
            <AlertCircle className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-bold font-mono text-black">{revisionDocs}</div>
          <div className="text-[10px] text-neutral-500 mt-1">አፋጣኝ መልስ የሚሹ</div>
          {revisionDocs > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full animate-ping"></span>
          )}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Box Navigation Quick Link */}
        <div 
          onClick={() => setActiveTab('boxes')}
          className="border-2 border-black bg-white p-4 flex items-center justify-between hover:bg-neutral-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-black">የቢሮ ፋይል ቦክስ ማህደር ክፈት</h3>
              <p className="text-[11px] text-neutral-600">
                የክፍለ ከተማው 5 ዘርፎች እና የ14 ወረዳዎች ዲጂታል ካቢኔቶች
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-black" />
        </div>

        {/* Feedback Queue Quick Link */}
        <div 
          onClick={() => setActiveTab('feedbacks')}
          className="border-2 border-black bg-white p-4 flex items-center justify-between hover:bg-neutral-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-black">የሰነድ ግብረ-መልስ እና ማሻሻያ</h3>
              <p className="text-[11px] text-neutral-600">
                {revisionDocs > 0 ? `${revisionDocs} ሰነድ ማሻሻያ ተጠይቆበታል` : 'ሁሉም ሰነዶች ተገምግመዋል'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-black" />
        </div>
      </div>
    </div>
  );
};
