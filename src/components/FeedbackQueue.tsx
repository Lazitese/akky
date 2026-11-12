import React from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, ArrowRight, Upload, Lock, ShieldCheck } from 'lucide-react';
import { DocumentItem } from '../types/dms';
import { User } from '../types/auth';

interface FeedbackQueueProps {
  documents: DocumentItem[];
  onOpenFeedback: (doc: DocumentItem) => void;
  onReuploadRevised: (doc: DocumentItem) => void;
  currentUser: User;
}

export const FeedbackQueue: React.FC<FeedbackQueueProps> = ({
  documents,
  onOpenFeedback,
  onReuploadRevised,
  currentUser,
}) => {
  const isApprover =
    currentUser.role === 'SUBCITY_SUPER_ADMIN' ||
    currentUser.role === 'SUBCITY_SECTOR_ADMIN';

  const revisionDocs = documents.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት');
  const reviewDocs = documents.filter((d) => d.status === 'በግምገማ ላይ');

  return (
    <div className="space-y-4">
      {/* Overview stats header */}
      <div className="border-b-2 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
            <span>የሰነድ ግብረ-መልስ እና ማሻሻያ መከታተያ</span>
            <span className="text-xs px-2 py-0.5 border border-black bg-neutral-100 font-mono">
              {isApprover ? 'የውሳኔ መስጫ ዴስክ' : 'የአቅራቢ ክትትል ዴስክ'}
            </span>
          </h2>
          <p className="text-xs text-neutral-600">
            {isApprover
              ? 'ከወረዳዎች የቀረቡ ሰነዶችን መገምገሚያ፣ ማጽደቂያ እና ማሻሻያ ማዘዣ'
              : `የ${currentUser.woredaName || 'ወረዳው'} ሰነዶች የደረሱበት ደረጃ እና የተሰጡ አስተያየቶች`}
          </p>
        </div>

        <div className="text-[11px] font-mono text-neutral-600">
          የተፈቀደ ወሰን፦ <strong>{currentUser.roleTitleAmharic}</strong>
        </div>
      </div>

      {/* Action Notification Banner */}
      {revisionDocs.length > 0 && (
        <div className="border-2 border-black bg-neutral-100 p-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-black">
                {revisionDocs.length} ሰነድ ማሻሻያ ተጠይቆበታል!
              </div>
              <p className="text-[11px] text-neutral-700">
                {isApprover
                  ? 'እነዚህ ሰነዶች ማሻሻያ እንዲደረግባቸው ለወረዳዎች ተመልሰዋል፤ መልሰው ሲጭኑ ይገመገማሉ።'
                  : 'የክፍለ ከተማው ዘርፍ የሰጠውን የማስተካከያ አስተያየት አይተው የተሻሻለውን ሰነድ በድጋሚ ይጫኑ።'}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-black text-white shrink-0">
            አስቸኳይ
          </span>
        </div>
      )}

      {/* Columns: 1. ማሻሻያ የተጠየቀባቸው, 2. በግምገማ ላይ ያሉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Revision Needed */}
        <div className="border-2 border-black bg-white p-3 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-black">
              <AlertCircle className="w-4 h-4" />
              <span>ማሻሻያ የተጠየቀባቸው ሰነዶች ({revisionDocs.length})</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 bg-black text-white font-mono font-bold">
              {revisionDocs.length}
            </span>
          </div>

          <div className="space-y-2">
            {revisionDocs.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-xs border border-dashed border-neutral-300">
                ምንም ማሻሻያ የተጠየቀበት ሰነድ የለም።
              </div>
            ) : (
              revisionDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-black p-3 space-y-2 bg-neutral-50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold">{doc.code}</span>
                    <span className="text-neutral-500">{doc.uploadDate}</span>
                  </div>

                  <h4 className="font-bold text-xs text-black">{doc.title}</h4>
                  <div className="text-[11px] text-neutral-600">
                    {doc.sector} | {doc.woredaName || 'ክ/ከተማ'}
                  </div>

                  {/* Latest Feedback Note */}
                  {doc.feedbacks.length > 0 && (
                    <div className="bg-white border border-neutral-300 p-2 text-xs">
                      <div className="text-[10px] font-bold text-neutral-500 mb-0.5">
                        የተሰጠ አስተያየት፦
                      </div>
                      <p className="text-neutral-800 text-[11px] italic">
                        "{doc.feedbacks[doc.feedbacks.length - 1].comment}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 border-t border-neutral-200">
                    {!isApprover && (
                      <button
                        onClick={() => onReuploadRevised(doc)}
                        className="flex-1 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center justify-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>የተሻሻለ ፋይል ጫን</span>
                      </button>
                    )}
                    <button
                      onClick={() => onOpenFeedback(doc)}
                      className={`${
                        isApprover ? 'w-full' : 'px-3'
                      } py-1.5 border border-black text-xs font-semibold hover:bg-neutral-100 flex items-center justify-center gap-1`}
                      title="ግብረ-መልስ ተመልከት"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isApprover ? 'ውሳኔ አስተካክል / ታሪክ' : 'ታሪክ'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Under Review */}
        <div className="border-2 border-black bg-white p-3 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-black">
              <CheckCircle2 className="w-4 h-4" />
              <span>በግምገማ ላይ ያሉ ሰነዶች ({reviewDocs.length})</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-200 border border-black font-mono font-bold">
              {reviewDocs.length}
            </span>
          </div>

          <div className="space-y-2">
            {reviewDocs.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-xs border border-dashed border-neutral-300">
                ምንም በግምገማ ላይ ያለ ሰነድ የለም።
              </div>
            ) : (
              reviewDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-neutral-300 p-3 space-y-2 bg-white hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold">{doc.code}</span>
                    <span className="text-neutral-500">{doc.uploadDate}</span>
                  </div>

                  <h4 className="font-bold text-xs text-black">{doc.title}</h4>
                  <div className="text-[11px] text-neutral-600">
                    {doc.sector} | {doc.woredaName || 'ክ/ከተማ'} | {doc.category}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-200">
                    <button
                      onClick={() => onOpenFeedback(doc)}
                      className="px-3 py-1 bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-1"
                    >
                      <span>{isApprover ? 'ገምግም እና ውሳኔ ስጥ' : 'ሁኔታውን ተመልከት'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
