import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'አቃቂ ቃሊቲ - የዲጂታል ሰነድ ማህደር (DMS)',
  description: 'የአቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ቅ/ፅ/ቤት ዲጂታል የሰነድና ፋይል ማህደር አስተዳደር ስርዓት',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="am">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-100 text-black antialiased font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
