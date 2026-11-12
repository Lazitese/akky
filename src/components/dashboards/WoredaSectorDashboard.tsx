import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  QrCode, 
  Upload, 
  RefreshCw, 
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Folder
} from 'lucide-react';
import { DocumentItem, DocumentCategory } from '../../types/dms';
import { User } from '../../types/auth';

interface WoredaSectorDashboardProps {
  currentUser: User;
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onOpenFeedback: (doc: DocumentItem) => void;
  onReuploadRevised: (doc: DocumentItem) => void;
}

export const WoredaSectorDashboard: React.FC<WoredaSectorDashboardProps> = ({
  currentUser,
  documents,
  onOpenUpload,
  onOpenQR,
  onOpenFeedback,
  onReuploadRevised,
}) => {
  const woredaName = currentUser.woredaName || 'ወረዳ 04';
  const woredaId = currentUser.woredaId || 'wor-04';
  const sectorName = currentUser.sectorName || 'የፖለቲካ ዘርፍ';

  // Navigation state inside dashboard
  const [currentView, setCurrentView] = useState<'home' | 'revisions' | 'folders' | 'submissions' | 'circulars'>('home');

  // STRICT FILTER: Documents belonging ONLY to THIS woreda AND THIS sector
  const mySectorDocs = documents.filter(
    (d) => d.woredaId === woredaId && d.sector === sectorName
  );

  const subcityCirculars = documents.filter(
    (d) => d.level === 'ክፍለ ከተማ' && d.sector === sectorName && d.category === 'ሰርኩላር'
  );

  const approvedDocs = mySectorDocs.filter((d) => d.status === 'የጸደቀ').length;
  const inReviewDocs = mySectorDocs.filter((d) => d.status === 'በግምገማ ላይ').length;
  const revisionDocs = mySectorDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት');

  const categories: DocumentCategory[] = ['ዕቅድ', 'ሪፖርት', 'ደብዳቤ', 'ሰርኩላር', 'ሌሎች'];

  return (
    <div className="space-y-4">
      {/* --- TOP BAR --- */}
      <div className="border-2 border-black bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {currentView !== 'home' && (
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
              title="ወደ ዋናው ተመለስ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase">
                የወረዳ ዘርፍ ኃላፊ
              </span>
              <span className="text-xs text-neutral-500 font-bold">{currentUser.name}</span>
            </div>
            <h1 className="text-base font-bold text-black mt-0.5">
              {currentView === 'home' && `${woredaName} • ${sectorName} የስራ ዴስክ`}
              {currentView === 'revisions' && 'አስቸኳይ ማሻሻያ የሚሹ ሰነዶች'}
              {currentView === 'folders' && 'የዘርፉ 5ቱ ይፋዊ አቃፊዎች'}
              {currentView === 'submissions' && 'ያቀረብኳቸው ሰነዶች መዝገብ'}
              {currentView === 'circulars' && 'ከክ/ከተማ የተላኩልኝ መመሪያዎች'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentView !== 'home' && (
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold px-3 py-1.5 border border-black hover:bg-neutral-100"
            >
              ← ተመለስ
            </button>
          )}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800"
          >
            <Upload className="w-4 h-4" />
            <span>ሰነድ ወደ ክ/ከተማ ላክ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HOME VIEW: Big, Spacious Action Tiles                                  */}
      {/* ========================================================================= */}
      {currentView === 'home' && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 font-medium">
            ለመመልከት የሚፈልጉትን ክፍል ይጫኑ፦
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Urgent Revisions */}
            <div
              onClick={() => setCurrentView('revisions')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 border border-black ${
                    revisionDocs.length > 0 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {revisionDocs.length} ማሻሻያዎች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">አስቸኳይ ማሻሻያ የሚሹ ሰነዶች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  ከክፍለ ከተማው {sectorName} ማስተካከያ ተጠይቆባቸው የተመለሱ ሰነዶችን አርመው መልሰው ይጫኑ
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ማሻሻያዎችን እይ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 2: 5 Subfolders */}
            <div
              onClick={() => setCurrentView('folders')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Folder className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  5 አቃፊዎች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">የዘርፌ 5ቱ ንዑስ አቃፊዎች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  ዕቅድ፣ ሪፖርት፣ ሰርኩላር፣ ደብዳቤ እና ሌሎች ፋይሎች ማህደር
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>አቃፊዎችን ክፈት</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 3: My Submissions */}
            <div
              onClick={() => setCurrentView('submissions')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  {mySectorDocs.length} ሰነዶች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ያቀረብኳቸው ሰነዶች መዝገብ</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የጸደቁ ({approvedDocs})፣ በግምገማ ላይ ያሉ ({inReviewDocs}) ሰነዶች ታሪክና QR ማረጋገጫ
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ሰነዶችን እይ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 4: Directives Received */}
            <div
              onClick={() => setCurrentView('circulars')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  {subcityCirculars.length} መመሪያዎች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ከክ/ከተማ የተላኩልኝ መመሪያዎች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  ከክፍለ ከተማው {sectorName} ለስራ አፈጻጸም የተላኩ ይፋዊ ሰርኩላሮች
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>መመሪያዎችን አንብብ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REVISIONS VIEW: Urgent Re-upload Actions                                */}
      {/* ========================================================================= */}
      {currentView === 'revisions' && (
        <div className="space-y-3">
          {revisionDocs.length === 0 ? (
            <div className="border-2 border-black bg-white p-8 text-center text-neutral-500 text-xs">
              ምንም ማሻሻያ የተጠየቀበት ሰነድ የለም። ሁሉም ሰነዶችዎ ተቀባይነት አግኝተዋል!
            </div>
          ) : (
            <div className="space-y-3">
              {revisionDocs.map((doc) => {
                const latestFeedback = doc.feedbacks[doc.feedbacks.length - 1];
                return (
                  <div key={doc.id} className="border-2 border-black bg-neutral-50 p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-sm text-black">
                        {doc.title} ({doc.code})
                      </span>
                      <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold self-start sm:self-auto">
                        ማሻሻያ ይጠይቃል
                      </span>
                    </div>

                    {latestFeedback && (
                      <div className="bg-white border border-neutral-300 p-3 text-xs space-y-1">
                        <div className="text-[11px] font-bold text-black">
                          የክፍለ ከተማው ገምጋሚ አስተያየት ({latestFeedback.author})፦
                        </div>
                        <p className="text-neutral-800 italic">"{latestFeedback.comment}"</p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => onOpenFeedback(doc)}
                        className="px-3 py-1.5 border border-black text-xs font-bold hover:bg-neutral-100"
                      >
                        ሙሉ ታሪክ
                      </button>
                      <button
                        onClick={() => onReuploadRevised(doc)}
                        className="px-4 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>የተሻሻለውን ሰነድ ጫን (Re-upload)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FOLDERS VIEW: 5 Subfolders of Sector                                   */}
      {/* ========================================================================= */}
      {currentView === 'folders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const count = mySectorDocs.filter((d) => d.category === cat).length;
              return (
                <div
                  key={cat}
                  onClick={() => setCurrentView('submissions')}
                  className="border-2 border-black p-5 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-6 h-6 text-black" />
                    <div>
                      <div className="font-bold text-xs text-black">{cat}</div>
                      <div className="text-[10px] text-neutral-500">2017 ዓ.ም ማህደር</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUBMISSIONS VIEW: Clean Table of Submitted Docs                        */}
      {/* ========================================================================= */}
      {currentView === 'submissions' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2.5 border-r">የሰነድ ቁጥር</th>
                  <th className="p-2.5 border-r">የሰነድ ርዕስ</th>
                  <th className="p-2.5 border-r">ምድብ</th>
                  <th className="p-2.5 border-r">ዓመት/ሩብ</th>
                  <th className="p-2.5 border-r">ቀን</th>
                  <th className="p-2.5 border-r">ሁኔታ</th>
                  <th className="p-2.5 text-center">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {mySectorDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      የቀረበ ሰነድ የለም። "ሰነድ ወደ ክ/ከተማ ላክ" የሚለውን ይጫኑ።
                    </td>
                  </tr>
                ) : (
                  mySectorDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-mono font-bold border-r">{doc.code}</td>
                      <td className="p-2.5 font-bold border-r text-black">
                        <div>{doc.title}</div>
                        <div className="text-[10px] text-neutral-500">
                          {doc.fileSize} • {doc.fileType}
                        </div>
                      </td>
                      <td className="p-2.5 border-r font-medium">{doc.category}</td>
                      <td className="p-2.5 font-mono border-r whitespace-nowrap">
                        {doc.year} ({doc.quarter})
                      </td>
                      <td className="p-2.5 font-mono text-neutral-600 border-r whitespace-nowrap">
                        {doc.uploadDate}
                      </td>
                      <td className="p-2.5 border-r whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                            doc.status === 'የጸደቀ'
                              ? 'bg-neutral-100 border-black text-black'
                              : doc.status === 'ማሻሻያ የተጠየቀበት'
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-neutral-400 text-neutral-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-center space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() =>
                            onOpenQR(`ሰነድ - ${doc.title}`, doc.code, 'ሰነድ', {
                              sector: doc.sector,
                              woreda: doc.woredaName,
                              category: doc.category,
                            })
                          }
                          className="p-1 border border-neutral-300 hover:border-black"
                          title="QR ኮድ"
                        >
                          <QrCode className="w-3.5 h-3.5 text-black" />
                        </button>
                        <button
                          onClick={() => onOpenFeedback(doc)}
                          className="px-2 py-0.5 border border-black hover:bg-black hover:text-white text-xs font-bold"
                        >
                          አስተያየት
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CIRCULARS VIEW: Received Circulars                                     */}
      {/* ========================================================================= */}
      {currentView === 'circulars' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="divide-y divide-neutral-200">
            {subcityCirculars.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                እስካሁን የተላከ ሰርኩላር የለም።
              </div>
            ) : (
              subcityCirculars.map((circ) => (
                <div key={circ.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-black text-sm">{circ.title}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      {circ.code} • የተላከበት ቀን፦ {circ.uploadDate} • ላኪ፦ {circ.uploaderName}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onOpenQR(`ሰርኩላር - ${circ.title}`, circ.code, 'ሰነድ', {
                        sector: circ.sector,
                        category: circ.category,
                      })
                    }
                    className="px-2.5 py-1 border border-black hover:bg-black hover:text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR እይ</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
