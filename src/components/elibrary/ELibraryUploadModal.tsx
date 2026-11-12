import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { LibraryCategory, LibraryItem, MediaType } from '../../types/elibrary';
import { User } from '../../types/auth';

interface ELibraryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddItem: (item: LibraryItem) => void;
  defaultCategory?: LibraryCategory;
}

export const ELibraryUploadModal: React.FC<ELibraryUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddItem,
  defaultCategory = 'የፓርቲው ሰነዶች',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LibraryCategory>(defaultCategory);
  const [mediaType, setMediaType] = useState<MediaType>('pdf');
  const [description, setDescription] = useState('');
  const [authorOrPublisher, setAuthorOrPublisher] = useState(
    currentUser.role.includes('SUBCITY') ? 'አቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ' : `${currentUser.woredaName || 'ወረዳ 04'} ብልፅግና ፓርቲ`
  );
  const [tagsInput, setTagsInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>('4.2 MB');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('እባክዎን ርዕስ እና አጭር ማብራሪያ ይሙሉ');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newItem: LibraryItem = {
      id: `lib-${Date.now()}`,
      code: `መፅ-2017-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category,
      mediaType,
      description: description.trim(),
      authorOrPublisher: authorOrPublisher.trim() || 'የብልፅግና ፓርቲ ቅ/ጽ/ቤት',
      publishDate: new Date().toISOString().split('T')[0],
      fileSize: fileSize || '3.5 MB',
      pageCount: mediaType === 'pdf' || mediaType === 'document' ? 42 : undefined,
      duration: mediaType === 'video' || mediaType === 'audio' ? '25:00' : undefined,
      isAvailableOffline: true,
      tags: tags.length > 0 ? tags : ['ሰነድ', 'ኢ-ላይብራሪ'],
      downloadsCount: 0,
      viewsCount: 1,
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border-2 border-black max-w-xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-black text-white flex items-center justify-between border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-neutral-300" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">
                አዲስ የላይብራሪ ሰነድ / ሚዲያ መዝግብ
              </h2>
              <p className="text-[11px] text-neutral-400">
                ዲጂታል ቤተ-መፅሀፍትና ኢ-ላይብራሪ (E-Library Resource Ingestion)
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
          
          {/* Title */}
          <div>
            <label className="block font-bold text-black mb-1">
              የሰነዱ / የሚዲያው ርዕስ <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ለምሳሌ፡ የመደመር ትውልድ የአመራር ክህሎት ማሰልጠኛ ሞጁል..."
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-black mb-1">
                የላይብራሪ ምድብ (Category) <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as LibraryCategory;
                  setCategory(newCat);
                  if (newCat === 'ቪዲዮዎች') setMediaType('video');
                  else if (newCat === 'ኦዲዮዎች እና ምስሎች') setMediaType('audio');
                  else setMediaType('pdf');
                }}
                className="w-full p-2.5 border border-black bg-white focus:ring-1 focus:ring-black focus:outline-hidden font-medium"
              >
                <option value="የፓርቲው ሰነዶች">የፓርቲው ሰነዶች</option>
                <option value="የተለያዩ ጥናቶች ዶክመንት">የተለያዩ ጥናቶች ዶክመንት</option>
                <option value="የስልጠና ዶክመንት">የስልጠና ዶክመንት</option>
                <option value="የመፅሄት ህትመቶች">የመፅሄት ህትመቶች</option>
                <option value="ቪዲዮዎች">ቪዲዮዎች</option>
                <option value="ኦዲዮዎች እና ምስሎች">ኦዲዮዎች እና ምስሎች</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-black mb-1">
                የሚዲያ አይነት (Media Type) <span className="text-red-600">*</span>
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="w-full p-2.5 border border-black bg-white focus:ring-1 focus:ring-black focus:outline-hidden font-medium"
              >
                <option value="pdf">ፒዲኤፍ (PDF Document)</option>
                <option value="document">ዎርድ / ሰነድ (Word Document)</option>
                <option value="video">ቪዲዮ (Video File)</option>
                <option value="audio">ድምፅ / ፖድካስት (Audio/Podcast)</option>
                <option value="image">ምስል / ፎቶ አልበም (Photo Album)</option>
              </select>
            </div>
          </div>

          {/* Author / Publisher */}
          <div>
            <label className="block font-bold text-black mb-1">
              አዘጋጅ / አሳታሚ አካል <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={authorOrPublisher}
              onChange={(e) => setAuthorOrPublisher(e.target.value)}
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-black mb-1">
              አጭር ማብራሪያ (Description) <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="የሰነዱን ይዘት፣ የማጣቀሻ ዓላማውን እና ለየትኛው የአመራር/አባል እርከን እንደተዘጋጀ ይግለጹ..."
              className="w-full p-2.5 border border-black focus:ring-1 focus:ring-black focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* File Picker */}
          <div className="p-3 border border-dashed border-black bg-neutral-50">
            <label className="block font-bold text-black mb-1">
              የፋይል መስቀያ (Upload File)
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-1.5 border border-black bg-white hover:bg-neutral-200 cursor-pointer font-bold inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>ፋይል ምረጥ...</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {fileName ? (
                <div className="flex items-center gap-1.5 text-xs text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span className="font-bold">{fileName}</span>
                  <span className="text-neutral-500">({fileSize})</span>
                </div>
              ) : (
                <span className="text-[11px] text-neutral-500">
                  ፋይል ይምረጡ (PDF, MP4, MP3, DOCX)
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-black mb-1">
              መለያዎች / ታጎች (በነጠላ ሰረዝ ይለዩ)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ለምሳሌ፡ መመሪያ, ስልጠና, መደመር, ፓርቲ"
              className="w-full p-2 border border-black focus:ring-1 focus:ring-black focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
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
              <Upload className="w-4 h-4" />
              በላይብራሪው መዝግብ
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
