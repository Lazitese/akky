import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DocumentItem } from '../types/dms';

interface QRVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
}

export const QRVerifierModal: React.FC<QRVerifierModalProps> = ({
  isOpen,
  onClose,
  documents,
}) => {
  const [query, setQuery] = useState('');
  const [verifiedDoc, setVerifiedDoc] = useState<DocumentItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toUpperCase();
    const found = documents.find(
      (d) =>
        d.qrHash.toUpperCase().includes(trimmed) ||
        d.code.toUpperCase().includes(trimmed)
    );

    setVerifiedDoc(found || null);
    setHasSearched(true);
  };

  const handleQuickTest = (code: string) => {
    setQuery(code);
    const found = documents.find((d) => d.code === code);
    setVerifiedDoc(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl">
        {/* Top Header */}
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <ShieldCheck className="w-4 h-4" />
            <span>የQR ኮድ እና ሰነድ ትክክለኛነት ማጣሪያ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-neutral-200"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Field */}
        <div className="p-4 border-b border-neutral-300">
          <form onSubmit={handleVerify} className="space-y-2">
            <label className="text-xs font-semibold text-neutral-800 block">
              የሰነዱን QR ቁጥር ወይም መለያ ያስገቡ፦
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ለምሳሌ፡ ሰ/ቁ-2017-084"
                className="flex-1 border border-black px-2.5 py-1.5 text-xs focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>አረጋግጥ</span>
              </button>
            </div>
          </form>

          {/* Quick test chips */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-600">
            <span>ሙከራ፦</span>
            <button
              onClick={() => handleQuickTest('ሰ/ቁ-2017-084')}
              className="underline hover:text-black font-mono"
            >
              ሰ/ቁ-2017-084
            </button>
            <span>•</span>
            <button
              onClick={() => handleQuickTest('ሰ/ቁ-2017-085')}
              className="underline hover:text-black font-mono"
            >
              ሰ/ቁ-2017-085
            </button>
          </div>
        </div>

        {/* Verification Result Area */}
        <div className="p-4 bg-neutral-50">
          {hasSearched ? (
            verifiedDoc ? (
              <div className="bg-white border-2 border-black p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>ትክክለኛ የፓርቲ ሰነድ ነው</span>
                  </div>
                  <span className="text-[10px] font-mono border border-black px-1.5 py-0.5">
                    {verifiedDoc.code}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-neutral-500">ርዕስ፦</span>{' '}
                    <span className="font-bold text-black">{verifiedDoc.title}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">ዘርፍ/ደረጃ፦</span>{' '}
                    <span>{verifiedDoc.sector} ({verifiedDoc.level === 'ወረዳ' ? verifiedDoc.woredaName : 'ክ/ከተማ'})</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">የጸደቀበት ሁኔታ፦</span>{' '}
                    <span className="font-bold underline">{verifiedDoc.status}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">የተመዘገበበት ቀን፦</span>{' '}
                    <span>{verifiedDoc.uploadDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-4 text-center space-y-1">
                <AlertTriangle className="w-6 h-6 text-black mx-auto mb-1" />
                <div className="text-xs font-bold text-black">ሰነዱ በዳታቤዝ ውስጥ አልተገኘም!</div>
                <p className="text-[11px] text-neutral-600">
                  ያስገቡት የQR መለያ አልተመዘገበም ወይም የተሳሳተ ኮድ ነው።
                </p>
              </div>
            )
          ) : (
            <p className="text-[11px] text-neutral-500 text-center py-4">
              የሰነዱን ኮድ አስገብተው 'አረጋግጥ' የሚለውን ይጫኑ።
            </p>
          )}
        </div>

        <div className="p-3 border-t border-neutral-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold border border-black hover:bg-neutral-100"
          >
            ዝጋ
          </button>
        </div>
      </div>
    </div>
  );
};
