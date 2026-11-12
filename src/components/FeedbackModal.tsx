import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, MessageSquare, Send, Paperclip, Lock, ShieldCheck } from 'lucide-react';
import { DocumentItem, FeedbackEntry } from '../types/dms';
import { User } from '../types/auth';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onAddFeedback: (docId: string, feedback: FeedbackEntry, newStatus?: DocumentItem['status']) => void;
  currentUser: User;
  onReuploadRevised?: (doc: DocumentItem) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  document,
  onAddFeedback,
  currentUser,
  onReuploadRevised,
}) => {
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState<'ማሻሻያ' | 'ማጽደቅ' | 'አስተያየት'>('ማሻሻያ');
  const [attachedFile, setAttachedFile] = useState<string>('');

  if (!isOpen || !document) return null;

  // Strict check: Only Subcity users are approving authorities!
  const isApprover =
    currentUser.role === 'SUBCITY_SUPER_ADMIN' ||
    currentUser.role === 'SUBCITY_SECTOR_ADMIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && decision !== 'ማጽደቅ') return;

    // Submitter response vs Reviewer decision
    const authorRoleText = isApprover
      ? `${currentUser.roleTitleAmharic} (ገምጋሚ/አጽዳቂ)`
      : `${currentUser.roleTitleAmharic} (አቅራቢ)`;

    const newFeedback: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      comment:
        comment.trim() ||
        (decision === 'ማጽደቅ'
          ? 'ሰነዱ ተገምግሞ ያለምንም ቅድመ-ሁኔታ ጸድቋል።'
          : 'ማሻሻያ ያስፈልጋል።'),
      author: currentUser.name,
      authorRole: authorRoleText,
      date: 'ዛሬ',
      attachedFile: attachedFile || undefined,
      actionRequested: isApprover ? decision : 'አስተያየት',
    };

    let newStatus: DocumentItem['status'] = document.status;
    if (isApprover) {
      if (decision === 'ማጽደቅ') {
        newStatus = 'የጸደቀ';
      } else if (decision === 'ማሻሻያ') {
        newStatus = 'ማሻሻያ የተጠየቀበት';
      }
    }

    onAddFeedback(document.id, newFeedback, isApprover ? newStatus : undefined);
    setComment('');
    setAttachedFile('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200/90 max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span>የሰነድ ግብረ-መልስ እና ማሻሻያ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Info Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold border border-[#22177a]/20 bg-[#22177a]/10 text-[#22177a] px-2 py-0.5 rounded-md text-[11px]">
              {document.code}
            </span>
            <span
              className={`px-2.5 py-0.5 text-[10.5px] font-bold rounded-full border inline-flex items-center gap-1 ${
                document.status === 'የጸደቀ'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : document.status === 'ማሻሻያ የተጠየቀበት'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-700 bg-slate-100'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${document.status === 'የጸደቀ' ? 'bg-emerald-500' : document.status === 'ማሻሻያ የተጠየቀበት' ? 'bg-amber-500' : 'bg-slate-400'}`} />
              {document.status}
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{document.title}</h3>
          <p className="text-[11px] text-slate-500">
            አቅራቢ፦ <span className="font-semibold text-slate-700">{document.level === 'ወረዳ' ? document.woredaName : 'ክ/ከተማ'}</span> • {document.sector} • {document.category}
          </p>
        </div>

        {/* Existing Feedback Thread */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5 bg-slate-50/60">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            የተሰጡ አስተያየቶች እና ታሪክ ({document.feedbacks.length})
          </div>

          {document.feedbacks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 bg-white">
              እስካሁን ምንም አይነት ግብረ-መልስ አልተሰጠም።
            </div>
          ) : (
            document.feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-xl border border-slate-200/90 p-3 text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900">{fb.author} ({fb.authorRole})</span>
                  <span className="font-mono text-slate-400 text-[10.5px]">{fb.date}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-sans">{fb.comment}</p>
                {fb.attachedFile && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10.5px] text-slate-700 font-bold">
                    <Paperclip className="w-3 h-3 text-[#22177a]" />
                    <span>አባሪ፦ {fb.attachedFile}</span>
                  </div>
                )}
                <div className="pt-0.5">
                  <span className="text-[10px] font-bold text-[#22177a] bg-[#22177a]/10 px-2 py-0.5 rounded-md font-mono">
                    ውሳኔ፦ {fb.actionRequested}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Action if revision requested and user is woreda uploader */}
          {document.status === 'ማሻሻያ የተጠየቀበት' && onReuploadRevised && (
            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/80 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>ይህ ሰነድ ማሻሻያ ይጠይቃል!</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                የተሰጠውን አስተያየት መሰረት በማድረግ የተስተካከለውን ሰነድ መልሰው ይጫኑ።
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReuploadRevised(document);
                }}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
              >
                የተሻሻለ ሰነድ አሁን ጫን (Re-upload)
              </button>
            </div>
          )}
        </div>

        {/* Action Form: Strictly role-aware */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white space-y-3">
          {isApprover ? (
            /* Approver Decision selection: Only Subcity Admin/Sector can decide */
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22177a]" />
                <span>ይፋዊ የክፍለ ከተማ ውሳኔ ምረጥ፦</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDecision('ማሻሻያ')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    decision === 'ማሻሻያ'
                      ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs ring-1 ring-amber-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>ማሻሻያ እዘዝ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('ማጽደቅ')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    decision === 'ማጽደቅ'
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>አጽድቅ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('አስተያየት')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    decision === 'አስተያየት'
                      ? 'border-blue-400 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>አስተያየት</span>
                </button>
              </div>
            </div>
          ) : (
            /* Woreda submitter restriction banner: CANNOT approve */
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px] text-slate-600 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                የማጽደቅ ስልጣን የክፍለ ከተማው ብቻ ነው። እዚህ ጋር የማብራሪያ አስተያየት ማከል ይችላሉ።
              </span>
            </div>
          )}

          {/* Description box */}
          <div>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isApprover
                  ? 'የማስተካከያ ወይም የውሳኔ አስተያየት ጻፍ...'
                  : 'ለክፍለ ከተማው የሚሰጥ የማብራሪያ ምላሽ...'
              }
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 bg-slate-50/50 resize-none font-sans"
            />
          </div>

          {/* Optional Attachment field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={attachedFile}
              onChange={(e) => setAttachedFile(e.target.value)}
              placeholder="የማረሚያ ፋይል ስም ወይም ሊንክ (አማራጭ)..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 bg-slate-50/50"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/25 rounded-xl flex items-center gap-1.5 shrink-0 transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isApprover ? 'ውሳኔ ላክ' : 'ምላሽ ላክ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
