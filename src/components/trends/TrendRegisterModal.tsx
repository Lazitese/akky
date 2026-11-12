import React, { useState } from 'react';
import { X, Check, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { TrendCategory, TrendAnalysisType, TrendItem, TREND_CATEGORIES, TREND_ANALYSIS_TYPES } from '../../types/trends';
import { User } from '../../types/auth';
import { SECTORS, WOREDAS } from '../../data/mockData';

interface TrendRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrend: (trend: TrendItem) => void;
  currentUser: User;
  prefill?: {
    level?: 'ክፍለ ከተማ' | 'ወረዳ';
    woredaId?: string;
    sector?: string;
  };
}

export const TrendRegisterModal: React.FC<TrendRegisterModalProps> = ({
  isOpen,
  onClose,
  onAddTrend,
  currentUser,
  prefill,
}) => {
  const isWoredaRole = currentUser.role === 'WOREDA_SUPER_ADMIN' || currentUser.role === 'WOREDA_SECTOR_ADMIN';
  const effectiveLevel = isWoredaRole ? 'ወረዳ' : (prefill?.level || 'ወረዳ');
  const effectiveWoredaId = currentUser.woredaId || prefill?.woredaId || 'wor-04';
  const effectiveSector = currentUser.sectorName || prefill?.sector || 'የፖለቲካ ዘርፍ';

  const [title, setTitle] = useState<TrendCategory>(TREND_CATEGORIES[0]);
  const [analysisType, setAnalysisType] = useState<TrendAnalysisType>(TREND_ANALYSIS_TYPES[0]);
  const [summary, setSummary] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [proposedSolution, setProposedSolution] = useState<string>('');
  const [date, setDate] = useState<string>('2017-07-14');
  const [time, setTime] = useState<string>('11:40');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    setPhotoFileName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const selectedWoreda = WOREDAS.find((w) => w.id === effectiveWoredaId);
    const randomCode = Math.floor(100 + Math.random() * 900);
    const newTrend: TrendItem = {
      id: `tr-${Date.now().toString().slice(-4)}`,
      code: `አዝ-2017-${randomCode}`,
      title,
      analysisType,
      summary: summary.trim(),
      details: details.trim() || undefined,
      proposedSolution: proposedSolution.trim() || undefined,
      photoUrl: photoUrl || undefined,
      date,
      time,
      level: effectiveLevel,
      woredaId: effectiveLevel === 'ወረዳ' ? effectiveWoredaId : undefined,
      woredaName: effectiveLevel === 'ወረዳ' ? selectedWoreda?.name : undefined,
      sector: effectiveSector,
      reporterName: `${currentUser.name} (${effectiveLevel === 'ወረዳ' ? (selectedWoreda?.name || 'ወረዳ') : 'ክ/ከተማ'})`,
      status: 'አዲስ የተላከ',
    };

    onAddTrend(newTrend);
    onClose();
    setSummary('');
    setDetails('');
    setProposedSolution('');
    setPhotoUrl('');
    setPhotoFileName('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black inline-block"></span>
            <h3 className="font-bold text-xs text-black">
              የወቅታዊ አዝማሚያና ሁኔታ መረጃ መመዝገቢያ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-neutral-200"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Form Body - Exactly matching the reference image inputs */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Reporter Scope Info */}
          <div className="p-2 border border-black bg-neutral-100 flex items-center justify-between text-[11px] font-mono">
            <span>ደረጃ፦ <strong>{effectiveLevel}</strong> {effectiveLevel === 'ወረዳ' && `(${WOREDAS.find(w => w.id === effectiveWoredaId)?.name})`}</span>
            <span>ዘርፍ፦ <strong>{effectiveSector}</strong></span>
          </div>

          {/* 1. የአዝማሚያ ርዕስ ይምረጡ (Select Trend Title) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              የአዝማሚያ ርዕስ ይምረጡ፦ *
            </label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value as TrendCategory)}
              className="w-full border border-black px-2.5 py-1.5 bg-white font-medium focus:outline-none"
            >
              {TREND_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. የትንተና አይነት ይምረጡ (Select Analysis Type / Severity) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              የትንተና አይነት ይምረጡ፦ *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TREND_ANALYSIS_TYPES.map((type) => {
                const isSelected = analysisType === type;
                let colorClass = 'border-black bg-white text-black';
                if (isSelected) {
                  if (type === 'በአዎንታዊ የሚታይ ዝንባሌ') {
                    colorClass = 'border-black bg-black text-white font-bold';
                  } else if (type === 'ትኩረት የሚሻ ዝንባሌ') {
                    colorClass = 'border-black bg-black text-white font-bold';
                  } else {
                    colorClass = 'border-black bg-black text-white font-bold';
                  }
                }

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAnalysisType(type)}
                    className={`py-2 px-2 text-[11px] border text-center transition-all ${colorClass}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        type === 'በአዎንታዊ የሚታይ ዝንባሌ' ? 'bg-emerald-500' :
                        type === 'ትኩረት የሚሻ ዝንባሌ' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <span>{type}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ሁኔታ (ዝንባሌ) በአጭሩ (Brief Summary) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              ሁኔታ (ዝንባሌ) በአጭሩ፦ *
            </label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="ለምሳሌ፡ ሰራተኛው የስራ ሰዓት ማክበርና ለስራ ዝግጁ መሆን..."
              className="w-full border border-black px-2.5 py-1.5 focus:outline-none text-xs"
            />
          </div>

          {/* Date & Time Grid (Matching reference screenshot) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                የሁነት (የዝንባሌ) ቀን፦
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2017-07-14"
                className="w-full border border-black px-2.5 py-1.5 focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                የሁነት (የዝንባሌ) ሰዓት፦
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="11:40"
                className="w-full border border-black px-2.5 py-1.5 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* 4. ተጨማሪ ዝርዝር ማብራሪያ (Optional Details) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              ዝርዝር ማብራሪያ (ካለ)፦
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ተጨባጭ ሁኔታውን የሚያብራራ ማስታወሻ..."
              className="w-full border border-black px-2.5 py-1.5 focus:outline-none text-xs"
            />
          </div>

          {/* 5. የመፍትሄ ሃሳብ (Proposed Solution) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              የቀረበ የመፍትሄ ሃሳብ (ምክረ-ሃሳብ)፦
            </label>
            <textarea
              rows={2}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder="ሊወሰድ የሚገባው እርምጃ ወይም የመፍትሄ አቅጣጫ..."
              className="w-full border border-black px-2.5 py-1.5 focus:outline-none text-xs"
            />
          </div>

          {/* 6. የምስል / የፎቶ ማስረጃ መጫኛ (Photo Upload) */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              የምስል / የፎቶ ማስረጃ ይጫኑ (አማራጭ)፦
            </label>
            {photoUrl ? (
              <div className="border border-black p-2 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={photoUrl}
                    alt="የተጫነ ፎቶ"
                    className="w-12 h-12 object-cover border border-black"
                  />
                  <div>
                    <div className="font-bold text-black text-xs truncate max-w-[200px]">
                      {photoFileName || 'የተመረጠ ፎቶ'}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ ፎቶው ተመርጧል</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  title="ፎቶውን አስወግድ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-black p-3 text-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Camera className="w-5 h-5 mx-auto text-neutral-600 mb-1" />
                <div className="text-xs font-semibold text-black">
                  ፎቶ ለማንሳት ወይም ከስልክ / ኮምፒውተር ለመምረጥ ይጫኑ
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  የፎቶ ቅርጸት (JPG, PNG) • ከፍተኛ መጠን 5 MB
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-neutral-300 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-black hover:bg-neutral-100 font-bold"
            >
              ይቅር
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ለመመዝገብ ይህንን ይጫኑ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
