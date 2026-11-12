import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code: string;
  type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ';
  metadata: {
    sector?: string;
    woreda?: string;
    category?: string;
    date?: string;
  };
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  code,
  type,
  metadata,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && code) {
      // Generate high-resolution Black & White QR code
      const payload = JSON.stringify({
        org: 'AKAKI_KALITY_PROSPERITY_PARTY',
        ref: code,
        type: type,
        timestamp: new Date().toISOString(),
      });

      QRCode.toDataURL(payload, {
        width: 320,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, code, type]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `QR-${code}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black">
            <span>ይፋዊ የQR ኮድ ማረጋገጫ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-neutral-200"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Printable Certificate Area */}
        <div className="p-6 text-center border-b border-neutral-300 bg-white">
          {/* Official Emblem Banner */}
          <div className="border border-black p-2 mb-4 bg-neutral-50">
            <h2 className="text-xs font-bold text-black uppercase tracking-tight">
              የአቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ቅ/ፅ/ቤት
            </h2>
            <p className="text-[10px] text-neutral-600">
              ዲጂታል የሰነድ እና የፋይል ማህደር ማረጋገጫ ማህተም
            </p>
          </div>

          {/* QR Code Container */}
          <div className="w-48 h-48 mx-auto p-2 border-2 border-black bg-white flex items-center justify-center mb-3">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="የQR ኮድ" className="w-full h-full object-contain" />
            ) : (
              <div className="text-xs text-neutral-400">QR በማመንጨት ላይ...</div>
            )}
          </div>

          {/* Document Reference Stamp */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-black text-xs font-mono font-bold bg-neutral-100 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            <span>{code}</span>
          </div>

          <h3 className="text-xs font-bold text-black line-clamp-2 px-2 mb-1">
            {title}
          </h3>

          <p className="text-[11px] text-neutral-600 mb-4">
            የማህደር አይነት፦ <span className="font-semibold text-black">{type}</span>
            {metadata.sector && ` | ${metadata.sector}`}
            {metadata.woreda && ` | ${metadata.woreda}`}
          </p>

          <div className="text-[10px] text-neutral-500 border-t border-dashed border-neutral-300 pt-2 text-left space-y-0.5">
            <div>• ይህን QR ኮድ በስልክ ስካን በማድረግ የሰነዱን ይፋዊነት ማረጋገጥ ይቻላል።</div>
            <div>• የሰነዱ ኮፒም ሆነ ዋናው ማህደር በዲጂታል ዳታቤዝ ተመዝግቧል።</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-neutral-50 flex items-center justify-end gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-black hover:bg-neutral-100"
          >
            <Download className="w-3.5 h-3.5" />
            <span>አውርድ</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-black text-white hover:bg-neutral-800"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>አትም</span>
          </button>
        </div>
      </div>
    </div>
  );
};
