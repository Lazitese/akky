import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  ArrowLeft, 
  Download, 
  FileText, 
  Video, 
  Headphones, 
  Image as ImageIcon,
  GraduationCap,
  Newspaper,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  Wifi,
  Smartphone,
  PieChart,
  BarChart3,
  HardDrive
} from 'lucide-react';
import { LibraryCategory, LibraryItem, MediaType } from '../../types/elibrary';
import { User as AuthUser } from '../../types/auth';
import { PartyFlameSwoosh, PartyMottoBanner } from '../brand/PartyFlameAccent';
import { ModernBarChart, ModernDonutChart } from '../charts/ModernSaasCharts';

interface ELibraryDashboardProps {
  currentUser: AuthUser;
  items: LibraryItem[];
  onOpenUploadModal: () => void;
  onOpenReader: (item: LibraryItem) => void;
  onOpenMedia: (item: LibraryItem) => void;
}

export const ELibraryDashboard: React.FC<ELibraryDashboardProps> = ({
  currentUser,
  items,
  onOpenUploadModal,
  onOpenReader,
  onOpenMedia,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | 'all' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | MediaType>('all');

  // The 6 Official Categories requested by user
  const CATEGORIES: {
    key: LibraryCategory;
    title: string;
    description: string;
    icon: any;
  }[] = [
    {
      key: 'የፓርቲው ሰነዶች',
      title: 'የፓርቲው ሰነዶች',
      description: 'መተዳደሪያ ደንብ፣ የፓርቲው ማኒፌስቶ፣ ህገ-ደንቦች እና ይፋዊ የአመራር መመሪያዎች',
      icon: BookOpen,
    },
    {
      key: 'የተለያዩ ጥናቶች ዶክመንት',
      title: 'የተለያዩ ጥናቶች ዶክመንት',
      description: 'የፖሊሲ ጥናቶች፣ ማህበራዊና ኢኮኖሚያዊ ዳሰሳዎች፣ የኑሮ ውድነት እና የገበያ ግምገማዎች',
      icon: LineChart,
    },
    {
      key: 'የስልጠና ዶክመንት',
      title: 'የስልጠና ዶክመንት',
      description: 'የአመራር ክህሎት ማሰልጠኛ ሞጁሎች፣ የማንዋል መመሪያዎች እና የካድሬ ማስተማሪያዎች',
      icon: GraduationCap,
    },
    {
      key: 'የመፅሄት ህትመቶች',
      title: 'የመፅሄት ህትመቶች',
      description: 'ወርሃዊና ሩብ ዓመት የፓርቲ መፅሄቶች፣ የአቃቂ ድምፅ ህትመቶች እና ጋዜጣዊ መግለጫዎች',
      icon: Newspaper,
    },
    {
      key: 'ቪዲዮዎች',
      title: 'ቪዲዮዎች',
      description: 'የአመራር ጉባኤ ንግግሮች፣ የስራ አቅጣጫዎች፣ የኮሪደር ልማት ዶክመንተሪዎች እና የስልጠና ቪዲዮዎች',
      icon: Video,
    },
    {
      key: 'ኦዲዮዎች እና ምስሎች',
      title: 'ኦዲዮዎች እና ምስሎች',
      description: 'የመደመር ፍልስፍና የድምጽ ፖድካስቶች፣ የሬዲዮ ትምህርቶች እና የታሪክና ልማት ፎቶ አልበሞች',
      icon: Headphones,
    },
  ];

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === 'all' ||
      item.category === selectedCategory;

    const matchesMedia =
      mediaFilter === 'all' || item.mediaType === mediaFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorOrPublisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesMedia && matchesSearch;
  });

  // Analytics calculations
  const pdfCount = items.filter((i) => i.mediaType === 'pdf' || i.mediaType === 'document').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;
  const audioCount = items.filter((i) => i.mediaType === 'audio').length;
  const imageCount = items.filter((i) => i.mediaType === 'image').length;

  const totalDownloads = items.reduce((acc, curr) => acc + curr.downloadsCount, 0);
  const totalViews = items.reduce((acc, curr) => acc + curr.viewsCount, 0);

  const recentItems = [...items]
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate) || b.id.localeCompare(a.id))
    .slice(0, 6);

  const getMediaBadge = (type: MediaType) => {
    switch (type) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Video className="w-3 h-3 text-rose-600" /> ቪዲዮ
          </span>
        );
      case 'audio':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Headphones className="w-3 h-3 text-purple-600" /> ኦዲዮ
          </span>
        );
      case 'image':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ImageIcon className="w-3 h-3 text-emerald-600" /> ፎቶ አልበም
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20">
            <FileText className="w-3 h-3 text-[#22177a]" /> PDF / ሰነድ
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card: Branded Deep Navy SaaS Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#11094b] text-white p-6 lg:p-7 shadow-lg shadow-[#22177a]/15 border border-[#3b2c9e]/40">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10 flex items-center justify-end pointer-events-none">
          <PartyFlameSwoosh size="lg" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Module Meta & Header Information */}
          <div className="flex-1">
            {/* Live Status Module Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                ሞጁል 2.5 • ዲጂታል ቤተ-መፅሀፍት
              </span>
            </div>

            {/* Main Title with Gradient Icon & Tag */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-inner shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>ዲጂታል ቤተ-መፅሀፍትና ኢ-ላይብራሪ</span>
              <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                E-Library
              </span>
            </h1>

            {/* Minimal Description */}
            <p className="text-xs sm:text-[13px] text-slate-200/90 mt-1.5 max-w-xl font-normal leading-relaxed">
              የፓርቲ ሰነዶች፣ ፖሊሲዎች፣ ስልጠናዎችና ሚዲያዎች ዲጂታል ማደራጃ።
            </p>

            {/* Feature Capability Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" /> በየትኛውም ቦታ ይሰራል
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" /> ሞባይልና ኮምፒውተር
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                <HardDrive className="w-3.5 h-3.5 text-amber-300" /> ከመስመር ውጭ ዝግጁ
              </span>
            </div>
          </div>

          {/* Right Column: Quick Key Metrics & Action Hub */}
          <div className="flex flex-col lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            {/* Quick Metrics Cluster */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                  <FileText className="w-3 h-3 text-amber-300" /> ሰነዶች
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {items.length} <span className="text-[10px] font-normal text-slate-300">ፋይሎች</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                  <Video className="w-3 h-3 text-rose-300" /> ሚዲያ
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {videoCount + audioCount + imageCount} <span className="text-[10px] font-normal text-slate-300">ክሊፖች</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                  <Eye className="w-3 h-3 text-emerald-300" /> ንባቦች
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {totalViews.toLocaleString()} <span className="text-[10px] font-normal text-slate-300">እይታ</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              {selectedCategory !== null && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition-all shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ወደ ማውጫ</span>
                </button>
              )}
              <button
                onClick={onOpenUploadModal}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-xs sm:text-[13px] font-black hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md group"
              >
                <div className="w-5 h-5 rounded-lg bg-slate-950/15 text-slate-950 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>+ አዲስ ሰነድ / ሚዲያ ጨምር</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="በሰነድ ርዕስ፣ በአሳታሚ፣ በጥናት ወይም በቁልፍ ቃል ፈልግ..."
          className="w-full pl-10 pr-16 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:border-[#22177a] shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            አጽዳ
          </button>
        )}
      </div>

      {/* VIEW 1: Modern SaaS 6 Category Boxes + Recharts + Recent Media */}
      {selectedCategory === null && !searchQuery ? (
        <div className="space-y-5">
          {/* Prosperity Party Motto Banner */}
          <PartyMottoBanner />

          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <span>የላይብራሪው 6ቱ ዋና ዋና ምድቦች</span>
            </h2>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              ሁሉንም ሰነዶች እይ ({items.length})
            </button>
          </div>

          {/* Minimized 6 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const count = items.filter((i) => i.category === cat.key).length;
              const isDarkBrand = idx === 0;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`p-4 text-left transition-all group flex items-center justify-between rounded-2xl shadow-xs relative overflow-hidden ${
                    isDarkBrand
                      ? 'bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white border border-amber-400/40 hover:shadow-xl hover:shadow-[#22177a]/25 hover:-translate-y-1'
                      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:shadow-md hover:border-slate-300 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                        isDarkBrand
                          ? 'border-amber-400/40 bg-[#140d4f] text-amber-400 shadow-inner group-hover:scale-105'
                          : 'border-slate-200 bg-slate-50 text-[#22177a] group-hover:bg-[#22177a] group-hover:text-white group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-xs sm:text-sm group-hover:underline leading-snug ${
                          isDarkBrand ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {cat.title}
                      </h3>
                      <span
                        className={`text-[10.5px] font-bold ${
                          isDarkBrand ? 'text-amber-300' : 'text-slate-500'
                        }`}
                      >
                        {count} ፋይሎችና ሚዲያዎች
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold group-hover:translate-x-1 transition-transform relative z-10 ${
                      isDarkBrand ? 'text-amber-400' : 'text-slate-400 group-hover:text-[#22177a]'
                    }`}
                  >
                    →
                  </span>

                  {isDarkBrand && (
                    <div className="absolute -right-3 -bottom-3 opacity-30 pointer-events-none group-hover:scale-110 transition-transform">
                      <PartyFlameSwoosh size="sm" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Analytics Section: Modern SaaS KPI Numbers & Recharts */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የዲጂታል ቤተ-መፅሀፍት ትንተና (E-Library Analytics)
                  </h3>
                  <p className="text-[11px] text-slate-500">የሰነዶች፣ ቪዲዮዎችና ኦዲዮዎች ዲጂታል ስርጭት</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                ጠቅላላ መጠን፦ ~520 MB
              </span>
            </div>

            {/* 4 Modern Metric Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ጠቅላላ ማህደር</div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{items.length}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-200/60 text-slate-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#22177a] uppercase tracking-wider flex items-center gap-1">
                    <span>ጠቅላላ ውርዶች</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 rounded-full font-bold">ፈጣን</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{totalDownloads}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <span>የንባብ ተጠቃሚዎች</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 rounded-full font-bold">ንቁ</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{totalViews}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span>ከመስመር ውጭ ዝግጁ</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 rounded-full font-bold">100%</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">100%</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Charts Grid: Recharts Donut on Left, Media Reach on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Chart 1: Modern Interactive Donut Chart of Media Formats */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/90 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 tracking-tight">የሚዲያ ቅርጸቶች ስርጭት</h4>
                  <span className="text-[10px] text-slate-500 font-mono">4 ቅርጸቶች</span>
                </div>

                <ModernDonutChart
                  data={[
                    { name: 'PDF / ሰነድ', value: pdfCount, color: '#22177a' },
                    { name: 'ቪዲዮዎች', value: videoCount, color: '#3b82f6' },
                    { name: 'ኦዲዮዎች', value: audioCount, color: '#f59e0b' },
                    { name: 'ፎቶ አልበም', value: imageCount, color: '#10b981' },
                  ]}
                  height={190}
                  centerLabel="ሚዲያዎች"
                  centerCount={items.length}
                />

                {/* Minimal Sleek Legend Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10.5px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#22177a]"></span> PDF / ሰነድ ({pdfCount})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> ቪዲዮዎች ({videoCount})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> ኦዲዮዎች ({audioCount})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> ፎቶ አልበም ({imageCount})
                  </span>
                </div>
              </div>

              {/* Chart 2: Modern Digital Capacity & Offline Availability */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/90 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>የዲጂታል ተደራሽነትና የመረጃ ቋት ጥራት</span>
                    <BarChart3 className="w-4 h-4 text-[#22177a]" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    አመራሩና አባሉ በሞባይልና ኮምፒውተር ያለ ገደብ የሚያገኘው ማህደር።
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>የማውረድ ምጣኔ (Download Velocity)</span>
                      <span className="font-mono text-[#22177a]">በቀን ~180 ውርዶች</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: '92%' }} className="h-full bg-gradient-to-r from-blue-600 to-[#22177a] rounded-full transition-all duration-1000" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>የሞባይልና ከመስመር ውጭ ተስማሚነት</span>
                      <span className="font-mono text-emerald-600">100% ዝግጁ</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: '100%' }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10.5px] text-slate-600 font-medium">
                  <span>በብዛት የተነበበው፦ <strong className="text-slate-800">የብልፅግና መተዳደሪያ ደንብ</strong></span>
                  <span className="text-[#22177a] font-bold">ከፍተኛ ፍላጎት</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads List: Modern SaaS Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    በቅርብ ወደ ላይብራሪው የተጨመሩ ሰነዶችና ሚዲያዎች (Recently Added)
                  </h3>
                  <p className="text-[11px] text-slate-500">የቅርብ ጊዜ ዲጂታል የይዘት ግብአቶች</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                የመጨረሻዎቹ {recentItems.length} ፋይሎች
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3 font-bold">የሰነዱ / የሚዲያው ርዕስ</th>
                    <th className="p-3 font-bold">አሳታሚ / ምንጭ</th>
                    <th className="p-3 font-bold">ምድብ</th>
                    <th className="p-3 font-bold">ቀን</th>
                    <th className="p-3 font-bold text-center">መጠን / ቆይታ</th>
                    <th className="p-3 font-bold text-right">ድርጊት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getMediaBadge(item.mediaType)}
                          <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                          {item.code}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-800 truncate max-w-[140px]">{item.authorOrPublisher}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {item.publishDate}
                      </td>

                      <td className="p-3 whitespace-nowrap text-center font-mono text-xs text-slate-700 font-bold">
                        {item.duration ? item.duration : item.fileSize}
                      </td>

                      <td className="p-3 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => alert(`ፋይል «${item.title}» በማውረድ ላይ ነው...`)}
                            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all"
                            title="ፋይሉን አውርድ"
                          >
                            <Download className="w-3.5 h-3.5 text-[#22177a]" />
                          </button>
                          <button
                            onClick={() => {
                              if (item.mediaType === 'video' || item.mediaType === 'audio' || item.mediaType === 'image') {
                                onOpenMedia(item);
                              } else {
                                onOpenReader(item);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 text-[11px] font-bold transition-all shadow-xs"
                          >
                            {item.mediaType === 'video' || item.mediaType === 'audio' ? 'አጫውት' : 'አንብብ'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: Drilled Down Category Items List (Modern SaaS Cards) */
        <div className="space-y-4 animate-fadeIn">
          
          {/* Breadcrumb / Back Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setMediaFilter('all');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>← ወደ ላይብራሪ ምድቦች ተመለስ</span>
            </button>

            <div className="font-extrabold text-xs text-slate-800 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              {selectedCategory === 'all'
                ? `ሁሉም የላይብራሪ ሰነዶች (${filteredItems.length})`
                : `${selectedCategory || 'የፍለጋ ውጤት'} (${filteredItems.length})`}
            </div>
          </div>

          {/* Media Type Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xs text-xs">
            <span className="font-extrabold text-slate-500 mr-1.5 text-xs">የሚዲያ አይነት፦</span>
            {[
              { key: 'all', label: 'ሁሉም' },
              { key: 'pdf', label: 'ፒዲኤፍ / ሰነድ' },
              { key: 'video', label: 'ቪዲዮዎች' },
              { key: 'audio', label: 'ኦዲዮ / ፖድካስት' },
              { key: 'image', label: 'ምስሎች' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setMediaFilter(f.key as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mediaFilter === f.key
                    ? 'bg-[#22177a] text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">ምንም የተገኘ ሰነድ የለም</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                በዚህ ምድብ የተመዘገበ ፋይል የለም። አዲስ ሰነድ መዝግበው ለሌሎች ያጋሩ።
              </p>
              <button
                onClick={onOpenUploadModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white text-xs font-bold hover:shadow-lg transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>+ አዲስ ሰነድ ጨምር</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 hover:shadow-xl hover:border-slate-300 transition-all duration-300 shadow-xs flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        {getMediaBadge(item.mediaType)}
                        <span className="text-[10.5px] font-mono font-bold text-slate-400">
                          {item.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.publishDate}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => {
                        if (item.mediaType === 'video' || item.mediaType === 'audio' || item.mediaType === 'image') {
                          onOpenMedia(item);
                        } else {
                          onOpenReader(item);
                        }
                      }}
                      className="text-base font-extrabold text-slate-900 group-hover:text-[#22177a] cursor-pointer leading-snug mb-2 transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Publisher */}
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      አሳታሚ / አዘጋጅ፦ <span className="font-normal text-slate-600">{item.authorOrPublisher}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3.5">
                      {item.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mb-3.5 font-medium">
                      {item.pageCount && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                          📄 {item.pageCount} ገፆች
                        </span>
                      )}
                      {item.duration && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                          ⏱️ ቆይታ፡ {item.duration}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                        💾 {item.fileSize}
                      </span>
                      {item.isAvailableOffline && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          ✓ ከመስመር ውጭ ዝግጁ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => alert(`ፋይል «${item.title}» በማውረድ ላይ ነው...`)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-1.5 text-slate-700 shadow-xs transition-all"
                      title="ፋይሉን አውርድ"
                    >
                      <Download className="w-3.5 h-3.5 text-[#22177a]" />
                      <span>አውርድ ({item.fileSize})</span>
                    </button>

                    {item.mediaType === 'video' || item.mediaType === 'audio' || item.mediaType === 'image' ? (
                      <button
                        onClick={() => onOpenMedia(item)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/25 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs hover:-translate-y-0.5 transition-all"
                      >
                        {item.mediaType === 'video' && <Video className="w-3.5 h-3.5 text-amber-400" />}
                        {item.mediaType === 'audio' && <Headphones className="w-3.5 h-3.5 text-amber-400" />}
                        {item.mediaType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
                        <span>አጫውት / ተመልከት →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenReader(item)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/25 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs hover:-translate-y-0.5 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>ክፈትና አንብብ →</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
