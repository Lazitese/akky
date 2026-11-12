import React, { useState } from 'react';
import { 
  FileText, 
  QrCode, 
  MessageSquare, 
  Eye, 
  Filter, 
  AlertCircle,
  FileCheck,
  FileClock,
  Download,
  Lock,
  Building2,
  MapPin
} from 'lucide-react';
import { DocumentItem, DocumentCategory, DocumentStatus } from '../types/dms';
import { SECTORS, WOREDAS } from '../data/mockData';
import { User } from '../types/auth';

interface DocumentListProps {
  documents: DocumentItem[];
  currentUser: User;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onOpenFeedback: (doc: DocumentItem) => void;
  selectedCategoryFilter?: DocumentCategory | 'ሁሉም';
  searchQuery: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  currentUser,
  onOpenQR,
  onOpenFeedback,
  selectedCategoryFilter = 'ሁሉም',
  searchQuery,
}) => {
  const isSuperAdmin = currentUser.role === 'SUBCITY_SUPER_ADMIN';
  const isSubcitySector = currentUser.role === 'SUBCITY_SECTOR_ADMIN';
  const isWoredaSuper = currentUser.role === 'WOREDA_SUPER_ADMIN';
  const isWoredaSector = currentUser.role === 'WOREDA_SECTOR_ADMIN';

  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'ሁሉም'>(selectedCategoryFilter);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ሁሉም'>('ሁሉም');
  const [sectorFilter, setSectorFilter] = useState<string>('ሁሉም');
  const [woredaFilter, setWoredaFilter] = useState<string>('ሁሉም');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const categories: (DocumentCategory | 'ሁሉም')[] = ['ሁሉም', 'ዕቅድ', 'ሪፖርት', 'ደብዳቤ', 'ሰርኩላር', 'ሌሎች'];
  const statuses: (DocumentStatus | 'ሁሉም')[] = ['ሁሉም', 'የጸደቀ', 'በግምገማ ላይ', 'ማሻሻያ የተጠየቀበት'];

  const filteredDocs = documents.filter((doc) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        doc.title.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.sector.toLowerCase().includes(q) ||
        (doc.woredaName && doc.woredaName.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (categoryFilter !== 'ሁሉም' && doc.category !== categoryFilter) {
      return false;
    }

    // Status
    if (statusFilter !== 'ሁሉም' && doc.status !== statusFilter) {
      return false;
    }

    // Sector Filter (only for roles that have choice)
    if (!isWoredaSector && !isSubcitySector && sectorFilter !== 'ሁሉም' && doc.sector !== sectorFilter) {
      return false;
    }

    // Woreda Filter (only for Subcity roles that have choice)
    if ((isSuperAdmin || isSubcitySector) && woredaFilter !== 'ሁሉም' && doc.woredaId !== woredaFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-3">
      {/* Strict Role Access Badge */}
      <div className="flex items-center justify-between text-xs font-bold text-black border-b border-neutral-300 pb-2">
        <div className="flex items-center gap-2">
          <span>ይፋዊ የሰነዶች መዝገብ</span>
          <span className="text-[10px] px-2 py-0.5 border border-black bg-neutral-100 font-mono">
            {isSuperAdmin && 'ሙሉ የክፍለ ከተማው ሰነዶች'}
            {isSubcitySector && `የ${currentUser.sectorName} ሰነዶች ብቻ`}
            {isWoredaSuper && `የ${currentUser.woredaName} ሰነዶች ብቻ`}
            {isWoredaSector && `የ${currentUser.woredaName} • ${currentUser.sectorName} ብቻ`}
          </span>
        </div>

        <div className="text-[11px] text-neutral-500 font-mono">
          ጠቅላላ የተገኙ፦ <strong>{filteredDocs.length}</strong> ሰነዶች
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 border-2 border-black space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-bold text-neutral-600 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>ምድብ፦</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 text-xs font-semibold border transition-colors ${
                  categoryFilter === cat
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 hover:border-black text-neutral-800 bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status & Restricted Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Dropdown (available to all) */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-black px-2 py-1 text-xs focus:outline-none bg-white font-medium"
            >
              <option value="ሁሉም">ሁሉም ሁኔታዎች</option>
              <option value="የጸደቀ">የጸደቀ</option>
              <option value="በግምገማ ላይ">በግምገማ ላይ</option>
              <option value="ማሻሻያ የተጠየቀበት">ማሻሻያ የተጠየቀበት</option>
            </select>

            {/* Sector Dropdown: Hidden for WoredaSector and SubcitySector (locked to their sector) */}
            {(isSuperAdmin || isWoredaSuper) && (
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="border border-black px-2 py-1 text-xs focus:outline-none bg-white font-medium"
              >
                <option value="ሁሉም">ሁሉም ዘርፎች</option>
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {/* Woreda Dropdown: ONLY for Subcity roles (Woredas cannot browse other woredas) */}
            {(isSuperAdmin || isSubcitySector) && (
              <select
                value={woredaFilter}
                onChange={(e) => setWoredaFilter(e.target.value)}
                className="border border-black px-2 py-1 text-xs focus:outline-none bg-white font-medium"
              >
                <option value="ሁሉም">ሁሉም ወረዳዎች</option>
                {WOREDAS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="border-2 border-black bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-black text-xs font-bold text-black">
              <th className="p-2.5 border-r border-neutral-300 w-32">ሰነድ ቁጥር</th>
              <th className="p-2.5 border-r border-neutral-300">የሰነድ ርዕስ</th>
              {!isWoredaSector && (
                <th className="p-2.5 border-r border-neutral-300 w-36">
                  {isSubcitySector ? 'ወረዳ' : 'ዘርፍ / መዋቅር'}
                </th>
              )}
              <th className="p-2.5 border-r border-neutral-300 w-24">ምድብ</th>
              <th className="p-2.5 border-r border-neutral-300 w-28">ቀን</th>
              <th className="p-2.5 border-r border-neutral-300 w-32">ሁኔታ</th>
              <th className="p-2.5 text-center w-36">እርምጃዎች</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs">
            {filteredDocs.length === 0 ? (
              <tr>
                <td
                  colSpan={!isWoredaSector ? 7 : 6}
                  className="p-8 text-center text-neutral-500"
                >
                  በዚህ ፍለጋ የተገኘ ሰነድ የለም።
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const hasRevisions = doc.status === 'ማሻሻያ የተጠየቀበት';
                const feedbackCount = doc.feedbacks.length;

                return (
                  <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                    {/* Code */}
                    <td className="p-2.5 font-mono font-bold text-black border-r border-neutral-200 whitespace-nowrap">
                      {doc.code}
                    </td>

                    {/* Title & file type */}
                    <td className="p-2.5 border-r border-neutral-200">
                      <div className="font-semibold text-black line-clamp-1">{doc.title}</div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{doc.fileType}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.uploaderName}</span>
                      </div>
                    </td>

                    {/* Sector / Woreda column (hidden for Woreda Sector Admin) */}
                    {!isWoredaSector && (
                      <td className="p-2.5 border-r border-neutral-200">
                        {isSubcitySector ? (
                          <div className="font-medium text-black">
                            {doc.level === 'ወረዳ' ? doc.woredaName : 'ክ/ከተማ ማዕከል'}
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-black">{doc.sector}</div>
                            <div className="text-[10px] text-neutral-500">
                              {doc.level === 'ወረዳ' ? doc.woredaName : 'ክ/ከተማ ማዕከል'}
                            </div>
                          </>
                        )}
                      </td>
                    )}

                    {/* Category */}
                    <td className="p-2.5 border-r border-neutral-200">
                      <span className="px-1.5 py-0.5 border border-neutral-300 bg-neutral-50 text-[11px] font-semibold">
                        {doc.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-2.5 border-r border-neutral-200 text-neutral-700 font-mono text-[11px] whitespace-nowrap">
                      {doc.uploadDate}
                    </td>

                    {/* Status Badge */}
                    <td className="p-2.5 border-r border-neutral-200 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border ${
                          doc.status === 'የጸደቀ'
                            ? 'border-black bg-black text-white'
                            : doc.status === 'ማሻሻያ የተጠየቀበት'
                            ? 'border-black bg-neutral-200 text-black'
                            : 'border-neutral-400 text-neutral-700 bg-white'
                        }`}
                      >
                        {doc.status === 'የጸደቀ' && <FileCheck className="w-3 h-3 text-white" />}
                        {doc.status === 'በግምገማ ላይ' && <FileClock className="w-3 h-3 text-neutral-700" />}
                        {doc.status === 'ማሻሻያ የተጠየቀበት' && <AlertCircle className="w-3 h-3 text-black" />}
                        <span>{doc.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* QR Code Action */}
                        <button
                          onClick={() =>
                            onOpenQR(`ሰነድ - ${doc.title}`, doc.code, 'ሰነድ', {
                              sector: doc.sector,
                              woreda: doc.woredaName,
                              category: doc.category,
                              date: doc.uploadDate,
                            })
                          }
                          className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
                          title="የሰነዱን ይፋዊ QR ኮድ አውጣ"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* View Action */}
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                          title="ሰነዱን እይ"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-800" />
                        </button>

                        {/* Feedback Loop Action */}
                        <button
                          onClick={() => onOpenFeedback(doc)}
                          className={`p-1 border relative ${
                            hasRevisions
                              ? 'border-black bg-neutral-200 font-bold'
                              : 'border-neutral-300 hover:border-black hover:bg-neutral-100'
                          }`}
                          title="ግብረ-መልስ እና ማሻሻያ"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-black" />
                          {feedbackCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                              {feedbackCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="text-xs font-bold font-mono border border-black px-1.5 py-0.2">
                {previewDoc.code}
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-xs font-bold border border-black px-2 py-0.5 hover:bg-neutral-100"
              >
                ዝጋ
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-black">{previewDoc.title}</h3>
              <p className="text-xs text-neutral-600">
                ዘርፍ፦ {previewDoc.sector} | ምድብ፦ {previewDoc.category} | ቀን፦ {previewDoc.uploadDate}
              </p>
            </div>

            {/* Simulated Document Paper */}
            <div className="border border-neutral-300 p-4 bg-neutral-50 text-xs font-serif leading-relaxed text-neutral-800 min-h-[160px] space-y-2">
              <div className="text-center font-bold font-sans text-xs uppercase border-b border-neutral-300 pb-1">
                የአቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ቅ/ፅ/ቤት ይፋዊ ሰነድ
              </div>
              <p>
                ይህ ሰነድ በአቃቂ ቃሊቲ ቅርንጫፍ ጽ/ቤት የዲጂታል ሰነድ ማህደር (DMS) ውስጥ የተመዘገበ ይፋዊ ሰነድ ነው።
              </p>
              <p className="text-neutral-600 text-[11px]">
                የፋይል አይነት፦ {previewDoc.fileType} | የመጠን መጠን፦ {previewDoc.fileSize} | የQR ማረጋገጫ ቁጥር፦ {previewDoc.qrHash}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={() => {
                  alert('የሰነዱ ፋይል እየወረደ ነው...');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black text-xs font-bold hover:bg-neutral-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>አውርድ ({previewDoc.fileType})</span>
              </button>
              <button
                onClick={() => {
                  const doc = previewDoc;
                  setPreviewDoc(null);
                  onOpenFeedback(doc);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ግብረ-መልስ ስጥ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
