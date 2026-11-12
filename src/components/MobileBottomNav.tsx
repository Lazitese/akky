import React from 'react';
import { 
  LayoutDashboard, 
  FolderArchive, 
  FileText, 
  MessageSquare, 
  Menu 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSidebar: () => void;
  revisionCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  revisionCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-black z-40 md:hidden flex items-center justify-around px-1">
      {/* 1. Dashboard / Overview */}
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 ${
          activeTab === 'overview'
            ? 'text-black font-bold'
            : 'text-neutral-500 hover:text-black'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">ዳሽቦርድ</span>
      </button>

      {/* 2. File Boxes */}
      <button
        onClick={() => setActiveTab('boxes')}
        className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 ${
          activeTab === 'boxes'
            ? 'text-black font-bold'
            : 'text-neutral-500 hover:text-black'
        }`}
      >
        <FolderArchive className="w-5 h-5" />
        <span className="text-[10px]">ፋይል ቦክስ</span>
      </button>

      {/* 3. Document Repository */}
      <button
        onClick={() => setActiveTab('documents')}
        className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 ${
          activeTab === 'documents'
            ? 'text-black font-bold'
            : 'text-neutral-500 hover:text-black'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px]">ሰነዶች</span>
      </button>

      {/* 4. Feedback & Approvals */}
      <button
        onClick={() => setActiveTab('feedbacks')}
        className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 relative ${
          activeTab === 'feedbacks'
            ? 'text-black font-bold'
            : 'text-neutral-500 hover:text-black'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {revisionCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {revisionCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">ግብረ-መልስ</span>
      </button>

      {/* 5. The 5th item: Hamburger Menu (Opens Full Sidebar) */}
      <button
        onClick={onOpenSidebar}
        className="flex-1 py-1 flex flex-col items-center justify-center gap-1 text-neutral-800 hover:text-black"
        aria-label="ሁሉንም ሜኑ ክፈት"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px]">ተጨማሪ</span>
      </button>
    </nav>
  );
};
