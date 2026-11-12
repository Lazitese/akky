import React, { useState } from 'react';
import { X, CheckCircle, MessageSquare, AlertTriangle, ShieldCheck, Camera } from 'lucide-react';
import { TrendItem } from '../../types/trends';
import { User } from '../../types/auth';

interface TrendDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trend: TrendItem | null;
  currentUser: User;
  onUpdateFeedback: (trendId: string, feedback: string, newStatus: TrendItem['status']) => void;
}

export const TrendDetailModal: React.FC<TrendDetailModalProps> = ({
  isOpen,
  onClose,
  trend,
  currentUser,
  onUpdateFeedback,
}) => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const isReviewer = currentUser.role === 'SUBCITY_SUPER_ADMIN' || currentUser.role === 'SUBCITY_SECTOR_ADMIN';

  if (!isOpen || !trend) return null;

  const handleSaveFeedback = (status: TrendItem['status']) => {
    onUpdateFeedback(trend.id, feedbackText.trim() || trend.feedback || '', status);
    onClose();
    setFeedbackText('');
  };

  const getBadgeStyle = (type: TrendItem['analysisType']) => {
    switch (type) {
      case 'በአዎንታዊ የሚታይ ዝንባሌ':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ትኩረት የሚሻ ዝንባሌ':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'በአሉታዊ የሚታይ ዝንባሌ':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200/90 max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold border border-[#22177a]/20 bg-[#22177a]/10 text-[#22177a] px-2 py-0.5 rounded-md">
              {trend.code}
            </span>
            <span className="text-xs font-extrabold text-slate-900 truncate">
              {trend.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Analysis Type Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-xs font-bold border rounded-full inline-flex items-center gap-1.5 shadow-xs ${getBadgeStyle(trend.analysisType)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${trend.analysisType === 'በአዎንታዊ የሚታይ ዝንባሌ' ? 'bg-emerald-500' : trend.analysisType === 'ትኩረት የሚሻ ዝንባሌ' ? 'bg-rose-600' : 'bg-amber-500'}`} />
              <span>{trend.analysisType}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {trend.date} • {trend.time}
            </span>
          </div>

          {/* Scope Info */}
          <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-600">
            <span>ደረጃ፦ <strong className="text-slate-800">{trend.level}</strong> {trend.woredaName && `(${trend.woredaName})`}</span>
            <span>ዘርፍ፦ <strong className="text-slate-800">{trend.sector}</strong></span>
            <span>አቅራቢ፦ <strong className="text-slate-800">{trend.reporterName}</strong></span>
          </div>

          {/* Summary Box */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              ሁኔታ (ዝንባሌ) በአጭሩ፦
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs leading-relaxed">
              {trend.summary}
            </div>
          </div>

          {/* Details */}
          {trend.details && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ዝርዝር ማብራሪያ፦
              </div>
              <p className="p-3 rounded-xl border border-slate-200/90 text-slate-700 leading-relaxed bg-white">
                {trend.details}
              </p>
            </div>
          )}

          {/* Proposed Solution */}
          {trend.proposedSolution && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                የቀረበ የመፍትሄ ሃሳብ፦
              </div>
              <p className="p-3 rounded-xl border border-slate-200/90 text-slate-700 leading-relaxed bg-white">
                {trend.proposedSolution}
              </p>
            </div>
          )}

          {/* Attached Photo Evidence */}
          {trend.photoUrl && (
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>የተያያዘ የፎቶ / የምስል ማስረጃ፦</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
                <img
                  src={trend.photoUrl}
                  alt={trend.summary}
                  className="max-h-64 w-auto object-contain rounded-lg border border-slate-200 shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Existing Feedback */}
          {trend.feedback && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#22177a]" />
                <span>ከክፍለ ከተማው የተሰጠ አቅጣጫ / ግብረ-መልስ፦</span>
              </div>
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 font-medium italic">
                "{trend.feedback}"
              </div>
            </div>
          )}

          {/* Reviewer Action Area */}
          {isReviewer && (
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="font-extrabold text-xs text-slate-800 block">
                የአመራር የስራ መመሪያ / አስተያየት ያክሉ፦
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="ለወረዳው የሚሰጥ አፋጣኝ የስራ መመሪያ ወይም ምላሽ..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 bg-slate-50/50"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSaveFeedback('እርምጃ የተወሰደበት')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-xs"
                >
                  እርምጃ ተወስዷል በል
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveFeedback('ተገምግሟል')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/25 font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>ተገምግሟል & መመሪያ ላክ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
