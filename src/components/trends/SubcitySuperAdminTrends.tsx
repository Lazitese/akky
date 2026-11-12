import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Folder, 
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  FileText,
  Edit,
  FolderOpen,
  Filter,
  PieChart,
  Activity,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { TrendCategory, TrendAnalysisType, TrendItem } from '../../types/trends';
import { Sector, Woreda } from '../../types/dms';
import { User } from '../../types/auth';
import { PartyFlameSwoosh, PartyMottoBanner } from '../brand/PartyFlameAccent';
import { ModernBarChart, ModernDonutChart } from '../charts/ModernSaasCharts';

interface SubcitySuperAdminTrendsProps {
  currentUser: User;
  trends: TrendItem[];
  sectors: Sector[];
  woredas: Woreda[];
  onOpenRegister: (prefill?: { level?: 'ክፍለ ከተማ' | 'ወረዳ'; woredaId?: string; sector?: string }) => void;
  onOpenDetail: (trend: TrendItem) => void;
  onOpenExecutiveReport: () => void;
}

type NavigationState =
  | { view: 'home' }
  // Flow 1: Subcity Sectors -> Entries
  | { view: 'subcity-sectors' }
  | { view: 'subcity-sector-trends'; sector: Sector; typeFilter: TrendAnalysisType | 'ሁሉም' }
  // Flow 2: Woredas -> Woreda Sectors -> Entries
  | { view: 'woredas' }
  | { view: 'woreda-sectors'; woreda: Woreda }
  | { view: 'woreda-sector-trends'; woreda: Woreda; sector: Sector; typeFilter: TrendAnalysisType | 'ሁሉም' };

