import React from 'react';
import { Menu, UserCheck } from 'lucide-react';
import { User } from '../types/auth';

import { ActiveModuleType } from './Sidebar';
import { PartyFlameRibbon } from './brand/PartyFlameAccent';

interface HeaderProps {
  onOpenSidebar: () => void;
  currentUser: User;
  onOpenSwitchRole: () => void;
  activeModule: ActiveModuleType;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  currentUser,
  onOpenSwitchRole,
  activeModule,
}) => {
  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dms':
        return 'የሰነድ እና ፋይል ማህደር (DMS)';
      case 'trends':
        return 'የወቅታዊ አዝማሚያና ሁኔታ ትንተና (PTAMIS)';
      case 'ideabank':
        return 'የሀሳብ ባንክ - ብልፅግና ፓርቲ የፅሁፍ ባንክ (Idea Bank)';
      case 'elibrary':
        return 'ዲጂታል ቤተ-መፅሀፍትና ኢ-ላይብራሪ (E-Library)';
      default:
        return 'አቃቂ ቃሊቲ ቅርንጫፍ ፅ/ቤት';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex flex-col shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu + Active Module Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            aria-label="ሜኑ"
          >
            <Menu className="w-4 h-4 text-slate-700" />
          </button>

          <img
            src="/prosperity-logo.png"
            alt="ብልፅግና ፓርቲ"
            className="w-8 h-8 object-contain rounded-full border border-slate-200 md:hidden shadow-xs"
          />

          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-900">
              {getModuleTitle()}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
              <span>አቃቂ ቃሊቲ ቅርንጫፍ ፅ/ቤት</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[#22177a] font-bold">ብልፅግና ፓርቲ</span>
            </p>
          </div>
        </div>

        {/* Right: Modern SaaS User / Role Switcher Pill */}
        <button
          onClick={onOpenSwitchRole}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-xs font-semibold transition-all shadow-xs group"
          title="ተጠቃሚ ለመቀየር ይጫኑ"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-slate-800 group-hover:text-white">{currentUser.name}</span>
          <span className="text-slate-500 group-hover:text-white/80 font-normal hidden sm:inline text-[11px]">
            • {currentUser.roleTitleAmharic}
          </span>
        </button>
      </div>

      {/* Official Prosperity Party Flame Gradient Ribbon */}
      <PartyFlameRibbon />
    </header>
  );
};
