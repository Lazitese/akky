import React from 'react';
import { X, UserCheck, CheckCircle2 } from 'lucide-react';
import { User, PRESET_USERS } from '../types/auth';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-sm w-full shadow-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <UserCheck className="w-4 h-4" />
            <span>የተጠቃሚ ሚና ቀይር</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-neutral-200"
            aria-label="ዝጋ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-600">
          የተለያዩ የመዋቅር እርከኖችን (ክፍለ ከተማ፣ ዘርፎች፣ ወረዳዎች) አሰራር ለመመልከት ሚና ይምረጡ፦
        </p>

        <div className="space-y-1.5">
          {PRESET_USERS.map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`w-full p-2.5 text-left border text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'border-2 border-black bg-neutral-100 font-bold'
                    : 'border-neutral-300 hover:border-black hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="text-black">{u.roleTitleAmharic}</div>
                  <div className="text-[10px] text-neutral-500">{u.name}</div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-black" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-neutral-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 border border-black text-xs font-bold hover:bg-neutral-100"
          >
            ዝጋ
          </button>
        </div>
      </div>
    </div>
  );
};
