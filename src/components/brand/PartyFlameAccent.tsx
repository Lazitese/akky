import React from 'react';

interface PartyFlameProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PartyFlameSwoosh: React.FC<PartyFlameProps> = ({ className = '', size = 'md' }) => {
  const dims = size === 'sm' ? { w: 40, h: 50 } : size === 'lg' ? { w: 90, h: 110 } : { w: 60, h: 75 };

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 pointer-events-none ${className}`}
    >
      {/* Outer Cyan / Sky Blue Flame Blade */}
      <path
        d="M85 110C95 80 92 40 70 15C60 40 68 70 60 95C55 105 70 115 85 110Z"
        fill="url(#blueFlameGrad)"
        opacity="0.95"
      />
      {/* Mid Vibrant Royal Azure Blue Flame Blade */}
      <path
        d="M65 115C80 85 75 45 45 10C40 38 48 75 35 100C30 110 50 120 65 115Z"
        fill="#2563eb"
      />
      {/* Vivid Yellow / Amber Gold Flame Blade */}
      <path
        d="M45 120C60 90 55 50 25 5C22 35 30 75 18 105C12 115 32 125 45 120Z"
        fill="url(#goldFlameGrad)"
      />
      {/* Small Inner Bright Lemon Yellow Tip */}
      <path
        d="M30 118C40 95 38 65 18 25C15 50 20 85 10 108C6 115 20 122 30 118Z"
        fill="#fef08a"
      />

      <defs>
        <linearGradient id="blueFlameGrad" x1="60" y1="15" x2="90" y2="115" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#0284c7" />
          <stop offset="1" stopColor="#1e156d" />
        </linearGradient>
        <linearGradient id="goldFlameGrad" x1="20" y1="5" x2="50" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.4" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const PartyFlameRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 via-blue-500 to-[#22177a] shadow-xs ${className}`} />
  );
};

export const PartyMottoBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md p-3 shadow-xs hover:shadow-md transition-all overflow-hidden relative ${className}`}>
      <div className="flex items-center gap-3 z-10">
        <img
          src="/prosperity-logo.png"
          alt="ብልፅግና ፓርቲ"
          className="w-8 h-8 object-contain rounded-full border border-slate-200 shadow-xs"
        />
        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <span className="text-[#22177a] font-extrabold tracking-tight">ብልፅግና ፓርቲ</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-600 font-medium italic hidden sm:inline text-[11.5px]">
            «ህብረ ብሔራዊ ወንድማማችነት/ እህትማማችነት ለአጠቃላይ ብልፅግና!»
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 z-10">
        <span className="text-[10px] font-bold bg-[#22177a] text-white px-3 py-1 rounded-full border border-[#1a1163] shadow-xs">
          አቃቂ ቃሊቲ ቅርንጫፍ
        </span>
      </div>

      {/* Animated Subtle Flame Ribbon flair */}
      <div className="absolute right-0 top-0 bottom-0 w-28 opacity-25 flex items-center justify-end pointer-events-none animate-flameFloat">
        <PartyFlameSwoosh size="md" />
      </div>
    </div>
  );
};
