'use client';

import dynamic from 'next/dynamic';

// Dynamically import App with ssr disabled to avoid any canvas/qr window hydration mismatch
const DynamicApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-sans text-xs font-bold text-neutral-600">
      የአቃቂ ቃሊቲ ዲጂታል ሰነድ ማህደር በመጫን ላይ...
    </div>
  ),
});

export default function Home() {
  return <DynamicApp />;
}