export const SubcitySuperAdminTrends: React.FC<SubcitySuperAdminTrendsProps> = ({
  currentUser,
  trends,
  sectors,
  woredas,
  onOpenRegister,
  onOpenDetail,
  onOpenExecutiveReport,
}) => {
  const getInitialNav = (): NavigationState => {
    if (currentUser.role === 'WOREDA_SECTOR_ADMIN') {
      const w = woredas.find((x) => x.id === (currentUser.woredaId || 'wor-04')) || woredas[3];
      const s = sectors.find((x) => x.name === (currentUser.sectorName || 'የፖለቲካ ዘርፍ')) || sectors[0];
      return { view: 'woreda-sector-trends', woreda: w, sector: s, typeFilter: 'ሁሉም' };
    }
    if (currentUser.role === 'WOREDA_SUPER_ADMIN') {
      const w = woredas.find((x) => x.id === (currentUser.woredaId || 'wor-04')) || woredas[3];
      return { view: 'woreda-sectors', woreda: w };
    }
    if (currentUser.role === 'SUBCITY_SECTOR_ADMIN') {
      const s = sectors.find((x) => x.name === (currentUser.sectorName || 'የፖለቲካ ዘርፍ')) || sectors[0];
      return { view: 'subcity-sector-trends', sector: s, typeFilter: 'ሁሉም' };
    }
    return { view: 'home' };
  };

  const [navState, setNavState] = useState<NavigationState>(getInitialNav());

  React.useEffect(() => {
    setNavState(getInitialNav());
  }, [currentUser]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('ሁሉም');

  // Stats
  const subcityTrends = trends.filter((t) => t.level === 'ክፍለ ከተማ');
  const woredaTrends = trends.filter((t) => t.level === 'ወረዳ');

  const positiveCount = trends.filter((t) => t.analysisType === 'በአዎንታዊ የሚታይ ዝንባሌ').length;
  const urgentCount = trends.filter((t) => t.analysisType === 'ትኩረት የሚሻ ዝንባሌ').length;
  const negativeCount = trends.filter((t) => t.analysisType === 'በአሉታዊ የሚታይ ዝንባሌ').length;

  const totalTrends = trends.length;
  const positivePct = Math.round((positiveCount / Math.max(1, totalTrends)) * 100);
  const urgentPct = Math.round((urgentCount / Math.max(1, totalTrends)) * 100);
  const negativePct = Math.round((negativeCount / Math.max(1, totalTrends)) * 100);

  const photosCount = trends.filter((t) => Boolean(t.photoUrl)).length;
  const directivesCount = trends.filter((t) => Boolean(t.feedback)).length;

  const recentTrends = [...trends]
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    .slice(0, 6);

  const getBreadcrumbs = () => {
    switch (navState.view) {
      case 'home':
        return [{ label: 'ዋና ማውጫ' }];
      case 'subcity-sectors':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የክፍለ ከተማ ዘርፎች' },
        ];
      case 'subcity-sector-trends':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የክፍለ ከተማ ዘርፎች', onClick: () => setNavState({ view: 'subcity-sectors' }) },
          { label: navState.sector.name },
        ];
      case 'woredas':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች አዝማሚያ' },
        ];
      case 'woreda-sectors':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች አዝማሚያ', onClick: () => setNavState({ view: 'woredas' }) },
          { label: navState.woreda.name },
        ];
      case 'woreda-sector-trends':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች አዝማሚያ', onClick: () => setNavState({ view: 'woredas' }) },
          { label: navState.woreda.name, onClick: () => setNavState({ view: 'woreda-sectors', woreda: navState.woreda }) },
          { label: navState.sector.name },
        ];
    }
  };

  const handleBack = () => {
    switch (navState.view) {
      case 'subcity-sectors':
        setNavState({ view: 'home' });
        break;
      case 'subcity-sector-trends':
        setNavState({ view: 'subcity-sectors' });
        break;
      case 'woredas':
        setNavState({ view: 'home' });
        break;
      case 'woreda-sectors':
        setNavState({ view: 'woredas' });
        break;
      case 'woreda-sector-trends':
        setNavState({ view: 'woreda-sectors', woreda: navState.woreda });
        break;
      default:
        setNavState({ view: 'home' });
    }
    setSearchQuery('');
    setTopicFilter('ሁሉም');
  };

  const getAnalysisBadge = (type: TrendAnalysisType) => {
    switch (type) {
      case 'በአዎንታዊ የሚታይ ዝንባሌ':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-full inline-flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{type}</span>
          </span>
        );
      case 'ትኩረት የሚሻ ዝንባሌ':
        return (
          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold rounded-full inline-flex items-center gap-1.5 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>{type}</span>
          </span>
        );
      case 'በአሉታዊ የሚታይ ዝንባሌ':
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-full inline-flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{type}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* --- TOP HERO: Branded Deep Navy SaaS Hero Card --- */}
      {navState.view === 'home' ? (
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  ሞጁል 2.0 • ወቅታዊ ሁኔታና አዝማሚያ
                </span>
              </div>

              {/* Main Title with Gradient Icon & Tag */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-inner shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <span>የፖለቲካ አዝማሚያና ሁኔታ ትንተና</span>
                <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  PTAMIS
                </span>
              </h1>

              {/* Minimal Description */}
              <p className="text-xs sm:text-[13px] text-slate-200/90 mt-1.5 max-w-xl font-normal leading-relaxed">
                የወቅታዊ ፖለቲካዊ፣ ኢኮኖሚያዊና ማህበራዊ ሁኔታዎች ቅጽበታዊ መከታተያ።
              </p>

              {/* Feature Capability Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                  <Activity className="w-3.5 h-3.5 text-rose-400" /> ቀጣይነት ያለው ዳሰሳ
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                  <FileText className="w-3.5 h-3.5 text-sky-400" /> ቅጽበታዊ ሪፖርት
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/15 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> የአመራር ውሳኔ ድጋፍ
                </span>
              </div>
            </div>

            {/* Right Column: Quick Key Metrics & Action Hub */}
            <div className="flex flex-col lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
              {/* Quick Metrics Cluster */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                  <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                    <Activity className="w-3 h-3 text-amber-300" /> ጠቅላላ
                  </div>
                  <div className="text-base font-black text-white mt-0.5">
                    {trends.length} <span className="text-[10px] font-normal text-slate-300">ዝንባሌዎች</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                  <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span> ትኩረት
                  </div>
                  <div className="text-base font-black text-white mt-0.5">
                    {urgentCount} <span className="text-[10px] font-normal text-slate-300">አስቸኳይ</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-center lg:text-left min-w-[95px] shadow-inner">
                  <div className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> አዎንታዊ
                  </div>
                  <div className="text-base font-black text-white mt-0.5">
                    {positiveCount} <span className="text-[10px] font-normal text-slate-300">ጥሩ</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full lg:w-auto">
                <button
                  onClick={onOpenExecutiveReport}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition-all shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>ጥቅል ሪፖርት</span>
                </button>
                <button
                  onClick={() => onOpenRegister()}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-xs sm:text-[13px] font-black hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md group"
                >
                  <div className="w-5 h-5 rounded-lg bg-slate-950/15 text-slate-950 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>+ መረጃ መዝግብ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Subview Context Bar: Sleek Branded Header */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#11094b] text-white p-4 sm:p-5 shadow-md border border-[#3b2c9e]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5 shadow-xs"
              title="ተመለስ"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>ተመለስ</span>
            </button>

            <div>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                {getBreadcrumbs().map((b, idx, arr) => (
                  <React.Fragment key={idx}>
                    {b.onClick ? (
                      <button onClick={b.onClick} className="hover:text-amber-300 transition-colors">
                        {b.label}
                      </button>
                    ) : (
                      <span className="text-white font-bold">{b.label}</span>
                    )}
                    {idx < arr.length - 1 && <span className="text-white/40">/</span>}
                  </React.Fragment>
                ))}
              </div>

              <h1 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {navState.view === 'subcity-sectors' && 'የክፍለ ከተማ ማዕከላዊ ዘርፎች አዝማሚያ'}
                {navState.view === 'subcity-sector-trends' && `${navState.sector.name} — አዝማሚያዎች`}
                {navState.view === 'woredas' && 'የ14ቱ ወረዳዎች አዝማሚያና ሁኔታ'}
                {navState.view === 'woreda-sectors' && `${navState.woreda.name} — የወረዳው ዘርፎች`}
                {navState.view === 'woreda-sector-trends' && `${navState.woreda.name} > ${navState.sector.name}`}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExecutiveReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>ጥቅል ሪፖርት</span>
            </button>

            <button
              onClick={() => {
                if (navState.view === 'subcity-sector-trends') {
                  onOpenRegister({ level: 'ክፍለ ከተማ', sector: navState.sector.name });
                } else if (navState.view === 'woreda-sector-trends') {
                  onOpenRegister({ level: 'ወረዳ', woredaId: navState.woreda.id, sector: navState.sector.name });
                } else if (navState.view === 'woreda-sectors') {
                  onOpenRegister({ level: 'ወረዳ', woredaId: navState.woreda.id });
                } else {
                  onOpenRegister();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black hover:shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ መረጃ መዝግብ</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ROOT HOME VIEW: MODERN SAAS CARDS + RECHARTS + RECENT TRENDS           */}
      {/* ========================================================================= */}
      {navState.view === 'home' && (
        <div className="space-y-5 pt-1">
          {/* Official Prosperity Party Motto Banner */}
          <PartyMottoBanner />

          {/* Top 2 Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Subcity Sectors Trends - Official Party Dark Blue */}
            <div
              onClick={() => setNavState({ view: 'subcity-sectors' })}
              className="border border-amber-400/40 bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white rounded-2xl p-5 cursor-pointer hover:shadow-2xl hover:shadow-[#22177a]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-xl border border-amber-400/40 bg-[#140d4f] text-amber-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white group-hover:underline">የክፍለ ከተማ ዘርፎች አዝማሚያ</h2>
                  <p className="text-xs text-blue-200/90 font-medium mt-0.5">የ5ቱ ማዕከላዊ ዘርፎች የወቅታዊ ሁኔታ ትንተናዎች</p>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white tracking-tight">{subcityTrends.length}</div>
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">ሁነቶች</div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative Flame Swoosh */}
              <div className="absolute -right-3 -bottom-3 opacity-30 pointer-events-none group-hover:scale-110 transition-transform">
                <PartyFlameSwoosh size="md" />
              </div>
            </div>

            {/* Box 2: Woredas Trends - Modern Crisp White */}
            <div
              onClick={() => setNavState({ view: 'woredas' })}
              className="border border-slate-200 bg-white text-slate-800 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 text-[#22177a] flex items-center justify-center shadow-inner group-hover:bg-[#22177a] group-hover:text-white transition-all group-hover:scale-105">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 group-hover:underline">የወረዳዎች አዝማሚያና ሁኔታ</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">የ14ቱ ወረዳዎች የመስክ ሁነቶች ካቢኔት</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-slate-900 tracking-tight">{woredaTrends.length}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ሁነቶች</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#22177a] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Analytics Section: Sentiment Recharts Donut & Leadership Reporting Velocity */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የወቅታዊ ሁኔታና ዝንባሌዎች ትንተና (Trends Analytics)
                  </h3>
                  <p className="text-[11px] text-slate-500">የህዝብ ስሜት፣ የኑሮ ሁኔታ እና የፖለቲካ ዳሰሳዎች</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                ጠቅላላ ሁነቶች፦ {totalTrends}
              </span>
            </div>

            {/* 4 Modern Metric Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <span>በአዎንታዊ የሚታይ</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 rounded-full font-bold">
                      {positivePct}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">
                    {positiveCount}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600"></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                    <span>ትኩረት የሚሻ</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-rose-100 rounded-full font-bold">
                      {urgentPct}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">
                    {urgentCount}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-pulse"></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span>በአሉታዊ የሚታይ</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 rounded-full font-bold">
                      {negativePct}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">
                    {negativeCount}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#22177a] uppercase tracking-wider flex items-center gap-1">
                    <span>የፎቶ ማስረጃዎች</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 rounded-full font-bold">
                      {Math.round((photosCount / Math.max(1, totalTrends)) * 100)}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">
                    {photosCount}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#22177a]/10 text-[#22177a] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Charts Grid: Recharts Modern Donut on Left, Reporting Pulse on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Chart 1: Modern Interactive Recharts Sentiment Donut */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/90 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 tracking-tight">የዝንባሌዎች የፓይ/ዶነት ቻርት (Sentiment Pie)</h4>
                  <span className="text-[10px] text-slate-500 font-mono">ስሜት ትንተና</span>
                </div>

                <ModernDonutChart
                  data={[
                    { name: 'አዎንታዊ', value: positiveCount, color: '#10b981' },
                    { name: 'ትኩረት የሚሻ', value: urgentCount, color: '#e11d48' },
                    { name: 'አሉታዊ', value: negativeCount, color: '#f59e0b' },
                  ]}
                  height={190}
                  centerLabel="አዝማሚያዎች"
                  centerCount={totalTrends}
                />

                {/* Minimal Sleek Legend Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10.5px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-emerald-800 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> አዎንታዊ ({positiveCount})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-rose-800 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span> ትኩረት የሚሻ ({urgentCount})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-amber-800 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> አሉታዊ ({negativeCount})
                  </span>
                </div>
              </div>

              {/* Chart 2: Modern Reporting Activity & Leadership Response */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/90 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>የመረጃ ፍሰትና የአመራር ምላሽ (Reporting & Action)</span>
                    <Activity className="w-4 h-4 text-[#22177a]" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ከክፍለ ከተማው 5 ዘርፎችና ከ14ቱ ወረዳዎች የተላኩ ትንተናዎች የመረጃ ፍሰት ሁኔታ።
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>የአመራር አቅጣጫ የተሰጠባቸው</span>
                      <span className="font-mono text-[#22177a]">{directivesCount} / {totalTrends}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(directivesCount / Math.max(1, totalTrends)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-[#22177a] rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>የፎቶ ማስረጃ የተያያዘባቸው</span>
                      <span className="font-mono text-amber-600">{photosCount} / {totalTrends}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(photosCount / Math.max(1, totalTrends)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10.5px] text-slate-600 font-medium">
                  <span>ሪፖርት ያደረጉ፦ <strong className="text-slate-800">ወረዳ 01፣ 04፣ 02</strong></span>
                  <span className="text-[#22177a] font-bold">14 ወረዳዎች በክትትል</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions List: Modern SaaS Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የቅርብ ጊዜ የተመዘገቡ የወቅታዊ ሁኔታ ትንተናዎች (Recent Submissions)
                  </h3>
                  <p className="text-[11px] text-slate-500">የመስክ መረጃዎችና የአመራር መመሪያዎች</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                የመጨረሻዎቹ {recentTrends.length} ሁነቶች
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3 font-bold">የአዝማሚያ ርዕስ</th>
                    <th className="p-3 font-bold">እርከንና ወረዳ/ዘርፍ</th>
                    <th className="p-3 font-bold">የትንተና አይነት</th>
                    <th className="p-3 font-bold">ቀንና ሰዓት</th>
                    <th className="p-3 font-bold text-center">ሁኔታ</th>
                    <th className="p-3 font-bold text-right">ድርጊት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTrends.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate max-w-xs" title={t.title}>
                            {t.title}
                          </span>
                          {t.photoUrl && (
                            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 inline-flex items-center gap-1">
                              📷 ፎቶ
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-500 truncate max-w-sm mt-0.5" title={t.summary}>
                          {t.summary}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {t.level === 'ወረዳ' ? (t.woredaName || 'ወረዳ') : 'ክፍለ ከተማ'}
                        </div>
                        <div className="text-[10px] text-slate-500">{t.sector}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {getAnalysisBadge(t.analysisType)}
                      </td>

                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {t.date} {t.time}
                      </td>

                      <td className="p-3 whitespace-nowrap text-center">
                        <span
                          className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            t.status === 'እርምጃ የተወሰደበት'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : t.status === 'ተገምግሟል'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'እርምጃ የተወሰደበት'
                                ? 'bg-emerald-500'
                                : t.status === 'ተገምግሟል'
                                ? 'bg-blue-600'
                                : 'bg-slate-400'
                            }`}
                          />
                          {t.status}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => onOpenDetail(t)}
                          className="px-2.5 py-1 bg-[#2a80b9] hover:bg-[#20638f] text-white text-[11px] font-bold inline-flex items-center gap-1 rounded-sm shadow-xs"
                        >
                          <Edit className="w-3 h-3" />
                          <span>ዝርዝር</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOW 1: SUBCITY SECTORS GRID (Modern SaaS Cards)                       */}
      {/* ========================================================================= */}
      {navState.view === 'subcity-sectors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              አዝማሚያዎችን ለመመልከት የሚፈልጉትን የክፍለ ከተማ ዘርፍ ይምረጡ፦
            </p>
            <span className="text-[11px] font-bold text-slate-400">5ቱ ማዕከላዊ ዘርፎች</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec, idx) => {
              const secTrends = trends.filter(
                (t) => t.level === 'ክፍለ ከተማ' && t.sector === sec.name
              );
              const urgent = secTrends.filter((t) => t.analysisType === 'ትኩረት የሚሻ ዝንባሌ').length;
              const isFirst = idx === 0;

              return (
                <div
                  key={sec.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden group ${
                    isFirst
                      ? 'bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white border border-amber-400/40 shadow-md hover:shadow-2xl hover:shadow-[#22177a]/30 hover:-translate-y-1'
                      : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                          isFirst
                            ? 'border-amber-400/40 bg-[#140d4f] text-amber-400 group-hover:scale-105'
                            : 'border-slate-200 bg-slate-50 text-[#22177a] group-hover:bg-[#22177a] group-hover:text-white group-hover:scale-105'
                        }`}
                      >
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isFirst
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sec.code}
                        </span>
                        <h3 className={`font-extrabold text-sm mt-1 leading-snug ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                          {sec.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs flex items-center justify-between pt-3 border-t relative z-10 ${
                    isFirst ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>የተመዘገቡ አዝማሚያዎች፦</span>
                    <strong className={`font-mono text-base font-extrabold ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                      {secTrends.length}
                    </strong>
                  </div>

                  {urgent > 0 && (
                    <div className="rounded-xl px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 relative z-10">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      <span>{urgent} አፋጣኝ ትኩረት የሚሹ ጉዳዮች አሉ</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setNavState({
                        view: 'subcity-sector-trends',
                        sector: sec,
                        typeFilter: 'ሁሉም',
                      })
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-xs ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/20'
                    }`}
                  >
                    <span>ሁነቶችን ክፈት</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {isFirst && (
                    <div className="absolute -right-3 -bottom-3 opacity-25 pointer-events-none group-hover:scale-110 transition-transform">
                      <PartyFlameSwoosh size="md" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FLOW 1: SUBCITY SECTOR TRENDS TABLE (Modern SaaS Design)               */}
      {/* ========================================================================= */}
      {navState.view === 'subcity-sector-trends' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Filter & Register Strip */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <button
              onClick={() =>
                onOpenRegister({ level: 'ክፍለ ከተማ', sector: navState.sector.name })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#22177a]/25 hover:-translate-y-0.5 transition-all self-start shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>መረጃዎችን ለመመዝገብ ይህንን ይጫኑ</span>
            </button>

            {/* Filter by Type & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={navState.typeFilter}
                onChange={(e) =>
                  setNavState({
                    ...navState,
                    typeFilter: e.target.value as TrendAnalysisType | 'ሁሉም',
                  })
                }
                className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
              >
                <option value="ሁሉም">ሁሉም የትንተና አይነቶች</option>
                <option value="በአዎንታዊ የሚታይ ዝንባሌ">በአዎንታዊ የሚታይ</option>
                <option value="ትኩረት የሚሻ ዝንባሌ">ትኩረት የሚሻ</option>
                <option value="በአሉታዊ የሚታይ ዝንባሌ">በአሉታዊ የሚታይ</option>
              </select>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="ፈልግ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {(() => {
            const list = trends.filter((t) => {
              const matchLevel = t.level === 'ክፍለ ከተማ';
              const matchSector = t.sector === navState.sector.name;
              const matchType =
                navState.typeFilter === 'ሁሉም' || t.analysisType === navState.typeFilter;
              const matchSearch =
                !searchQuery ||
                t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.title.toLowerCase().includes(searchQuery.toLowerCase());
              return matchLevel && matchSector && matchType && matchSearch;
            });

            if (list.length === 0) {
              return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">በዚህ ዘርፍ የተመዘገበ ወቅታዊ አዝማሚያ የለም</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    አዲስ ሁነት ወይም አዝማሚያ ለመመዝገብ ከላይ ያለውን ቁልፍ ይጫኑ።
                  </p>
                </div>
              );
            }

            return (
              <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3 font-bold">የአዝማሚያ ርዕስ</th>
                        <th className="p-3 font-bold">የትንተና አይነት</th>
                        <th className="p-3 font-bold">ሁኔታ (ዝንባሌ) በአጭሩ</th>
                        <th className="p-3 font-bold">ቀንና ሰዓት</th>
                        <th className="p-3 font-bold text-center">ሁኔታ</th>
                        <th className="p-3 font-bold text-right">ድርጊት</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {list.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{item.title}</span>
                              {item.photoUrl && (
                                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 inline-flex items-center gap-1">
                                  📷 ፎቶ
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {getAnalysisBadge(item.analysisType)}
                          </td>
                          <td className="p-3 text-slate-700 font-medium max-w-xs truncate" title={item.summary}>
                            <span>{item.summary}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                            {item.date} {item.time}
                          </td>
                          <td className="p-3 whitespace-nowrap text-center">
                            <span
                              className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                item.status === 'እርምጃ የተወሰደበት'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : item.status === 'ተገምግሟል'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'እርምጃ የተወሰደበት'
                                    ? 'bg-emerald-500'
                                    : item.status === 'ተገምግሟል'
                                    ? 'bg-blue-600'
                                    : 'bg-slate-400'
                                }`}
                              />
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => onOpenDetail(item)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-xs"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>ዝርዝር</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FLOW 2: WOREDAS LIST (14 Woredas - Modern SaaS Grid)                    */}
      {/* ========================================================================= */}
      {navState.view === 'woredas' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              የወረዳውን ዘርፎች አዝማሚያ ለመክፈት የሚፈልጉትን ወረዳ ይምረጡ፦
            </p>
            <span className="text-[11px] font-bold text-slate-400">14ቱ የወረዳ አስተዳደሮች</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {woredas.map((w) => {
              const woredaAll = trends.filter((t) => t.woredaId === w.id);
              const hasUrgent = woredaAll.some((t) => t.analysisType === 'ትኩረት የሚሻ ዝንባሌ');

              return (
                <div
                  key={w.id}
                  className={`rounded-2xl p-4 flex flex-col justify-between space-y-3.5 transition-all duration-300 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                    hasUrgent ? 'border-2 border-rose-300 ring-2 ring-rose-100' : 'border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {w.boxCode}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">{w.name}</h3>
                    </div>

                    {hasUrgent && (
                      <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        አስቸኳይ!
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>ጠቅላላ ሁነቶች፦</span>
                    <strong className="font-mono text-sm font-extrabold text-slate-900">{woredaAll.length}</strong>
                  </div>

                  <button
                    onClick={() => setNavState({ view: 'woreda-sectors', woreda: w })}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-md hover:shadow-[#22177a]/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>ዘርፎችን ክፈት</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FLOW 2: WOREDA SECTORS (Modern SaaS Grid)                               */}
      {/* ========================================================================= */}
      {navState.view === 'woreda-sectors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22177a]/10 text-[#22177a] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  የተመረጠው ወረዳ፦
                </span>
                <h2 className="text-base font-extrabold text-slate-900">{navState.woreda.name} ({navState.woreda.boxCode})</h2>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-700">
              5ቱ የወረዳው ዘርፎች
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            አዝማሚያዎችን ለመመልከት የሚፈልጉትን የወረዳውን ዘርፍ ይምረጡ፦
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec, idx) => {
              const woredaSec = trends.filter(
                (t) => t.woredaId === navState.woreda.id && t.sector === sec.name
              );
              const urgent = woredaSec.filter((t) => t.analysisType === 'ትኩረት የሚሻ ዝንባሌ').length;
              const isFirst = idx === 0;

              return (
                <div
                  key={sec.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden group ${
                    isFirst
                      ? 'bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white border border-amber-400/40 shadow-md hover:shadow-2xl hover:shadow-[#22177a]/30 hover:-translate-y-1'
                      : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                          isFirst
                            ? 'border-amber-400/40 bg-[#140d4f] text-amber-400 group-hover:scale-105'
                            : 'border-slate-200 bg-slate-50 text-[#22177a] group-hover:bg-[#22177a] group-hover:text-white group-hover:scale-105'
                        }`}
                      >
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isFirst
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sec.code}
                        </span>
                        <h3 className={`font-extrabold text-sm mt-1 leading-snug ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                          {sec.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs flex items-center justify-between pt-3 border-t relative z-10 ${
                    isFirst ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>የተመዘገቡ አዝማሚያዎች፦</span>
                    <strong className={`font-mono text-base font-extrabold ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                      {woredaSec.length}
                    </strong>
                  </div>

                  {urgent > 0 && (
                    <div className="rounded-xl px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 relative z-10">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      <span>{urgent} አፋጣኝ ትኩረት የሚሹ</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setNavState({
                        view: 'woreda-sector-trends',
                        woreda: navState.woreda,
                        sector: sec,
                        typeFilter: 'ሁሉም',
                      })
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-xs ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/20'
                    }`}
                  >
                    <span>ሁነቶችን ክፈት</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {isFirst && (
                    <div className="absolute -right-3 -bottom-3 opacity-25 pointer-events-none group-hover:scale-110 transition-transform">
                      <PartyFlameSwoosh size="md" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FLOW 2: WOREDA SECTOR TRENDS TABLE (Modern SaaS Design)                 */}
      {/* ========================================================================= */}
      {navState.view === 'woreda-sector-trends' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Filter & Register Strip */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <button
              onClick={() =>
                onOpenRegister({
                  level: 'ወረዳ',
                  woredaId: navState.woreda.id,
                  sector: navState.sector.name,
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#22177a]/25 hover:-translate-y-0.5 transition-all self-start shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>መረጃዎችን ለመመዝገብ ይህንን ይጫኑ</span>
            </button>

            {/* Filter by Type & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={navState.typeFilter}
                onChange={(e) =>
                  setNavState({
                    ...navState,
                    typeFilter: e.target.value as TrendAnalysisType | 'ሁሉም',
                  })
                }
                className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
              >
                <option value="ሁሉም">ሁሉም የትንተና አይነቶች</option>
                <option value="በአዎንታዊ የሚታይ ዝንባሌ">በአዎንታዊ የሚታይ</option>
                <option value="ትኩረት የሚሻ ዝንባሌ">ትኩረት የሚሻ</option>
                <option value="በአሉታዊ የሚታይ ዝንባሌ">በአሉታዊ የሚታይ</option>
              </select>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="ፈልግ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {(() => {
            const list = trends.filter((t) => {
              const matchWoreda = t.woredaId === navState.woreda.id;
              const matchSector = t.sector === navState.sector.name;
              const matchType =
                navState.typeFilter === 'ሁሉም' || t.analysisType === navState.typeFilter;
              const matchSearch =
                !searchQuery ||
                t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.title.toLowerCase().includes(searchQuery.toLowerCase());
              return matchWoreda && matchSector && matchType && matchSearch;
            });

            if (list.length === 0) {
              return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">በዚህ የወረዳ ዘርፍ እስካሁን የተመዘገበ ወቅታዊ አዝማሚያ የለም</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    አዲስ ሁነት ወይም አዝማሚያ ለመመዝገብ ከላይ ያለውን ቁልፍ ይጫኑ።
                  </p>
                </div>
              );
            }

            return (
              <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3 font-bold">የአዝማሚያ ርዕስ</th>
                        <th className="p-3 font-bold">የትንተና አይነት</th>
                        <th className="p-3 font-bold">ሁኔታ (ዝንባሌ) በአጭሩ</th>
                        <th className="p-3 font-bold">ቀንና ሰዓት</th>
                        <th className="p-3 font-bold text-center">ሁኔታ</th>
                        <th className="p-3 font-bold text-right">ድርጊት</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {list.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{item.title}</span>
                              {item.photoUrl && (
                                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 inline-flex items-center gap-1">
                                  📷 ፎቶ
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {getAnalysisBadge(item.analysisType)}
                          </td>
                          <td className="p-3 text-slate-700 font-medium max-w-xs truncate" title={item.summary}>
                            <span>{item.summary}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                            {item.date} {item.time}
                          </td>
                          <td className="p-3 whitespace-nowrap text-center">
                            <span
                              className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                item.status === 'እርምጃ የተወሰደበት'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : item.status === 'ተገምግሟል'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'እርምጃ የተወሰደበት'
                                    ? 'bg-emerald-500'
                                    : item.status === 'ተገምግሟል'
                                    ? 'bg-blue-600'
                                    : 'bg-slate-400'
                                }`}
                              />
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => onOpenDetail(item)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-xs"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>ዝርዝር</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
