import React, { useState } from 'react';
import { X, BookOpen, Download, MessageSquare, ThumbsUp, Eye, Calendar, User, Tag, Share2, Printer } from 'lucide-react';
import { IdeaItem, IdeaComment } from '../../types/ideabank';
import { User as AuthUser } from '../../types/auth';

interface IdeaReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: IdeaItem | null;
  currentUser: AuthUser;
  onAddComment: (ideaId: string, comment: IdeaComment) => void;
  onToggleLike: (ideaId: string) => void;
}

export const IdeaReaderModal: React.FC<IdeaReaderModalProps> = ({
  isOpen,
  onClose,
  idea,
  currentUser,
  onAddComment,
  onToggleLike,
}) => {
  const [commentText, setCommentText] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [hasLiked, setHasLiked] = useState(false);

  if (!isOpen || !idea) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: IdeaComment = {
      id: `c-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.roleTitleAmharic,
      comment: commentText.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddComment(idea.id, newComment);
    setCommentText('');
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
    onToggleLike(idea.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTextClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base leading-relaxed';
      case 'xlarge':
        return 'text-lg leading-loose';
      default:
        return 'text-sm leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border-2 border-black max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-300" />
            <div>
              <div className="text-[11px] font-mono text-neutral-400">
                የብልፅግና ፓርቲ የፅሁፍ ባንክ • {idea.code}
              </div>
              <h2 className="font-bold text-sm tracking-tight truncate max-w-md sm:max-w-xl">
                {idea.category}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center border border-neutral-700 bg-neutral-800 rounded-xs text-xs">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 ${fontSize === 'normal' ? 'bg-white text-black font-bold' : 'text-neutral-300'}`}
                title="መደበኛ የፊደል መጠን"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 ${fontSize === 'large' ? 'bg-white text-black font-bold' : 'text-neutral-300'}`}
                title="ትልቅ የፊደል መጠን"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 ${fontSize === 'xlarge' ? 'bg-white text-black font-bold' : 'text-neutral-300'}`}
                title="በጣም ትልቅ የፊደል መጠን"
              >
                A++
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 border border-neutral-700 hover:bg-neutral-800 text-neutral-200"
              title="አትም"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600"
              aria-label="ዝጋ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Article Title & Metadata */}
          <div className="border-b-2 border-black pb-5">
            <div className="inline-block px-2.5 py-0.5 border border-black bg-neutral-100 text-black text-xs font-bold mb-2">
              {idea.category}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black leading-tight mb-4">
              {idea.title}
            </h1>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-1.5 font-bold text-black">
                <User className="w-4 h-4" />
                <span>{idea.authorName}</span>
                <span className="font-normal text-neutral-600">({idea.authorRole})</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <Calendar className="w-3.5 h-3.5" />
                <span>{idea.date}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <span>⏱️ {idea.readTimeMinutes} ደቂቃ ንባብ</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <Eye className="w-3.5 h-3.5" />
                <span>{idea.viewsCount} ዕይታዎች</span>
              </div>
            </div>
          </div>

          {/* Abstract / Summary Callout */}
          <div className="p-4 bg-neutral-50 border-l-4 border-black border-y border-r border-neutral-300">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              አጭር ማጠቃለያ (Executive Summary)፦
            </div>
            <p className="text-sm font-medium text-neutral-900 leading-relaxed italic">
              «{idea.summary}»
            </p>
          </div>

          {/* Full Article Content */}
          <div className={`text-neutral-900 space-y-4 font-serif ${getTextClass()}`}>
            {idea.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-sans font-bold text-base text-black mt-6 mb-2 border-b border-neutral-300 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-neutral-400 font-sans my-2 text-neutral-800">
                    {paragraph}
                  </div>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Attachment Download Box (if present) */}
          {idea.attachmentName && (
            <div className="p-4 border-2 border-dashed border-black bg-neutral-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-black bg-white flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="font-bold text-xs text-black">
                    ተያያዥ ሙሉ ጥናታዊ ሰነድ፦ {idea.attachmentName}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    መጠን፦ {idea.attachmentSize || '1.8 MB'} • ለንባብና ለማውረድ ዝግጁ
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert(`ሰነድ «${idea.attachmentName}» በማውረድ ላይ ነው...`)}
                className="px-3.5 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                ሰነዱን አውርድ
              </button>
            </div>
          )}

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t border-neutral-200">
              <Tag className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-xs font-bold text-neutral-600">መለያዎች፦</span>
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar (Like / Feedback count) */}
          <div className="p-3 bg-neutral-100 border border-black flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`px-3 py-1.5 border border-black text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                hasLiked ? 'bg-black text-white' : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>ጠቃሚ ሀሳብ ነው ({idea.likesCount + (hasLiked ? 1 : 0)})</span>
            </button>

            <div className="text-xs text-neutral-600 font-medium">
              {idea.comments.length} የአመራርና አባላት አስተያየቶች
            </div>
          </div>

          {/* Comments / Constructive Discussions Section */}
          <div className="border-t-2 border-black pt-6 space-y-4">
            <h3 className="font-bold text-sm text-black flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              የአመራርና የአባላት ውይይት / ገንቢ አስተያየቶች ({idea.comments.length})
            </h3>

            {/* New Comment Input */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`${currentUser.name} (${currentUser.roleTitleAmharic})፣ በዚህ ሀሳብ ላይ ያለዎትን ገንቢ አስተያየት ወይም ማሻሻያ እዚህ ይጻፉ...`}
                rows={3}
                className="w-full p-3 border border-black text-xs focus:ring-1 focus:ring-black focus:outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-40 text-xs font-bold"
                >
                  አስተያየት አጋራ
                </button>
              </div>
            </form>

            {/* Comments List */}
            {idea.comments.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">
                እስካሁን የተሰጠ አስተያየት የለም። የመጀመሪያውን ገንቢ አስተያየት እርስዎ ያጋሩ!
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                {idea.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-neutral-50 border border-neutral-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black">{c.author}</span>
                      <span className="text-[10px] text-neutral-500">{c.date}</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 font-medium">{c.role}</div>
                    <p className="text-neutral-800 pt-1 leading-relaxed">{c.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex justify-between items-center text-xs">
          <span className="text-neutral-600">
            አቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ • የፅሁፍና ሀሳብ ባንክ
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-black bg-white hover:bg-neutral-200 font-bold"
          >
            ዝጋ
          </button>
        </div>

      </div>
    </div>
  );
};
