'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#22177a]/10 text-[#22177a] flex items-center justify-center text-2xl font-black mb-4">
        404
      </div>
      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
        ገጹ አልተገኘም (Page Not Found)
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        የተጠየቀው ገጽ አልተገኘም ወይም ተዘዋውሯል። እባክዎ ወደ ዋናው የአቃቂ ቃሊቲ ዲጂታል ሰነድ ማህደር ዳሽቦርድ ይመለሱ።
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#22177a]/25 transition-all shadow-xs"
      >
        ወደ ዋናው ገጽ ተመለስ (Back to Home)
      </Link>
    </div>
  );
}
