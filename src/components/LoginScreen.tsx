import React, { useState } from 'react';
import { ShieldCheck, LogIn, Key, UserCheck, ArrowRight } from 'lucide-react';
import { User, PRESET_USERS } from '../types/auth';
import { PartyFlameRibbon } from './brand/PartyFlameAccent';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PRESET_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (found) {
      onLogin(found);
    } else {
      // Default to Super Admin for any unrecognized login during dev
      onLogin({
        id: `usr-${Date.now()}`,
        name: username.trim() || 'የክ/ከተማ ዋና አስተዳዳሪ',
        username: username.trim() || 'superadmin',
        role: 'SUBCITY_SUPER_ADMIN',
        roleTitleAmharic: 'የክ/ከተማ ዋና አስተዳዳሪ (Super Admin)',
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-black">
      <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl overflow-hidden">
        {/* Official Flame Gradient Ribbon */}
        <PartyFlameRibbon />

        <div className="p-6 space-y-5">
          {/* Emblem & Title */}
          <div className="text-center border-b-2 border-black pb-4">
            <img
              src="/prosperity-logo.png"
              alt="ብልፅግና ፓርቲ"
              className="w-16 h-16 object-contain rounded-full mx-auto mb-2 border border-neutral-300 shadow-sm"
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
              የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ
            </span>
            <h1 className="text-base font-bold text-black tracking-tight mt-0.5">
              አቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ቅ/ፅ/ቤት
            </h1>
            <p className="text-xs text-[#22177a] font-bold mt-1">
              የተቀናጀ የዲጂታል አስተዳደርና ኦፕሬቲንግ ሲስተም
            </p>
            <div className="mt-2 py-1 px-2 bg-neutral-50 border border-neutral-200 text-[10.5px] italic text-neutral-600">
              «ህብረ ብሔራዊ ወንድማማችነት/ እህትማማችነት ለአጠቃላይ ብልፅግና!»
            </div>
          </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-neutral-800 block mb-1">
              የተጠቃሚ ስም (Username)፦
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ለምሳሌ፡ superadmin"
                className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-800 block mb-1">
              የይለፍ ቃል (Password)፦
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none bg-white"
              />
            </div>
          </div>

          {error && <div className="text-xs text-red-600 font-bold">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-[#22177a] hover:bg-[#1a1163] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#191059]"
          >
            <LogIn className="w-4 h-4" />
            <span>ወደ ሲስተሙ ግባ</span>
          </button>
        </form>

        {/* 1-Click Role Switcher / Demo Access */}
        <div className="border-t border-dashed border-neutral-300 pt-4">
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>በቀጥታ በሚና ይግቡ (Demo Access)፦</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {PRESET_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => onLogin(u)}
                className="w-full border border-neutral-300 hover:border-black p-2 text-left bg-neutral-50 hover:bg-white flex items-center justify-between text-xs transition-colors group"
              >
                <div>
                  <div className="font-bold text-black group-hover:underline">
                    {u.roleTitleAmharic}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {u.name} • <span className="font-mono">{u.username}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Security watermark */}
        <div className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-black" />
          <span>ደህንነቱ የተጠበቀ ይፋዊ የፓርቲ መረጃ ቋት</span>
        </div>
      </div>
    </div>
  </div>
  );
};
