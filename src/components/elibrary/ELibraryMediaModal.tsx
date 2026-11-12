import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Clock, 
  Calendar, 
  FileText, 
  Share2, 
  Maximize2,
  Headphones,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { LibraryItem } from '../../types/elibrary';

interface ELibraryMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LibraryItem | null;
}

export const ELibraryMediaModal: React.FC<ELibraryMediaModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  if (!isOpen || !item) return null;

  const isVideo = item.mediaType === 'video';
  const isAudio = item.mediaType === 'audio';
  const isImage = item.mediaType === 'image';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border-2 border-black max-w-3xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {isVideo && <Video className="w-5 h-5 text-neutral-300" />}
            {isAudio && <Headphones className="w-5 h-5 text-neutral-300" />}
            {isImage && <ImageIcon className="w-5 h-5 text-neutral-300" />}
            <div>
              <div className="text-[10px] font-mono text-neutral-400">
                {item.category} • {item.code}
              </div>
              <h2 className="font-bold text-xs sm:text-sm tracking-tight truncate max-w-md">
                {item.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Player Screen */}
        <div className="p-6 bg-neutral-950 flex flex-col items-center justify-center min-h-[300px]">
          
          {isVideo && (
            <div className="w-full aspect-video bg-neutral-900 border-2 border-neutral-700 relative flex flex-col items-center justify-center group overflow-hidden">
              {/* Video Player Graphic Simulator */}
              <div className="absolute inset-0 bg-radial from-neutral-800 to-black opacity-80" />
              
              <div className="relative z-10 text-center p-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-auto mb-3 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-black" />
                  ) : (
                    <Play className="w-8 h-8 fill-black ml-1" />
                  )}
                </button>
                <div className="text-white font-bold text-sm">
                  {isPlaying ? 'ቪዲዮው እየተጫወተ ነው...' : 'ለማጫወት ይጫኑ'}
                </div>
                <div className="text-neutral-400 text-xs mt-1">
                  የርዝመት መጠን፦ {item.duration || '28:45'} • ጥራት፡ 1080p HD
                </div>
              </div>

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-white text-xs z-10">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-neutral-300">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <Volume2 className="w-4 h-4 text-neutral-400" />
                  <span className="font-mono text-[11px]">04:12 / {item.duration || '28:45'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 border border-neutral-600">
                    HD
                  </span>
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {isAudio && (
            <div className="w-full bg-neutral-900 border-2 border-neutral-700 p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-neutral-800 flex items-center justify-center text-white">
                <Headphones className="w-10 h-10 text-neutral-300" />
              </div>

              <div className="text-center">
                <h3 className="text-white font-bold text-sm">{item.title}</h3>
                <p className="text-neutral-400 text-xs mt-0.5">{item.authorOrPublisher}</p>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="flex items-center gap-1 h-12 w-full max-w-md justify-center px-4">
                {[40, 65, 80, 45, 90, 75, 30, 60, 95, 70, 50, 85, 40, 60, 100, 75, 55, 35, 70, 90, 60, 45].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(20, Math.round(h * Math.random()))}%` : `${h}%` }}
                    className={`w-1.5 transition-all duration-150 ${isPlaying ? 'bg-white' : 'bg-neutral-600'}`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
                </button>

                <div className="flex items-center border border-neutral-700 bg-neutral-800 text-[11px] text-white">
                  <button
                    onClick={() => setPlaybackSpeed(1)}
                    className={`px-2 py-1 ${playbackSpeed === 1 ? 'bg-white text-black font-bold' : ''}`}
                  >
                    1.0x
                  </button>
                  <button
                    onClick={() => setPlaybackSpeed(1.25)}
                    className={`px-2 py-1 ${playbackSpeed === 1.25 ? 'bg-white text-black font-bold' : ''}`}
                  >
                    1.25x
                  </button>
                  <button
                    onClick={() => setPlaybackSpeed(1.5)}
                    className={`px-2 py-1 ${playbackSpeed === 1.5 ? 'bg-white text-black font-bold' : ''}`}
                  >
                    1.5x
                  </button>
                </div>
              </div>
            </div>
          )}

          {isImage && (
            <div className="w-full bg-neutral-900 border-2 border-neutral-700 p-4 flex flex-col items-center">
              <div className="w-full max-h-[380px] bg-neutral-800 border border-neutral-700 flex items-center justify-center p-6 text-center">
                <div>
                  <ImageIcon className="w-16 h-16 mx-auto text-neutral-500 mb-2" />
                  <div className="text-white font-bold text-sm">{item.title}</div>
                  <div className="text-neutral-400 text-xs mt-1">የታሪክና የልማት ፎቶ አልበም ({item.pageCount || 68} ፎቶዎች)</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Media Details & Description */}
        <div className="p-6 bg-white overflow-y-auto space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-base text-black mb-1">{item.title}</h3>
            <p className="text-neutral-700 leading-relaxed">{item.description}</p>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-300 flex flex-wrap items-center justify-between gap-3 text-neutral-700">
            <div>
              <span className="font-bold text-black">አዘጋጅ / ምንጭ፦</span> {item.authorOrPublisher}
            </div>
            <div>
              <span className="font-bold text-black">የወጣበት ቀን፦</span> {item.publishDate}
            </div>
            <div>
              <span className="font-bold text-black">የፋይል መጠን፦</span> {item.fileSize}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex items-center justify-between">
          <button
            onClick={() => alert(`ፋይል «${item.title}» በማውረድ ላይ ነው...`)}
            className="px-3.5 py-1.5 border border-black bg-white hover:bg-neutral-200 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            ፋይሉን አውርድ ({item.fileSize})
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold"
          >
            ዝጋ
          </button>
        </div>

      </div>
    </div>
  );
};
