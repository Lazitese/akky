import React from 'react';
import { 
  FolderArchive, 
  TrendingUp,
  Users, 
  UserCheck, 
  CreditCard, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap,
  MessageSquareWarning, 
  Send, 
  Settings, 
  X,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types/auth';
import { PartyFlameRibbon } from './brand/PartyFlameAccent';

export type ActiveModuleType = 'dms' | 'trends' | 'ideabank' | 'elibrary';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLogout: () => void;
  docCount: number;
  trendCount: number;
  ideaCount?: number;
  libraryCount?: number;
  revisionCount: number;
  activeModule: ActiveModuleType;
  onSelectModule: (module: ActiveModuleType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  currentUser,
  onLogout,
  docCount,
  trendCount,
  ideaCount = 4,
  libraryCount = 13,
  revisionCount,
  activeModule,
  onSelectModule,
}) => {
  const isSuperAdmin = currentUser.role === 'SUBCITY_SUPER_ADMIN';

  const menuItems = [
    {
      id: 'dms',
      label: 'የሰነድ ማህደር (DMS)',
      icon: FolderArchive,
      active: true,
      badge: `${docCount}`,
    },
    {
      id: 'trends',
      label: 'አዝማሚያና ሁኔታ ትንተና',
      icon: TrendingUp,
      active: true,
      badge: `${trendCount}`,
    },
    {
      id: 'ideabank',
      label: 'የሀሳብ ባንክ (የፅሁፍ ባንክ)',
      icon: BookOpen,
      active: true,
      badge: `${ideaCount}`,
    },
    {
      id: 'elibrary',
      label: 'ዲጂታል ቤተ-መፅሀፍት (E-Library)',
      icon: GraduationCap,
      active: true,
      badge: `${libraryCount}`,
    },
    {
      id: 'meetings',
      label: 'የስብሰባ አስተዳደር',
      icon: Users,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'hrms',
      label: 'የአባላት መረጃ ቋት',
      icon: UserCheck,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'finance',
      label: 'ፋይናንስና ንብረት',
      icon: CreditCard,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'supervision',
      label: 'የመስክ ምዘና',
      icon: ShieldCheck,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'complaints',
      label: 'የህዝብ ቅሬታ',
      icon: MessageSquareWarning,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'dispatch',
      label: 'ወረቀት-አልባ መላላኪያ',
      icon: Send,
      active: false,
      tag: 'በቅርቡ',
    },
    {
      id: 'settings',
      label: 'ቅንብሮች',
      icon: Settings,
      active: false,
      tag: 'በቅርቡ',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-68 lg:w-72 bg-white/95 backdrop-blur-md border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src="/prosperity-logo.png"
                alt="ብልፅግና ፓርቲ"
                className="w-10 h-10 object-contain rounded-full shadow-sm border border-slate-200 shrink-0 bg-white"
              />
              <div>
                <h1 className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight text-slate-900">
                  አቃቂ ቃሊቲ ቅርንጫፍ
                </h1>
                <p className="text-[10.5px] text-[#22177a] font-bold mt-0.5 flex items-center gap-1">
                  <span>ብልፅግና ፓርቲ</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                  <span className="text-slate-400 font-medium">Prosperity</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 md:hidden hover:bg-slate-100 rounded-lg border border-slate-200"
              aria-label="ዝጋ"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
          <PartyFlameRibbon />

          {/* Current Logged-in User Badge */}
          <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                የአሁኑ መለያ፦
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="font-bold text-xs text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {currentUser.roleTitleAmharic}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-2.5 space-y-1">
            <div className="px-2.5 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              ዋና ዋና ሞጁሎች
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === activeModule;

              return (
                <button
                  key={item.id}
                  disabled={!item.active}
                  onClick={() => {
                    if (item.active) {
                      if (item.id === 'dms' || item.id === 'trends' || item.id === 'ideabank' || item.id === 'elibrary') {
                        onSelectModule(item.id);
                      }
                      setActiveTab('overview');
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#22177a] to-[#2f1b8a] text-white shadow-md shadow-[#22177a]/20 scale-[1.01]'
                      : item.active
                      ? 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                      : 'text-slate-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.tag && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-normal">
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
          {revisionCount > 0 && activeModule === 'dms' && (
            <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{revisionCount} ማሻሻያ የሚሹ ሰነዶች አሉ</span>
            </p>
          )}

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ከሲስተሙ ውጣ (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
