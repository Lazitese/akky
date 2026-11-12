import React, { useState } from 'react';
import { X, Send, Paperclip, FileText, CheckCircle2 } from 'lucide-react';
import { IdeaCategory, IdeaItem } from '../../types/ideabank';
import { User } from '../../types/auth';

interface IdeaShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddIdea: (idea: IdeaItem) => void;
}

export const IdeaShareModal: React.FC<IdeaShareModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddIdea,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileSize, setAttachedFileSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      setAttachedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      alert('እባክዎን ርዕስ፣ አጭር ማጠቃለያ እና ሙሉውን ፅሁፍ ይሙሉ');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const isWoreda = currentUser.role.includes('WOREDA');

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      code: `ሀሳብ-2017-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category,
      authorName: currentUser.name,
      authorRole: currentUser.roleTitleAmharic,
      authorLevel: isWoreda ? 'ወረዳ' : 'ክፍለ ከተማ',
      woredaId: currentUser.woredaId,
      sector: currentUser.sectorName,
      summary: summary.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      readTimeMinutes: Math.max(2, Math.ceil(content.trim().split(/\s+/).length / 150)),
      likesCount: 0,
      viewsCount: 1,
      attachmentName: attachedFileName || undefined,
      attachmentSize: attachedFileSize || undefined,
      tags: tags.length > 0 ? tags : ['አዲስ ሀሳብ', 'ብልፅግና'],
      comments: [],
    };

    onAddIdea(newIdea);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border-2 border-black max-w-2xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-black text-white flex items-center justify-between border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-300" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">
                አዲስ ሀሳብ / ጥናታዊ ፅሁፍ ማጋሪያ
              </h2>
              <p className="text-[11px] text-neutral-400">
                የብልፅግና ፓርቲ የፅሁፍ ባንክ (Idea & Article Sharing)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-white border border-neutral-700"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Contributor Info (Readonly) */}
          <div className="p-3 bg-neutral-100 border border-neutral-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-black">አዘጋጅ / ፀሐፊ፦</span> {currentUser.name}
              <span className="text-neutral-600 ml-1">({currentUser.roleTitleAmharic})</span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-black font-bold">
              ቀን፡ {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-black mb-1">
              የሀሳቡ / የፅሁፉ ርዕስ <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ለምሳሌ፡ በአቃቂ ቃሊቲ ኮሪደር ልማት የተፈጠሩ ዕድሎችን ለወጣቶች ስራ የመቀየር ስልት..."
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-black mb-1">
              የሀሳቡ ዘርፍ / ምድብ <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IdeaCategory)}
              className="w-full p-2.5 border border-black bg-white focus:ring-1 focus:ring-black focus:outline-hidden font-medium"
            >
              <option value="የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች">የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች</option>
              <option value="የኢኮኖሚና ልማት ፖሊሲ ሀሳቦች">የኢኮኖሚና ልማት ፖሊሲ ሀሳቦች</option>
              <option value="የማህበራዊና ህዝብ ግንኙነት ጥናቶች">የማህበራዊና ህዝብ ግንኙነት ጥናቶች</option>
              <option value="የመልካም አስተዳደርና አመራር ጥበብ">የመልካም አስተዳደርና አመራር ጥበብ</option>
              <option value="የቴክኖሎጂና አሰራር ፈጠራ">የቴክኖሎጂና አሰራር ፈጠራ</option>
            </select>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-bold text-black mb-1">
              አጭር ማጠቃለያ (Executive Summary) <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="የፅሁፉን ዋና ጭብጥና የሚሰጠውን የመፍትሔ አቅጣጫ በአጭሩ (ከ2-3 ዓረፍተ-ነገር) ይግለጹ..."
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block font-bold text-black mb-1">
              ሙሉ የፅሁፍ ዝርዝር / የሀሳብ ማብራሪያ <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="የችግሩን ምንነት፣ የቀረበውን የመፍትሔ እሳቤ፣ የትግበራ አቅጣጫ እና የሚጠበቁ ውጤቶችን በዝርዝር እዚህ ያጋሩ..."
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden font-sans leading-relaxed"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              ምክር፦ አንቀጾችን ለመለየት ክፍት መስመር (Enter) ይጠቀሙ።
            </p>
          </div>

          {/* Optional Document Attachment */}
          <div className="p-3 border border-dashed border-black bg-neutral-50">
            <label className="block font-bold text-black mb-1">
              ተያያዥ ሙሉ ሰነድ (Optional Attachment - PDF/DOC/PPT)
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-1.5 border border-black bg-white hover:bg-neutral-200 cursor-pointer font-bold inline-flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                <span>ሰነድ ምረጥ...</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {attachedFileName ? (
                <div className="flex items-center gap-1.5 text-xs text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span className="font-bold">{attachedFileName}</span>
                  <span className="text-neutral-500">({attachedFileSize})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFileName(null);
                      setAttachedFileSize(null);
                    }}
                    className="text-red-600 underline ml-2 font-bold"
                  >
                    አስወግድ
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-neutral-500">
                  ምንም ሰነድ አልተመረጠም
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-black mb-1">
              መለያዎች / ቁልፍ ቃላት (በነጠላ ሰረዝ ይለዩ)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ለምሳሌ፡ ኮሪደር ልማት, ወጣቶች, ስራ ዕድል, ኢኮኖሚ"
              className="w-full p-2 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-black bg-white hover:bg-neutral-100 font-bold"
            >
              ይቅር
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white hover:bg-neutral-800 font-bold inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              ሀሳቡን አጋራ
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
