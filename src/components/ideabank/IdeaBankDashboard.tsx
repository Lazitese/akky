import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Download, 
  User, 
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Landmark,
  Cpu,
  Share2,
  PieChart,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { IdeaCategory, IdeaItem } from '../../types/ideabank';
import { User as AuthUser } from '../../types/auth';
import { PartyFlameSwoosh, PartyMottoBanner } from '../brand/PartyFlameAccent';
import { ChartPieDonutActive } from '../charts/ChartPieDonutActive';
import { ChartBarMultiple } from '../charts/ChartBarMultiple';

interface IdeaBankDashboardProps {
  currentUser: AuthUser;
  ideas: IdeaItem[];
  onOpenShareModal: () => void;
  onOpenReader: (idea: IdeaItem) => void;
}

export const IdeaBankDashboard: React.FC<IdeaBankDashboardProps> = ({
  currentUser,
  ideas,
  onOpenShareModal,
  onOpenReader,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | 'all' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Categories config
  const CATEGORIES: {
    key: IdeaCategory;
    title: string;
    description: string;
    icon: any;
  }[] = [
    {
      key: 'የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች',
      title: 'የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች',
      description: 'የመደመር ፍልስፍና፣ የአባላት ግንባታ፣ የካድሬዎች ሚና እና የፓርቲ ርዕዮተ-ዓለም ግንዛቤ ማሳደጊያ ፅሁፎች',
      icon: Landmark,
    },
    {
      key: 'የኢኮኖሚና ልማት ፖሊሲ ሀሳቦች',
      title: 'የኢኮኖሚና ልማት ፖሊሲ ሀሳቦች',
      description: 'የኮሪደር ልማት፣ የኑሮ ውድነት መቋቋሚያ፣ የስራ ዕድል ፈጠራ እና የገበያ መረጋጋት የፖሊሲ ሀሳቦች',
      icon: TrendingUp,
    },
    {
      key: 'የማህበራዊና ህዝብ ግንኙነት ጥናቶች',
      title: 'የማህበራዊና ህዝብ ግንኙነት ጥናቶች',
      description: 'የህዝብ ተሳትፎ፣ የከተማ ግብርና፣ የሴቶችና ወጣቶች ንቅናቄ እና የማህበረሰብ አንድነት ጥናታዊ ሰነዶች',
      icon: Sparkles,
    },
    {
      key: 'የመልካም አስተዳደርና አመራር ጥበብ',
      title: 'የመልካም አስተዳደርና አመራር ጥበብ',
      description: 'የአመራር ልህቀት፣ የአገልግሎት አሰጣጥ ማሻሻያ እና የፍትሐዊነት አሰራር ማጎልበቻ ፅሁፎች',
      icon: Layers,
    },
    {
      key: 'የቴክኖሎጂና አሰራር ፈጠራ',
      title: 'የቴክኖሎጂና አሰራር ፈጠራ',
      description: 'ዲጂታላይዜሽን፣ የስራ ቅልጥፍና፣ የዲጂታል ቅሬታ አፈታት እና የቴክኖሎጂ አጠቃቀም ፈጠራዎች',
      icon: Cpu,
    },
  ];

  // Filtered ideas
  const filteredIdeas = ideas.filter((item) => {
    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === 'all' ||
      item.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Analytics Calculations
  const totalViews = ideas.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const totalLikes = ideas.reduce((acc, curr) => acc + curr.likesCount, 0);
  const totalComments = ideas.reduce((acc, curr) => acc + curr.comments.length, 0);
  const recentIdeas = [...ideas]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card: Dignified Executive Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#18134b] text-white p-7 lg:p-8 border border-[#2e267d] shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Clean, uncluttered executive header */}
          <div className="flex-1 max-w-2xl">
            {/* Element 1: Status Module Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>ሞጁል 2.4 • የእውቀትና ሀሳብ ባንክ</span>
            </div>

            {/* Element 2: Commanding Title with Branded Icon Box */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>የእውቀትና ሀሳብ ባንክ</span>
            </h1>

            {/* Element 3: Purpose Subtitle */}
            <p className="text-sm text-slate-200 mt-2 font-normal leading-relaxed">
              የአመራሮችና አባላት የፖሊሲ፣ ኢኮኖሚና ማህበራዊ ሀሳቦች መጋሪያ
            </p>
          </div>

          {/* Right Column: Purposeful Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {selectedCategory !== null && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-xs sm:text-sm font-bold hover:bg-white/20 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ወደ ማውጫ</span>
              </button>
            )}
            <button
              onClick={onOpenShareModal}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>አዲስ ሀሳብ / ፅሁፍ አጋራ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="በርዕስ፣ በፀሐፊ፣ በወረዳ ወይም በቁልፍ ቃል እዚህ ፈልግ..."
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

      {/* VIEW 1: Modern SaaS Category Boxes + Recharts + Recent Ideas */}
      {selectedCategory === null && !searchQuery ? (
        <div className="space-y-5">
          {/* Prosperity Party Motto Banner */}
          <PartyMottoBanner />

          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <span>የሀሳብ ባንክ 5ቱ ዋና ዋና ምድቦች</span>
            </h2>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              ሁሉንም ፅሁፎች እይ ({ideas.length})
            </button>
          </div>

          {/* Minimized 5 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const count = ideas.filter((i) => i.category === cat.key).length;
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
                        {count} ፅሁፎችና ጥናቶች
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
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የዕውቀትና ሀሳብ ባንክ ትንተና
                  </h3>
                  <p className="text-[11px] text-slate-500">የጥናት ፅሁፎችና የአንባቢዎች ተሳትፎ ዳታ</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                አማካይ ንባብ፦ ~3.8 ደቂቃ
              </span>
            </div>

            {/* 4 Modern Metric Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ጠቅላላ ፅሁፎች</div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{ideas.length}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-200/60 text-slate-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#22177a] uppercase tracking-wider flex items-center gap-1">
                    <span>ጠቅላላ አንባቢዎች</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 rounded-full font-bold">ንቁ</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{totalViews}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <span>የአመራር ድጋፍ</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 rounded-full font-bold">❤️</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{totalLikes}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span>የውይይት አስተያየት</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 rounded-full font-bold">ውይይት</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">{totalComments}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Visual Analytics Suite: Mixed 2 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              <ChartPieDonutActive
                title="የፅሁፎችና ሀሳቦች ስርጭት በዘርፍ"
                description="የፖለቲካ፣ ኢኮኖሚ፣ ማህበራዊና ቴክኖሎጂ ጥናቶች"
                data={CATEGORIES.map((cat, idx) => {
                  const count = ideas.filter((i) => i.category === cat.key).length;
                  const colors = ['#22177a', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                  const keys = ['politics', 'economy', 'social', 'tech', 'leadership'];
                  return {
                    category: keys[idx] || `cat-${idx}`,
                    count: count || (idx + 1) * 3,
                    fill: colors[idx % colors.length],
                  };
                })}
                config={{
                  count: { label: 'የፅሁፎች ብዛት' },
                  politics: { label: 'ፖለቲካ', color: '#22177a' },
                  economy: { label: 'ኢኮኖሚ', color: '#3b82f6' },
                  social: { label: 'ማህበራዊ', color: '#f59e0b' },
                  tech: { label: 'ቴክኖሎጂ', color: '#10b981' },
                  leadership: { label: 'አመራር ጥበብ', color: '#8b5cf6' },
                }}
                footerTrend="በዚህ ወር የጥናቶች ምደባ በ 4.8% አድጓል"
                footerSubtitle="ያለፉት 6 ወራት የዕውቀት ማህደር ስርጭት"
              />

              <ChartBarMultiple
                title="የሀሳቦችና ጥናቶች ወርሃዊ ዝውውር"
                description="የአባላትና አመራሩ ንባብ እና የተጋሩ አዳዲስ ጥናቶች"
                footerTrend="የንባብ ተሳትፎ በ 6.4% ጨምሯል"
                footerSubtitle="ያለፉት 6 ወራት የወርሃዊ ጥናቶች ንጽጽር"
              />
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
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የቅርብ ጊዜ የተጋሩ ሀሳቦችና ጥናቶች
                  </h3>
                  <p className="text-[11px] text-slate-500">የአባላትና የአመራር ጥናታዊ ፅሁፎች</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                የመጨረሻዎቹ {recentIdeas.length} ፅሁፎች
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3 font-bold">የሀሳቡ / ፅሁፉ ርዕስ</th>
                    <th className="p-3 font-bold">አዘጋጅ / ፀሐፊ</th>
                    <th className="p-3 font-bold">ምድብ</th>
                    <th className="p-3 font-bold">ቀን</th>
                    <th className="p-3 font-bold text-center">ተሳትፎ</th>
                    <th className="p-3 font-bold text-right">ድርጊት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentIdeas.map((idea) => (
                    <tr key={idea.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md" title={idea.title}>
                          {idea.title}
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                          {idea.code} • ⏱️ {idea.readTimeMinutes} ደቂቃ ንባብ
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{idea.authorName}</div>
                        <div className="text-[10.5px] text-slate-500 truncate max-w-[140px]">{idea.authorRole}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                          {idea.category.replace('የ', '').replace(' እሳቤዎች', '').replace(' ሀሳቦች', '').replace(' ጥናቶች', '')}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {idea.date}
                      </td>

                      <td className="p-3 whitespace-nowrap text-center text-xs">
                        <span className="font-bold text-slate-800">{idea.likesCount} ወደዋል</span>
                        <span className="text-slate-300 mx-1.5">•</span>
                        <span className="text-slate-500">{idea.viewsCount} ዕይታ</span>
                      </td>

                      <td className="p-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => onOpenReader(idea)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-xs"
                        >
                          <span>አንብብ →</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: Drilled Down Articles List (Modern SaaS Cards) */
        <div className="space-y-4 animate-fadeIn">
          
          {/* Breadcrumb / Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>← ወደ ምድቦች ተመለስ</span>
            </button>

            <div className="font-extrabold text-xs text-slate-800 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              {selectedCategory === 'all'
                ? `ሁሉም ፅሁፎች (${filteredIdeas.length})`
                : `${selectedCategory || 'የፍለጋ ውጤት'} (${filteredIdeas.length})`}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">ምንም የተገኘ ፅሁፍ የለም</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                በዚህ ምድብ ወይም የፍለጋ ቃል እስካሁን የተመዘገበ ሀሳብ የለም። እርስዎ የመጀመሪያውን ሀሳብ ያጋሩ!
              </p>
              <button
                onClick={onOpenShareModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white text-xs font-bold hover:shadow-lg transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>+ አዲስ ሀሳብ አጋራ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 hover:shadow-xl hover:border-slate-300 transition-all duration-300 shadow-xs flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20 text-[11px] font-bold">
                          {idea.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {idea.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {idea.date}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-bold text-[10.5px]">
                          ⏱️ {idea.readTimeMinutes} ደቂቃ ንባብ
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => onOpenReader(idea)}
                      className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#22177a] cursor-pointer leading-tight mb-2 transition-colors"
                    >
                      {idea.title}
                    </h2>

                    {/* Author badge */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                      <div className="w-6 h-6 rounded-full bg-[#22177a] text-white flex items-center justify-center text-[10px] font-bold">
                        {idea.authorName.charAt(0)}
                      </div>
                      <span>{idea.authorName}</span>
                      <span className="font-medium text-slate-500">
                        • {idea.authorRole} ({idea.authorLevel})
                      </span>
                    </div>

                    {/* Summary Excerpt */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {idea.summary}
                    </p>

                    {/* Tags */}
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {idea.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10.5px] text-slate-600 border border-slate-200/80 font-bold hover:bg-slate-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action Row */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        {idea.likesCount} ወደዋል
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        {idea.comments.length} አስተያየቶች
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {idea.viewsCount} ዕይታዎች
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {idea.attachmentName && (
                        <button
                          onClick={() => alert(`ሰነድ «${idea.attachmentName}» በማውረድ ላይ ነው...`)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-1.5 text-slate-700 shadow-xs transition-all"
                          title="የተያያዘውን ሰነድ አውርድ"
                        >
                          <Download className="w-3.5 h-3.5 text-[#22177a]" />
                          <span>ሰነድ አውርድ</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenReader(idea)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/25 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs hover:-translate-y-0.5 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>ሙሉ ፅሁፉን አንብብ →</span>
                      </button>
                    </div>
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
