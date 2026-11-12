import React, { useState } from 'react';
import { 
  MapPin, 
  FileText, 
  AlertTriangle, 
  QrCode, 
  Upload, 
  Building2,
  ArrowLeft,
  ChevronRight,
  Folder
} from 'lucide-react';
import { DocumentItem, Sector } from '../../types/dms';
import { User } from '../../types/auth';

interface WoredaSuperAdminDashboardProps {
  currentUser: User;
  documents: DocumentItem[];
  sectors: Sector[];
  onOpenUpload: () => void;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onOpenFeedback: (doc: DocumentItem) => void;
  onNavigateTab: (tab: string, filter?: any) => void;
}

export const WoredaSuperAdminDashboard: React.FC<WoredaSuperAdminDashboardProps> = ({
  currentUser,
  documents,
  sectors,
  onOpenUpload,
  onOpenQR,
  onOpenFeedback,
  onNavigateTab,
}) => {
  const woredaName = currentUser.woredaName || 'ወረዳ 04';
  const woredaId = currentUser.woredaId || 'wor-04';

  // Navigation state inside dashboard
  const [currentView, setCurrentView] = useState<'home' | 'sectors' | 'submissions' | 'revisions'>('home');

  // STRICT FILTER: Only documents belonging to THIS woreda!
  const woredaDocs = documents.filter((d) => d.woredaId === woredaId);
  const approvedDocs = woredaDocs.filter((d) => d.status === 'የጸደቀ').length;
  const revisionDocs = woredaDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት');

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
                የወረዳ ዋና አስተዳዳሪ
              </span>
              <span className="text-xs text-neutral-500 font-bold">{currentUser.name}</span>
            </div>
            <h1 className="text-base font-bold text-black mt-0.5">
              {currentView === 'home' && `${woredaName} • አጠቃላይ የስራ አመራር ዴስክ`}
              {currentView === 'sectors' && `የ${woredaName} 5ቱ ይፋዊ ዘርፎች`}
              {currentView === 'submissions' && `ከ${woredaName} ወደ ክ/ከተማ የተላኩ ሰነዶች`}
              {currentView === 'revisions' && `ከክ/ከተማ ማሻሻያ የተጠየቀባቸው ሰነዶች`}
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
            <span>አዲስ ሰነድ ላክ</span>
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
            {/* Box 1: 5 Woreda Sectors */}
            <div
              onClick={() => setCurrentView('sectors')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-black text-white">
                  5 ዘርፎች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">የወረዳው 5ቱ ዘርፎች ካቢኔት</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የፖለቲካ፣ አደረጃጀት፣ ሴቶችና ወጣቶች፣ ፋይናንስና ህ/ግንኙነት ዘርፎች ማህደሮች
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ዘርፎችን ክፈት</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 2: Submissions to Subcity */}
            <div
              onClick={() => setCurrentView('submissions')}
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  {woredaDocs.length} የተላኩ ሰነዶች
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ወደ ክፍለ ከተማ የተላኩ ሰነዶች</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የጸደቁ፣ በግምገማ ላይ ያሉ እና ይፋዊ የQR ማረጋገጫ ያላቸው ሰነዶች መዝገብ
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>ሰነዶችን እይ ({approvedDocs} የጸደቁ)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 3: Urgent Revisions Demanded by Subcity */}
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
                  {revisionDocs.length} አስቸኳይ
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">ከክ/ከተማ ማሻሻያ የተጠየቀባቸው</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የክፍለ ከተማው ዘርፎች ማስተካከያ የጠየቁባቸው ሰነዶችና አስተያየቶች
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>አስተያየቶችን ተከታተል</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 4: Woreda QR Certificate */}
            <div
              onClick={() =>
                onOpenQR(
                  `የ${woredaName} ይፋዊ ዲጂታል ፋይል ቦክስ`,
                  `AKK-BOX-${woredaId.toUpperCase()}`,
                  'ፋይል ቦክስ / አቃፊ',
                  {
                    woreda: woredaName,
                    totalDocs: woredaDocs.length,
                  }
                )
              }
              className="border-2 border-black bg-white p-6 cursor-pointer hover:bg-neutral-50 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100 text-black">
                  ይፋዊ ሰርተፍኬት
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">የወረዳው ይፋዊ የQR ሰርተፍኬት</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  የ{woredaName} የፋይል ካቢኔት ይፋዊ QR ማመንጨትና ማተሚያ
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>QR አትም / አውርድ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECTORS VIEW: 5 Woreda Sectors Grid                                    */}
      {/* ========================================================================= */}
      {currentView === 'sectors' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec) => {
              const secDocs = woredaDocs.filter((d) => d.sector === sec.name);
              const approved = secDocs.filter((d) => d.status === 'የጸደቀ').length;
              const needsRev = secDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length;

              return (
                <div
                  key={sec.id}
                  className="border-2 border-black bg-white p-5 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold border border-black px-1.5 py-0.2 bg-neutral-100">
                        {sec.code}
                      </span>
                      <h4 className="font-bold text-sm text-black mt-1">{sec.name}</h4>
                    </div>
                    <button
                      onClick={() =>
                        onOpenQR(
                          `የ${woredaName} ${sec.name}`,
                          `AKK-${woredaId.toUpperCase()}-${sec.code}`,
                          'ፋይል ቦክስ / አቃፊ',
                          { woreda: woredaName, sector: sec.name }
                        )
                      }
                      className="p-1 border border-neutral-300 hover:border-black"
                    >
                      <QrCode className="w-4 h-4 text-black" />
                    </button>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1 pt-1 border-t border-neutral-200">
                    <div className="flex justify-between">
                      <span>የገቡ ሰነዶች፦</span>
                      <strong className="font-mono text-black">{secDocs.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>የጸደቁ፦</span>
                      <strong className="font-mono text-black">{approved}</strong>
                    </div>
                    {needsRev > 0 && (
                      <div className="flex justify-between text-black font-bold">
                        <span>ማሻሻያ፦</span>
                        <span className="px-1.5 py-0.2 bg-black text-white text-[10px] font-mono">
                          {needsRev}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigateTab('documents', { sector: sec.name })}
                    className="w-full py-1.5 border border-black hover:bg-black hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>ሰነዶችን ክፈት</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUBMISSIONS VIEW: Clean Table of Woreda Submissions                     */}
      {/* ========================================================================= */}
      {currentView === 'submissions' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2.5 border-r">የሰነድ ቁጥር</th>
                  <th className="p-2.5 border-r">ዘርፍ</th>
                  <th className="p-2.5 border-r">የሰነድ ርዕስ</th>
                  <th className="p-2.5 border-r">ምድብ</th>
                  <th className="p-2.5 border-r">ቀን</th>
                  <th className="p-2.5 border-r">ሁኔታ</th>
                  <th className="p-2.5 text-center">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {woredaDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      የቀረበ ሰነድ የለም።
                    </td>
                  </tr>
                ) : (
                  woredaDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-mono font-bold border-r">{doc.code}</td>
                      <td className="p-2.5 font-bold border-r text-black">{doc.sector}</td>
                      <td className="p-2.5 border-r">
                        <div className="font-bold text-black">{doc.title}</div>
                        <div className="text-[10px] text-neutral-500">
                          አቅራቢ፦ {doc.uploaderName}
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
      {/* 4. REVISIONS VIEW: Woreda Revisions Follow-up List                         */}
      {/* ========================================================================= */}
      {currentView === 'revisions' && (
        <div className="space-y-3">
          {revisionDocs.length === 0 ? (
            <div className="border-2 border-black bg-white p-8 text-center text-neutral-500 text-xs">
              ምንም ማሻሻያ የተጠየቀበት ሰነድ የለም።
            </div>
          ) : (
            <div className="space-y-2">
              {revisionDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="border-2 border-black bg-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold border border-black px-1.5 py-0.2 bg-neutral-100">
                        {doc.code}
                      </span>
                      <span className="text-xs font-bold text-black">{doc.sector}</span>
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
                    ዝርዝሩን እይ
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
