import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Upload, 
  MessageSquare, 
  ArrowLeft,
  ChevronRight,
  Folder,
  Send,
  BookOpen
} from 'lucide-react';
import { DocumentItem, DocumentCategory } from '../../types/dms';
import { User } from '../../types/auth';

interface SubcitySectorDashboardProps {
  currentUser: User;
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onOpenFeedback: (doc: DocumentItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const SubcitySectorDashboard: React.FC<SubcitySectorDashboardProps> = ({
  currentUser,
  documents,
  onOpenUpload,
  onOpenQR,
  onOpenFeedback,
  onNavigateTab,
}) => {
  const sectorName = currentUser.sectorName || 'የፖለቲካ ዘርፍ';

  // Navigation state inside dashboard
  const [currentView, setCurrentView] = useState<'home' | 'review' | 'cabinet' | 'circulars' | 'revisions'>('home');

  // Strict data filtering
  const sectorDocs = documents.filter((d) => d.sector === sectorName);
  const incomingWoredaDocs = sectorDocs.filter((d) => d.level === 'ወረዳ');
  const sectorCirculars = sectorDocs.filter(
    (d) => d.level === 'ክፍለ ከተማ' && (d.category === 'ሰርኩላር' || d.category === 'ዕቅድ')
  );

  const approvedCount = incomingWoredaDocs.filter((d) => d.status === 'የጸደቀ').length;
  const inReviewCount = incomingWoredaDocs.filter((d) => d.status === 'በግምገማ ላይ').length;
  const revisionCount = incomingWoredaDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length;

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
                የክ/ከተማ ዘርፍ ኃላፊ
              </span>
              <span className="text-xs text-neutral-500 font-bold">{currentUser.name}</span>
            </div>
            <h1 className="text-base font-bold text-black mt-0.5">
              {currentView === 'home' && `${sectorName} • የስራ አስፈጻሚ ዴስክ`}
              {currentView === 'review' && 'የወረዳዎች ሰነድ መገምገሚያና ውሳኔ መስጫ ዴስክ'}
              {currentView === 'cabinet' && `የ${sectorName} ማዕከላዊ ካቢኔት አቃፊዎች`}
              {currentView === 'circulars' && 'ለወረዳዎች የተሰራጩ ሰርኩላሮችና መመሪያዎች'}
              {currentView === 'revisions' && 'ማሻሻያ የታዘዘባቸው የወረዳ ሰነዶች'}
            </h1>
          </div>
        </div>

        {/* Action Button: Disseminate Circular / Directive */}
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
            <span>ሰርኩላር / መመሪያ ላክ</span>
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
            {/* Box 1: Incoming Woreda Review Desk */}
            <div
              onClick={() => setCurrentView('review')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-black text-white">
                  {incomingWoredaDocs.length} የወረዳ ሰነዶች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">የወረዳዎች ሰነድ መገምገሚያ ዴስክ</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  ከ14ቱ ወረዳዎች ወደ {sectorName} የገቡ ሪፖርቶች፣ ዕቅዶችና ደብዳቤዎች መርምሮ ማጽደቂያ
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ሰነዶችን ገምግም ({inReviewCount} ውሳኔ የሚጠብቁ)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 2: Central Sector Cabinet */}
            <div
              onClick={() => setCurrentView('cabinet')}
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
                <h3 className="font-bold text-sm text-black">የዘርፉ ማዕከላዊ ካቢኔት</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የ{sectorName} ይፋዊ ማህደር አቃፊዎች (`ዕቅድ`፣ `ሪፖርት`፣ `ደብዳቤ`፣ `ሰርኩላር`)
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>አቃፊዎችን ክፈት</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 3: Dispatched Circulars */}
            <div
              onClick={() => setCurrentView('circulars')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  {sectorCirculars.length} ሰርኩላሮች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ለ14ቱ ወረዳዎች የተላኩ መመሪያዎች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  ከክፍለ ከተማው {sectorName} ለወረዳዎች የተሰራጩ የስራ መመሪያዎች ማህደር
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>መመሪያዎችን እይ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 4: Revision Demands */}
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
                    revisionCount > 0 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {revisionCount} ማሻሻያዎች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ማሻሻያ የታዘዘባቸው ሰነዶች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  በዘርፉ አስተያየት ተሰጥቶባቸው ወረዳዎች እንዲያስተካክሉ የተመለሱ ሰነዶች
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ክትትል አድርግ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REVIEW DESK VIEW: Clean Focused Table for Reviewing Woreda Docs         */}
      {/* ========================================================================= */}
      {currentView === 'review' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2.5 border-r">የሰነድ ቁጥር</th>
                  <th className="p-2.5 border-r">ወረዳ</th>
                  <th className="p-2.5 border-r">የሰነድ ርዕስ</th>
                  <th className="p-2.5 border-r">ምድብ</th>
                  <th className="p-2.5 border-r">ቀን</th>
                  <th className="p-2.5 border-r">ሁኔታ</th>
                  <th className="p-2.5 text-center">ውሳኔ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {incomingWoredaDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      የቀረበ የወረዳ ሰነድ የለም።
                    </td>
                  </tr>
                ) : (
                  incomingWoredaDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-mono font-bold border-r">{doc.code}</td>
                      <td className="p-2.5 font-bold border-r text-black">{doc.woredaName}</td>
                      <td className="p-2.5 border-r">
                        <div className="font-bold text-black">{doc.title}</div>
                        <div className="text-[10px] text-neutral-500">
                          አቅራቢ፦ {doc.uploaderName} • {doc.year} ({doc.quarter})
                        </div>
                      </td>
                      <td className="p-2.5 border-r font-medium">{doc.category}</td>
                      <td className="p-2.5 font-mono text-neutral-600 border-r">{doc.uploadDate}</td>
                      <td className="p-2.5 border-r">
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
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() =>
                            onOpenQR(`ሰነድ - ${doc.title}`, doc.code, 'ሰነድ', {
                              sector: doc.sector,
                              woreda: doc.woredaName,
                              category: doc.category,
                            })
                          }
                          className="p-1 border border-neutral-300 hover:border-black"
                        >
                          <QrCode className="w-3.5 h-3.5 text-black" />
                        </button>
                        <button
                          onClick={() => onOpenFeedback(doc)}
                          className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>ገምግም / ውሳኔ ስጥ</span>
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
      {/* 3. CABINET VIEW: 5 Subfolders of Sector                                   */}
      {/* ========================================================================= */}
      {currentView === 'cabinet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-2 border-black bg-white p-4">
            <div>
              <span className="text-[10px] font-mono border border-black px-1.5 py-0.2 bg-neutral-100">
                ቦክስ-ክ/ከተማ-{currentUser.sectorId || 'POL'}
              </span>
              <h3 className="font-bold text-sm text-black mt-1">የ{sectorName} ይፋዊ ካቢኔት</h3>
            </div>
            <button
              onClick={() =>
                onOpenQR(`የ${sectorName} ካቢኔት`, `AKK-BOX-${currentUser.sectorId || 'POL'}`, 'ፋይል ቦክስ / አቃፊ', {
                  sector: sectorName,
                })
              }
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-black hover:bg-black hover:text-white transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>የካቢኔቱን QR አውጣ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const count = sectorDocs.filter((d) => d.category === cat).length;
              return (
                <div
                  key={cat}
                  onClick={() => onNavigateTab('documents')}
                  className="border-2 border-black p-4 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
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
      {/* 4. CIRCULARS VIEW: Dispatched Directives                                  */}
      {/* ========================================================================= */}
      {currentView === 'circulars' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="divide-y divide-neutral-200">
            {sectorCirculars.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                እስካሁን የተላከ ሰርኩላር የለም።
              </div>
            ) : (
              sectorCirculars.map((circ) => (
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
                    <span>QR ኮድ</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. REVISIONS VIEW: Dispatched Revision Demands                             */}
      {/* ========================================================================= */}
      {currentView === 'revisions' && (
        <div className="space-y-3">
          {incomingWoredaDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length === 0 ? (
            <div className="border-2 border-black bg-white p-8 text-center text-neutral-500 text-xs">
              ምንም ማሻሻያ የተጠየቀበት የወረዳ ሰነድ የለም።
            </div>
          ) : (
            incomingWoredaDocs
              .filter((d) => d.status === 'ማሻሻያ የተጠየቀበት')
              .map((doc) => (
                <div
                  key={doc.id}
                  className="border-2 border-black bg-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold border border-black px-1.5 py-0.2 bg-neutral-100">
                        {doc.code}
                      </span>
                      <span className="text-xs font-bold text-black">{doc.woredaName}</span>
                    </div>
                    <div className="font-bold text-xs text-black">{doc.title}</div>
                    {doc.feedbacks.length > 0 && (
                      <div className="text-xs bg-neutral-50 p-2 border border-neutral-200 italic text-neutral-800">
                        "{doc.feedbacks[doc.feedbacks.length - 1].comment}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenFeedback(doc)}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 shrink-0 self-start sm:self-center"
                  >
                    ውሳኔ አስተካክል
                  </button>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};
