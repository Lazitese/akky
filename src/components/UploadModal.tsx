import React, { useState } from 'react';
import { X, Upload, FileText, Check } from 'lucide-react';
import { DocumentCategory, DocumentItem, LevelType } from '../types/dms';
import { SECTORS, WOREDAS } from '../data/mockData';

import { User } from '../types/auth';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
  currentUser?: User;
  defaultLevel: LevelType;
  defaultWoredaId?: string;
  defaultSector?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
  currentUser,
  defaultLevel,
  defaultWoredaId,
  defaultSector,
}) => {
  const isWoredaSector = currentUser?.role === 'WOREDA_SECTOR_ADMIN';
  const isWoredaSuper = currentUser?.role === 'WOREDA_SUPER_ADMIN';
  const isSubcitySector = currentUser?.role === 'SUBCITY_SECTOR_ADMIN';

  const [level, setLevel] = useState<LevelType>(
    isWoredaSector || isWoredaSuper ? 'ወረዳ' : defaultLevel
  );
  const [woredaId, setWoredaId] = useState<string>(
    currentUser?.woredaId || defaultWoredaId || 'wor-04'
  );
  const [sector, setSector] = useState<string>(
    currentUser?.sectorName || defaultSector || SECTORS[0].name
  );
  const [category, setCategory] = useState<DocumentCategory>('ሪፖርት');
  const [year] = useState<string>('2017 ዓ.ም');
  const [quarter, setQuarter] = useState<string>('1ኛ ሩብ ዓመት');
  const [title, setTitle] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'IMAGE'>('PDF');
  const [autoQr] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setFileType('DOCX');
      } else if (file.name.match(/\.(jpg|jpeg|png)$/i)) {
        setFileType('IMAGE');
      } else {
        setFileType('PDF');
      }
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedWoreda = WOREDAS.find((w) => w.id === woredaId);
    const newDocId = `doc-${Date.now().toString().slice(-4)}`;
    const randomCodeNum = Math.floor(100 + Math.random() * 900);
    const newDocCode = `ሰ/ቁ-2017-${randomCodeNum}`;
    const qrHash = `AKK-DOC-2017-${randomCodeNum}-${level === 'ወረዳ' ? (selectedWoreda?.name.replace(' ', '') || 'W') : 'HQ'}`;

    const newDoc: DocumentItem = {
      id: newDocId,
      code: newDocCode,
      title: title.trim(),
      level: level,
      sector: sector,
      woredaId: level === 'ወረዳ' ? woredaId : undefined,
      woredaName: level === 'ወረዳ' ? selectedWoreda?.name : undefined,
      category: category,
      year: year,
      quarter: quarter,
      fileType: fileType,
      fileSize: '1.5 MB',
      uploadDate: 'ዛሬ',
      uploaderName: currentUser?.name
        ? `${currentUser.name} (${level === 'ወረዳ' ? (selectedWoreda?.name || 'ወረዳ') : 'ክ/ከተማ'})`
        : level === 'ወረዳ'
        ? `${selectedWoreda?.name} ተወካይ`
        : 'ክፍለ ከተማ መዝጋቢ',
      status: 'በግምገማ ላይ',
      qrHash: qrHash,
      feedbacks: [],
    };

    onAddDocument(newDoc);
    onClose();
    setTitle('');
    setFileName('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <Upload className="w-4 h-4" />
            <span>አዲስ ሰነድ መመዝገቢያ እና መጫኛ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-neutral-200"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Level Selection: Disabled for woreda users */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
              የሰነዱ ደረጃ፦
            </label>
            {isWoredaSector || isWoredaSuper ? (
              <div className="p-2 border border-black bg-neutral-100 text-xs font-bold flex items-center justify-between">
                <span>ወረዳ ደረጃ (የክፍለ ከተማ ምርጫ ለወረዳዎች አይፈቀድም)</span>
                <span className="font-mono text-[10px] px-1 bg-black text-white">🔒 የተቆለፈ</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLevel('ክፍለ ከተማ')}
                  className={`py-1.5 text-xs font-bold border ${
                    level === 'ክፍለ ከተማ'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 hover:bg-neutral-50 text-black'
                  }`}
                >
                  ክፍለ ከተማ
                </button>
                <button
                  type="button"
                  onClick={() => setLevel('ወረዳ')}
                  className={`py-1.5 text-xs font-bold border ${
                    level === 'ወረዳ'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 hover:bg-neutral-50 text-black'
                  }`}
                >
                  ወረዳ
                </button>
              </div>
            )}
          </div>

          {/* Woreda Selector (if woreda level) */}
          {level === 'ወረዳ' && (
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                የሚመለከተው ወረዳ፦
              </label>
              {isWoredaSector || isWoredaSuper ? (
                <div className="p-2 border border-black bg-neutral-100 text-xs font-bold flex items-center justify-between">
                  <span>{currentUser?.woredaName || 'ወረዳ 04'}</span>
                  <span className="font-mono text-[10px] px-1 bg-black text-white">🔒 የወረዳው ቋት</span>
                </div>
              ) : (
                <select
                  value={woredaId}
                  onChange={(e) => setWoredaId(e.target.value)}
                  className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none bg-white font-medium"
                >
                  {WOREDAS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.boxCode})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Sector & Category Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                ዘርፍ፦
              </label>
              {isWoredaSector || isSubcitySector ? (
                <div className="p-1.5 border border-black bg-neutral-100 text-xs font-bold flex items-center justify-between">
                  <span className="truncate">{currentUser?.sectorName || 'የፖለቲካ ዘርፍ'}</span>
                  <span className="font-mono text-[9px] px-1 bg-black text-white shrink-0">🔒</span>
                </div>
              ) : (
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full border border-black px-2 py-1.5 text-xs focus:outline-none bg-white"
                >
                  {SECTORS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                ምድብ (ካታጎሪ)፦
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full border border-black px-2 py-1.5 text-xs focus:outline-none bg-white font-medium"
              >
                <option value="ዕቅድ">ዕቅድ</option>
                <option value="ሪፖርት">ሪፖርት</option>
                <option value="ደብዳቤ">ደብዳቤ</option>
                <option value="ሰርኩላር">ሰርኩላር</option>
                <option value="ሌሎች">ሌሎች</option>
              </select>
            </div>
          </div>

          {/* Year & Quarter */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                በጀት ዓመት፦
              </label>
              <input
                type="text"
                disabled
                value={year}
                className="w-full border border-neutral-300 bg-neutral-100 px-2 py-1.5 text-xs text-neutral-700"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                ሩብ ዓመት፦
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="w-full border border-black px-2 py-1.5 text-xs focus:outline-none bg-white"
              >
                <option value="1ኛ ሩብ ዓመት">1ኛ ሩብ ዓመት</option>
                <option value="2ኛ ሩብ ዓመት">2ኛ ሩብ ዓመት</option>
                <option value="3ኛ ሩብ ዓመት">3ኛ ሩብ ዓመት</option>
                <option value="4ኛ ሩብ ዓመት">4ኛ ሩብ ዓመት</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
              የሰነድ ርዕስ (አጭር መግለጫ)፦ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ለምሳሌ፡ የ1ኛ ሩብ ዓመት የአፈጻጸም ሪፖርት..."
              className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none"
            />
          </div>

          {/* File Picker */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
              ፋይል ይምረጡ (PDF, Word, ምስል)፦
            </label>
            <div className="border border-dashed border-black p-3 text-center bg-neutral-50 relative hover:bg-neutral-100 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileText className="w-5 h-5 mx-auto text-neutral-600 mb-1" />
              <div className="text-xs font-semibold text-black">
                {fileName ? fileName : 'ፋይል ለመምረጥ እዚህ ይጫኑ'}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                ከፍተኛ መጠን፦ 10 MB (PDF, Word, JPEG)
              </div>
            </div>
          </div>

          {/* Auto QR Confirmation Notice */}
          <div className="p-2 border border-black bg-neutral-50 flex items-center gap-2">
            <div className="w-4 h-4 bg-black text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <p className="text-[11px] text-black">
              ሰነዱ እንደገባ የማይደገም ይፋዊ የQR ኮድ በራስ-ሰር ይታተምበታል።
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-300">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold border border-black hover:bg-neutral-100"
            >
              ይቅር
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-black text-white hover:bg-neutral-800 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ሰነዱን መዝግብ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
