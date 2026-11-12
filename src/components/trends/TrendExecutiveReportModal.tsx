import React from 'react';
import { X, Printer, Download, ShieldAlert, CheckCircle2, TrendingUp, AlertOctagon } from 'lucide-react';
import { TrendItem } from '../../types/trends';
import { WOREDAS } from '../../data/mockData';

interface TrendExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trends: TrendItem[];
}

export const TrendExecutiveReportModal: React.FC<TrendExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  trends,
}) => {
  if (!isOpen) return null;

  const positiveTrends = trends.filter((t) => t.analysisType === 'በአዎንታዊ የሚታይ ዝንባሌ');
  const urgentTrends = trends.filter((t) => t.analysisType === 'ትኩረት የሚሻ ዝንባሌ');
  const negativeTrends = trends.filter((t) => t.analysisType === 'በአሉታዊ የሚታይ ዝንባሌ');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white border-2 border-black max-w-3xl w-full shadow-2xl max-h-[92vh] flex flex-col print:border-none print:shadow-none print:max-h-full">
        {/* Modal Top Bar */}
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-neutral-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-black">
              ይፋዊ የአመራር አዝማሚያ ማጠቃለያ ሪፖርት
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 border border-black hover:bg-black hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>አትም</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 border border-black hover:bg-neutral-200"
              aria-label="ዝጋ"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-black font-sans print:p-0">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-black pb-4 space-y-1">
            <div className="font-bold text-base tracking-tight text-black">
              አቃቂ ቃሊቲ ክፍለ ከተማ ብልፅግና ፓርቲ ቅርንጫፍ ፅሕፈት ቤት
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              የወቅታዊ ፖለቲካ አዝማሚያ እና ሁኔታ ትንተና ጥቅል የስራ አስፈጻሚ ማጠቃለያ
            </div>
            <div className="text-[11px] font-mono text-neutral-600 flex items-center justify-center gap-4 pt-1">
              <span>ቀን፦ <strong>ጥቅምት 2017 ዓ.ም</strong></span>
              <span>•</span>
              <span>የሪፖርት ዑደት፦ <strong>የሳምንት ጥቅል</strong></span>
              <span>•</span>
              <span>የሰነድ ቁጥር፦ <strong>AKK-PTAMIS-2017/04</strong></span>
            </div>
          </div>

          {/* 1. KPI Metric Summary Bar */}
          <div className="grid grid-cols-4 gap-2 text-center border-2 border-black p-2 bg-neutral-50">
            <div className="border-r border-neutral-300">
              <div className="text-[10px] text-neutral-600 font-bold uppercase">ጠቅላላ ሁነቶች</div>
              <div className="text-lg font-bold font-mono">{trends.length}</div>
            </div>
            <div className="border-r border-neutral-300">
              <div className="text-[10px] text-emerald-700 font-bold uppercase">አዎንታዊ ዝንባሌዎች</div>
              <div className="text-lg font-bold font-mono text-emerald-800">{positiveTrends.length}</div>
            </div>
            <div className="border-r border-neutral-300">
              <div className="text-[10px] text-rose-700 font-bold uppercase">አፋጣኝ ትኩረት የሚሹ</div>
              <div className="text-lg font-bold font-mono text-rose-800">{urgentTrends.length}</div>
            </div>
            <div>
              <div className="text-[10px] text-amber-700 font-bold uppercase">አሉታዊ ዝንባሌዎች</div>
              <div className="text-lg font-bold font-mono text-amber-800">{negativeTrends.length}</div>
            </div>
          </div>

          {/* 2. Urgent Attention Section (Highest Priority) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 border-b border-black pb-1">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-xs uppercase text-black">
                1. አፋጣኝ ትኩረት እና የአመራር ውሳኔ የሚሹ ጉዳዮች ({urgentTrends.length})
              </h4>
            </div>

            <div className="space-y-1.5">
              {urgentTrends.map((item) => (
                <div key={item.id} className="p-2.5 border border-rose-300 bg-rose-50/50 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-900">{item.title}</span>
                    <span className="font-mono text-[10px] text-neutral-600">{item.woredaName || 'ክ/ከተማ'} • {item.date}</span>
                  </div>
                  <div className="font-bold text-xs text-black">{item.summary}</div>
                  {item.proposedSolution && (
                    <div className="text-[11px] text-neutral-700 italic">
                      <strong>የቀረበ መፍትሔ፦</strong> {item.proposedSolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Negative Trends & Public Grievances */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 border-b border-black pb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-xs uppercase text-black">
                2. አሉታዊ አዝማሚያዎች እና የህዝብ ቅሬታዎች ({negativeTrends.length})
              </h4>
            </div>

            <div className="space-y-1.5">
              {negativeTrends.map((item) => (
                <div key={item.id} className="p-2 border border-neutral-300 bg-neutral-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-neutral-900">{item.title}</span>
                    <span className="font-mono text-[10px] text-neutral-500">{item.woredaName || 'ክ/ከተማ'}</span>
                  </div>
                  <div className="font-semibold text-black">{item.summary}</div>
                  {item.proposedSolution && (
                    <div className="text-[11px] text-neutral-600">
                      <strong>መፍትሄ፦</strong> {item.proposedSolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Positive Trends & Key Successes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 border-b border-black pb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs uppercase text-black">
                3. አበረታች አዎንታዊ ዝንባሌዎችና መልካም ተሞክሮዎች ({positiveTrends.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {positiveTrends.map((item) => (
                <div key={item.id} className="p-2 border border-emerald-200 bg-emerald-50/40 text-xs space-y-0.5">
                  <div className="flex justify-between text-[10px] text-emerald-900 font-bold">
                    <span>{item.title}</span>
                    <span className="font-mono">{item.woredaName || 'ክ/ከተማ'}</span>
                  </div>
                  <div className="text-black font-medium">{item.summary}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. 14 Woredas Reporting Scorecard */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <h4 className="font-bold text-xs uppercase text-black">
              4. የ14ቱ ወረዳዎች የመረጃ ማቅረብ ተሳትፎ
            </h4>
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
              {WOREDAS.map((w) => {
                const count = trends.filter((t) => t.woredaId === w.id).length;
                const hasUrgent = trends.some((t) => t.woredaId === w.id && t.analysisType === 'ትኩረት የሚሻ ዝንባሌ');

                return (
                  <div
                    key={w.id}
                    className={`p-1.5 border ${
                      hasUrgent
                        ? 'border-rose-400 bg-rose-50 text-rose-900 font-bold'
                        : count > 0
                        ? 'border-black bg-neutral-100 text-black font-bold'
                        : 'border-neutral-200 bg-white text-neutral-400'
                    }`}
                  >
                    <div>{w.name}</div>
                    <div className="text-[11px] font-bold">{count} ሁነቶች</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Signoff Box */}
          <div className="pt-6 border-t-2 border-black flex items-center justify-between text-xs">
            <div>
              <div className="font-bold">ያጠናቀረው፦</div>
              <div className="text-neutral-600">የፖለቲካና አቅም ግንባታ ዘርፍ</div>
            </div>
            <div className="text-center">
              <div className="font-bold">ያረጋገጠው፦</div>
              <div className="text-neutral-600">የአቃቂ ቃሊቲ ቅ/ፅ/ቤት ኃላፊ</div>
            </div>
            <div className="border border-dashed border-black px-4 py-2 font-mono text-[10px] text-center">
              [ ይፋዊ ማህተም ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
