import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Folder, 
  Upload, 
  ArrowLeft,
  ChevronRight,
  QrCode,
  Search,
  Eye,
  FileCheck,
  FolderOpen,
  BarChart3,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  HardDrive,
  PieChart
} from 'lucide-react';
import { DocumentCategory, DocumentItem, Sector, Woreda } from '../../types/dms';
import { User } from '../../types/auth';
import { PartyFlameSwoosh, PartyMottoBanner } from '../brand/PartyFlameAccent';
import { 
  ModernBarChart, 
  ModernDonutChart, 
  ModernSplitDonutChart, 
  ModernRankedProgressList 
} from '../charts/ModernSaasCharts';

interface SubcitySuperAdminDashboardProps {
  currentUser: User;
  documents: DocumentItem[];
  sectors: Sector[];
  woredas: Woreda[];
  onOpenUpload: (prefill?: { level?: 'ክፍለ ከተማ' | 'ወረዳ'; woredaId?: string; sector?: string }) => void;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onOpenFeedback: (doc: DocumentItem) => void;
}

type NavigationState =
  | { view: 'home' }
  // Flow 1: Subcity Sectors -> Files
  | { view: 'subcity-sectors' }
  | { view: 'subcity-sector-files'; sector: Sector; categoryFilter: DocumentCategory | 'ሁሉም' }
  // Flow 2: Woredas -> Woreda Sectors -> Files
  | { view: 'woredas' }
  | { view: 'woreda-sectors'; woreda: Woreda }
  | { view: 'woreda-sector-files'; woreda: Woreda; sector: Sector; categoryFilter: DocumentCategory | 'ሁሉም' };

export const SubcitySuperAdminDashboard: React.FC<SubcitySuperAdminDashboardProps> = ({
  currentUser,
  documents,
  sectors,
  woredas,
  onOpenUpload,
  onOpenQR,
  onOpenFeedback,
}) => {
  const [navState, setNavState] = useState<NavigationState>({ view: 'home' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorChartView, setSectorChartView] = useState<'ranked' | 'column'>('ranked');

  // Total counts for top-level boxes
  const subcityDocs = documents.filter((d) => d.level === 'ክፍለ ከተማ');
  const woredaDocs = documents.filter((d) => d.level === 'ወረዳ');

  // Analytics calculations
  const approvedDocsCount = documents.filter((d) => d.status === 'የጸደቀ').length;
  const revisionDocsCount = documents.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length;

  const planDocs = documents.filter((d) => d.category === 'ዕቅድ').length;
  const reportDocs = documents.filter((d) => d.category === 'ሪፖርት').length;
  const letterDocs = documents.filter((d) => d.category === 'ደብዳቤ').length;
  const circularDocs = documents.filter((d) => d.category === 'ሰርኩላር').length;
  const otherDocs = documents.filter((d) => d.category === 'ሌሎች').length;

  const sectorStats = sectors.map((sec) => ({
    name: sec.name,
    code: sec.code,
    count: documents.filter((d) => d.sector === sec.name).length,
  }));

  const recentUploads = [...documents]
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate) || b.id.localeCompare(a.id))
    .slice(0, 6);

  // Breadcrumb path & title helper
  const getBreadcrumbs = () => {
    switch (navState.view) {
      case 'home':
        return [{ label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) }];
      case 'subcity-sectors':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የክፍለ ከተማ ዘርፎች' },
        ];
      case 'subcity-sector-files':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የክፍለ ከተማ ዘርፎች', onClick: () => setNavState({ view: 'subcity-sectors' }) },
          { label: navState.sector.name },
        ];
      case 'woredas':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች ማህደር' },
        ];
      case 'woreda-sectors':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች ማህደር', onClick: () => setNavState({ view: 'woredas' }) },
          { label: navState.woreda.name },
        ];
      case 'woreda-sector-files':
        return [
          { label: 'ዋና ማውጫ', onClick: () => setNavState({ view: 'home' }) },
          { label: 'የ14ቱ ወረዳዎች ማህደር', onClick: () => setNavState({ view: 'woredas' }) },
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
      case 'subcity-sector-files':
        setNavState({ view: 'subcity-sectors' });
        break;
      case 'woredas':
        setNavState({ view: 'home' });
        break;
      case 'woreda-sectors':
        setNavState({ view: 'woredas' });
        break;
      case 'woreda-sector-files':
        setNavState({ view: 'woreda-sectors', woreda: navState.woreda });
        break;
      default:
        setNavState({ view: 'home' });
    }
    setSearchQuery('');
  };

  const categories: (DocumentCategory | 'ሁሉም')[] = ['ሁሉም', 'ዕቅድ', 'ሪፖርት', 'ሰርኩላር', 'ደብዳቤ', 'ሌሎች'];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* --- TOP BAR: Breadcrumbs & Action Button --- */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {navState.view !== 'home' && (
            <button
              onClick={handleBack}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="ተመለስ"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>ተመለስ</span>
            </button>
          )}

          <div>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              {getBreadcrumbs().map((b, idx, arr) => (
                <React.Fragment key={idx}>
                  {b.onClick ? (
                    <button
                      onClick={b.onClick}
                      className="hover:text-[#22177a] transition-colors"
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span className="text-slate-700 font-semibold">{b.label}</span>
                  )}
                  {idx < arr.length - 1 && <span className="text-slate-300">/</span>}
                </React.Fragment>
              ))}
            </div>

            <h1 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              {navState.view === 'home' && 'የዲጂታል ሰነድና ፋይል ማህደር'}
              {navState.view === 'subcity-sectors' && 'የክፍለ ከተማው ማዕከላዊ ዘርፎች'}
              {navState.view === 'subcity-sector-files' && `${navState.sector.name} — ሰነዶች`}
              {navState.view === 'woredas' && 'የ14ቱ ወረዳዎች ማህደር'}
              {navState.view === 'woreda-sectors' && `${navState.woreda.name} — ዘርፎች`}
              {navState.view === 'woreda-sector-files' && `${navState.woreda.name} > ${navState.sector.name} — ሰነዶች`}
            </h1>
          </div>
        </div>

        {/* Global Register Document Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navState.view === 'subcity-sector-files') {
                onOpenUpload({ level: 'ክፍለ ከተማ', sector: navState.sector.name });
              } else if (navState.view === 'woreda-sector-files') {
                onOpenUpload({ level: 'ወረዳ', woredaId: navState.woreda.id, sector: navState.sector.name });
              } else if (navState.view === 'woreda-sectors') {
                onOpenUpload({ level: 'ወረዳ', woredaId: navState.woreda.id });
              } else {
                onOpenUpload();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#311b92] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#22177a]/25 hover:-translate-y-0.5 transition-all"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>+ ሰነድ መዝግብ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ROOT HOME VIEW: MODERN SAAS ACTION CARDS + CHARTS + RECENT UPLOADS     */}
      {/* ========================================================================= */}
      {navState.view === 'home' && (
        <div className="space-y-5 pt-1">
          {/* Official Prosperity Party Motto Banner */}
          <PartyMottoBanner />

          {/* Top 2 Main Minimal Action Cards: Box 1 Dark Blue Brand, Box 2 White */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Subcity Sectors - Official Party Dark Blue */}
            <div
              onClick={() => setNavState({ view: 'subcity-sectors' })}
              className="border border-amber-400/40 bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white rounded-2xl p-5 cursor-pointer hover:shadow-2xl hover:shadow-[#22177a]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-xl border border-amber-400/40 bg-[#140d4f] text-amber-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white group-hover:underline flex items-center gap-2">
                    <span>የክፍለ ከተማ ዘርፎች</span>
                  </h2>
                  <p className="text-xs text-blue-200/90 font-medium mt-0.5">የ5ቱ ማዕከላዊ ዘርፎች ሰነዶች ማህደር</p>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white tracking-tight">{subcityDocs.length}</div>
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">ፋይሎች</div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative Flame Swoosh */}
              <div className="absolute -right-3 -bottom-3 opacity-30 pointer-events-none group-hover:scale-110 transition-transform">
                <PartyFlameSwoosh size="md" />
              </div>
            </div>

            {/* Box 2: Woredas - Modern Crisp White */}
            <div
              onClick={() => setNavState({ view: 'woredas' })}
              className="border border-slate-200 bg-white text-slate-800 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 text-[#22177a] flex items-center justify-center shadow-inner group-hover:bg-[#22177a] group-hover:text-white transition-all group-hover:scale-105">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 group-hover:underline">የወረዳዎች ማህደር</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">የ14ቱ ወረዳዎች ካቢኔት እና ዘርፎች</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-slate-900 tracking-tight">{woredaDocs.length}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ፋይሎች</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#22177a] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Analytics Section: Elite SaaS KPI Cards & Modern Visualizations */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-6 shadow-xs">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22177a] to-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-[#22177a]/20">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                      የፋይሎች አጠቃላይ ትንተና
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                      (FILE ANALYTICS)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ቀጥታ • Live
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">በእውነተኛ ጊዜ የተሰበሰበ የማዕከልና የወረዳዎች ሰነድ መረጃ</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 shadow-xs">
                  <HardDrive className="w-3.5 h-3.5 text-[#22177a]" />
                  <span>ጠቅላላ መጠን፦ <strong className="font-mono text-slate-900">~148.5 MB</strong></span>
                </div>
              </div>
            </div>

            {/* 4 Modern SaaS Metric Tiles with Micro-Progress Tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Docs */}
              <div className="group rounded-2xl p-4.5 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    ጠቅላላ ሰነዶች
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#22177a] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-slate-900">
                    {documents.length}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">ፋይሎች</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    100% ዲጂታላይዝድ
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">HQ + 14 ወረዳዎች</span>
                </div>
              </div>

              {/* Card 2: Approved Docs */}
              <div className="group rounded-2xl p-4.5 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    የጸደቁ ፋይሎች
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-emerald-950">
                    {approvedDocsCount}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {Math.round((approvedDocsCount / Math.max(1, documents.length)) * 100)}% ተረጋግጧል
                  </span>
                </div>
                <div className="mt-3 pt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.round((approvedDocsCount / Math.max(1, documents.length)) * 100)}%` }} 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>{approvedDocsCount} ከ {documents.length} ጸድቀዋል</span>
                    <span className="text-emerald-700 font-bold">ንቁ ሰነዶች</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Revision Required */}
              <div className="group rounded-2xl p-4.5 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    ክለሳ / ማሻሻያ
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-amber-950">
                    {revisionDocsCount}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {Math.round((revisionDocsCount / Math.max(1, documents.length)) * 100)}% ክለሳ
                  </span>
                </div>
                <div className="mt-3 pt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.round((revisionDocsCount / Math.max(1, documents.length)) * 100)}%` }} 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>{revisionDocsCount} ሰነዶች ማሻሻያ ይጠይቃሉ</span>
                    <span className="text-amber-700 font-bold">ቅድሚያ</span>
                  </div>
                </div>
              </div>

              {/* Card 4: QR Secured */}
              <div className="group rounded-2xl p-4.5 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:border-[#22177a]/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    QR የተመሰጠረ
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-slate-900">
                    {documents.length}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#22177a] border border-blue-200">
                    100% ደህንነት
                  </span>
                </div>
                <div className="mt-3 pt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: '100%' }} 
                      className="h-full bg-gradient-to-r from-[#22177a] to-[#3b82f6] rounded-full transition-all duration-1000"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>{documents.length} ሰነዶች በQR ተረጋግጠዋል</span>
                    <span className="text-[#22177a] font-bold">ተቆልፏል</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Modern SaaS Cards in Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
              {/* Chart 1: Modern Split Donut Chart with Breakdown List */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#22177a]" />
                      <span>የሰነድ ምድቦች ስርጭት</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">በ5ቱ ዋና ዋና ምድቦች የተመደቡ ሰነዶች</p>
                  </div>
                  <span className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                    5 ምድቦች
                  </span>
                </div>

                <ModernSplitDonutChart
                  data={[
                    { name: 'ሪፖርት', value: reportDocs, color: '#3b82f6' },
                    { name: 'ሰርኩላር', value: circularDocs, color: '#10b981' },
                    { name: 'ዕቅድ', value: planDocs, color: '#22177a' },
                    { name: 'ደብዳቤ', value: letterDocs, color: '#f59e0b' },
                    { name: 'ሌሎች', value: otherDocs, color: '#8b5cf6' },
                  ]}
                  centerLabel="ሰነዶች"
                  centerCount={documents.length}
                />
              </div>

              {/* Chart 2: Modern SaaS Sector Comparison with View Toggle */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#22177a]" />
                      <span>የዘርፎች ሰነድ ገቢ ንጽጽር</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">የ5ቱ ማዕከላዊ ዘርፎች የሰነድ ገቢ ድርሻ</p>
                  </div>

                  {/* SaaS View Toggle Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSectorChartView('ranked')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        sectorChartView === 'ranked'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      ደረጃ (Ranked)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSectorChartView('column')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        sectorChartView === 'column'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      አምድ (Column)
                    </button>
                  </div>
                </div>

                {sectorChartView === 'ranked' ? (
                  <ModernRankedProgressList
                    items={sectorStats.map((s) => ({
                      name: s.name,
                      count: s.count,
                      code: s.code,
                    }))}
                    totalCount={documents.length}
                    unitLabel="ፋይሎች"
                  />
                ) : (
                  <ModernBarChart
                    data={sectorStats.map((s) => ({
                      name: s.name.replace('የ', '').replace(' ዘርፍ', ''),
                      count: s.count,
                    }))}
                    height={220}
                    barColor="#22177a"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Recent Uploads List: Modern SaaS Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    የቅርብ ጊዜ የተጫኑ ሰነዶች (Recent Uploads)
                  </h3>
                  <p className="text-[11px] text-slate-500">የቅርብ ጊዜ ገቢ የሆኑ ሰነዶች ዝርዝር</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-600">
                የመጨረሻዎቹ {recentUploads.length} ፋይሎች
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3 font-bold">የሰነድ ኮድና ርዕስ</th>
                    <th className="p-3 font-bold">እርከንና ዘርፍ</th>
                    <th className="p-3 font-bold">ምድብ</th>
                    <th className="p-3 font-bold">ቀን</th>
                    <th className="p-3 font-bold text-center">ሁኔታ</th>
                    <th className="p-3 font-bold text-right">ድርጊት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUploads.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20">
                            {doc.fileType}
                          </span>
                          <span className="font-bold text-slate-900 truncate max-w-xs" title={doc.title}>
                            {doc.title}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 pl-9 mt-0.5">
                          {doc.code} • {doc.fileSize}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {doc.level === 'ወረዳ' ? (doc.woredaName || 'ወረዳ') : 'ክፍለ ከተማ'}
                        </div>
                        <div className="text-[10px] text-slate-500">{doc.sector}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10.5px] px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium text-slate-700">
                          {doc.category}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {doc.uploadDate}
                      </td>

                      <td className="p-3 whitespace-nowrap text-center">
                        <span
                          className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            doc.status === 'የጸደቀ'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.status === 'ማሻሻያ የተጠየቀበት'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'የጸደቀ'
                                ? 'bg-emerald-500'
                                : doc.status === 'ማሻሻያ የተጠየቀበት'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {doc.status}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() =>
                              onOpenQR(doc.title, doc.code, 'ሰነድ', {
                                level: doc.level,
                                sector: doc.sector,
                                date: doc.uploadDate,
                                hash: doc.qrHash,
                              })
                            }
                            className="p-1 border border-neutral-300 hover:border-black text-black"
                            title="QR ኮድ እይ"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenFeedback(doc)}
                            className="p-1 border border-neutral-300 hover:border-black text-black"
                            title="ዝርዝርና ግብረ-መልስ"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
      )}

      {/* ========================================================================= */}
      {/* 2. FLOW 1: SUBCITY SECTORS GRID (Modern SaaS Cards)                       */}
      {/* ========================================================================= */}
      {navState.view === 'subcity-sectors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              ፋይሎችን ለመመልከት የሚፈልጉትን የክፍለ ከተማ ዘርፍ ይምረጡ፦
            </p>
            <span className="text-[11px] font-bold text-slate-400">5ቱ ማዕከላዊ ዘርፎች</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec, idx) => {
              const secDocs = documents.filter(
                (d) => d.level === 'ክፍለ ከተማ' && d.sector === sec.name
              );
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
                          {sec.boxCode}
                        </span>
                        <h3 className={`font-extrabold text-sm mt-1 leading-snug ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                          {sec.name}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onOpenQR(
                          `የ${sec.name} ማዕከላዊ ካቢኔት`,
                          `AKK-HQ-${sec.code}`,
                          'ፋይል ቦክስ / አቃፊ',
                          {
                            level: 'ክፍለ ከተማ',
                            sector: sec.name,
                            boxCode: sec.boxCode,
                            docCount: secDocs.length,
                          }
                        )
                      }
                      className={`p-2 rounded-xl transition-all ${
                        isFirst
                          ? 'border border-white/20 bg-white/10 hover:bg-white hover:text-[#22177a] text-white'
                          : 'border border-slate-200 bg-slate-50 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700'
                      }`}
                      title="የቦክስ QR ኮድ"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`text-xs flex items-center justify-between pt-3 border-t relative z-10 ${
                    isFirst ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>የተመዘገቡ ፋይሎች፦</span>
                    <strong className={`font-mono text-base font-extrabold ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                      {secDocs.length}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      setNavState({
                        view: 'subcity-sector-files',
                        sector: sec,
                        categoryFilter: 'ሁሉም',
                      })
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-xs ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-lg hover:shadow-[#22177a]/20'
                    }`}
                  >
                    <span>ፋይሎችን ክፈት</span>
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
      {/* 3. FLOW 1: SUBCITY SECTOR FILES LIST (Modern SaaS Table & Filter)          */}
      {/* ========================================================================= */}
      {navState.view === 'subcity-sector-files' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Modern Filter Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setNavState({
                      ...navState,
                      categoryFilter: cat,
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                    navState.categoryFilter === cat
                      ? 'bg-[#22177a] text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Modern Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="በርዕስ ወይም በቁጥር ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Files List */}
          {(() => {
            const files = documents.filter((d) => {
              const matchLevel = d.level === 'ክፍለ ከተማ';
              const matchSector = d.sector === navState.sector.name;
              const matchCat =
                navState.categoryFilter === 'ሁሉም' || d.category === navState.categoryFilter;
              const matchSearch =
                !searchQuery ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.code.toLowerCase().includes(searchQuery.toLowerCase());
              return matchLevel && matchSector && matchCat && matchSearch;
            });

            if (files.length === 0) {
              return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">በዚህ ዘርፍ የተመዘገበ ሰነድ የለም</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    አዲስ ሰነድ ለማስገባት ከስር ያለውን አዝራር ይጫኑ።
                  </p>
                  <button
                    onClick={() =>
                      onOpenUpload({ level: 'ክፍለ ከተማ', sector: navState.sector.name })
                    }
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    + ሰነድ አሁን መዝግብ
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-2.5">
                {files.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20">
                          {doc.code}
                        </span>
                        <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {doc.quarter} ({doc.year})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            doc.status === 'የጸደቀ'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.status === 'ማሻሻያ የተጠየቀበት'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'የጸደቀ'
                                ? 'bg-emerald-500'
                                : doc.status === 'ማሻሻያ የተጠየቀበት'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">{doc.title}</h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>መዝጋቢ፦ <strong className="text-slate-700">{doc.uploaderName}</strong></span>
                        <span>•</span>
                        <span>ቀን፦ <strong className="font-mono text-slate-700">{doc.uploadDate}</strong></span>
                        <span>•</span>
                        <span>መጠን፦ <strong className="font-mono text-slate-700">{doc.fileSize} ({doc.fileType})</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() =>
                          onOpenQR(`ሰነድ - ${doc.title}`, doc.code, 'ሰነድ', {
                            sector: doc.sector,
                            category: doc.category,
                            date: doc.uploadDate,
                          })
                        }
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 transition-all shadow-xs"
                        title="QR ኮድ አውጣ"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenFeedback(doc)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span>ገምግም / ውሳኔ ስጥ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FLOW 2: WOREDAS LIST (14 Woredas Modern Grid)                          */}
      {/* ========================================================================= */}
      {navState.view === 'woredas' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              የወረዳውን ዘርፎች ለመክፈት የሚፈልጉትን ወረዳ ይምረጡ፦
            </p>
            <span className="text-[11px] font-bold text-slate-400">14ቱ የወረዳ ካቢኔቶች</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {woredas.map((w, idx) => {
              const woredaAllDocs = documents.filter((d) => d.woredaId === w.id);
              const isFirstWoreda = idx === 0;

              return (
                <div
                  key={w.id}
                  className={`rounded-2xl p-4.5 flex flex-col justify-between space-y-3.5 transition-all duration-300 relative overflow-hidden group ${
                    isFirstWoreda
                      ? 'bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white border border-amber-400/40 shadow-md hover:shadow-xl hover:shadow-[#22177a]/25 hover:-translate-y-1'
                      : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isFirstWoreda
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {w.boxCode}
                      </span>
                      <h3 className={`font-extrabold text-sm mt-1.5 ${isFirstWoreda ? 'text-white' : 'text-slate-900'}`}>
                        {w.name}
                      </h3>
                    </div>

                    <button
                      onClick={() =>
                        onOpenQR(`የ${w.name} ዲጂታል ካቢኔት`, `AKK-BOX-${w.id.toUpperCase()}`, 'ፋይል ቦክስ / አቃፊ', {
                          woreda: w.name,
                          boxCode: w.boxCode,
                          docCount: woredaAllDocs.length,
                        })
                      }
                      className={`p-1.5 rounded-xl transition-all ${
                        isFirstWoreda
                          ? 'border border-white/20 bg-white/10 hover:bg-white hover:text-[#22177a] text-white'
                          : 'border border-slate-200 bg-slate-50 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700'
                      }`}
                      title="የወረዳው QR ኮድ"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className={`text-xs flex items-center justify-between pt-2.5 border-t relative z-10 ${
                    isFirstWoreda ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>ጠቅላላ ፋይሎች፦</span>
                    <strong className={`font-mono text-sm font-bold ${isFirstWoreda ? 'text-white' : 'text-slate-900'}`}>
                      {woredaAllDocs.length}
                    </strong>
                  </div>

                  <button
                    onClick={() => setNavState({ view: 'woreda-sectors', woreda: w })}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-xs ${
                      isFirstWoreda
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                        : 'bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-md'
                    }`}
                  >
                    <span>ዘርፎችን ክፈት</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {isFirstWoreda && (
                    <div className="absolute -right-2 -bottom-2 opacity-25 pointer-events-none group-hover:scale-110 transition-transform">
                      <PartyFlameSwoosh size="sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FLOW 2: WOREDA SECTORS GRID                                            */}
      {/* ========================================================================= */}
      {navState.view === 'woreda-sectors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                የተመረጠው ወረዳ፦
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                {navState.woreda.name} <span className="font-mono text-sm text-[#22177a]">({navState.woreda.boxCode})</span>
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-50 rounded-full border border-slate-200 font-bold text-slate-700">
              5ቱ የወረዳው ዘርፎች
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            ፋይሎችን ለመመልከት የሚፈልጉትን የወረዳውን ዘርፍ ይምረጡ፦
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec, idx) => {
              const woredaSecDocs = documents.filter(
                (d) => d.woredaId === navState.woreda.id && d.sector === sec.name
              );
              const needsRevision = woredaSecDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት').length;
              const isFirst = idx === 0;

              return (
                <div
                  key={sec.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden group ${
                    isFirst
                      ? 'bg-gradient-to-br from-[#22177a] via-[#1a1163] to-[#120947] text-white border border-amber-400/40 shadow-md hover:shadow-xl hover:shadow-[#22177a]/25 hover:-translate-y-1'
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

                    <button
                      onClick={() =>
                        onOpenQR(
                          `የ${navState.woreda.name} ${sec.name} ማህደር`,
                          `AKK-${navState.woreda.id.toUpperCase()}-${sec.code}`,
                          'ፋይል ቦክስ / አቃፊ',
                          {
                            woreda: navState.woreda.name,
                            sector: sec.name,
                            docCount: woredaSecDocs.length,
                          }
                        )
                      }
                      className={`p-2 rounded-xl transition-all ${
                        isFirst
                          ? 'border border-white/20 bg-white/10 hover:bg-white hover:text-[#22177a] text-white'
                          : 'border border-slate-200 bg-slate-50 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700'
                      }`}
                      title="የቦክስ QR ኮድ"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`text-xs space-y-1.5 pt-3 border-t relative z-10 ${
                    isFirst ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span>የተመዘገቡ ፋይሎች፦</span>
                      <strong className={`font-mono text-base font-extrabold ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                        {woredaSecDocs.length}
                      </strong>
                    </div>
                    {needsRevision > 0 && (
                      <div className="flex items-center justify-between text-amber-600 font-bold">
                        <span>ማሻሻያ የሚሹ፦</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-mono border border-amber-200">
                          {needsRevision}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setNavState({
                        view: 'woreda-sector-files',
                        woreda: navState.woreda,
                        sector: sec,
                        categoryFilter: 'ሁሉም',
                      })
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-xs ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                        : 'bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-md'
                    }`}
                  >
                    <span>ፋይሎችን ክፈት</span>
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
      {/* 6. FLOW 2: WOREDA SECTOR FILES LIST (Modern SaaS Table & Filter)           */}
      {/* ========================================================================= */}
      {navState.view === 'woreda-sector-files' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Modern Filter Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setNavState({
                      ...navState,
                      categoryFilter: cat,
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                    navState.categoryFilter === cat
                      ? 'bg-[#22177a] text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Modern Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="በርዕስ ወይም በቁጥር ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#22177a]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Files List */}
          {(() => {
            const files = documents.filter((d) => {
              const matchWoreda = d.woredaId === navState.woreda.id;
              const matchSector = d.sector === navState.sector.name;
              const matchCat =
                navState.categoryFilter === 'ሁሉም' || d.category === navState.categoryFilter;
              const matchSearch =
                !searchQuery ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.code.toLowerCase().includes(searchQuery.toLowerCase());
              return matchWoreda && matchSector && matchCat && matchSearch;
            });

            if (files.length === 0) {
              return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">በዚህ የወረዳ ዘርፍ እስካሁን የተመዘገበ ሰነድ የለም</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    አዲስ ሰነድ ለማስገባት ከስር ያለውን አዝራር ይጫኑ።
                  </p>
                  <button
                    onClick={() =>
                      onOpenUpload({
                        level: 'ወረዳ',
                        woredaId: navState.woreda.id,
                        sector: navState.sector.name,
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    + ሰነድ አሁን መዝግብ
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-2.5">
                {files.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#22177a]/10 text-[#22177a] border border-[#22177a]/20">
                          {doc.code}
                        </span>
                        <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {doc.quarter} ({doc.year})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            doc.status === 'የጸደቀ'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.status === 'ማሻሻያ የተጠየቀበት'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'የጸደቀ'
                                ? 'bg-emerald-500'
                                : doc.status === 'ማሻሻያ የተጠየቀበት'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">{doc.title}</h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>አቅራቢ፦ <strong className="text-slate-700">{doc.uploaderName}</strong></span>
                        <span>•</span>
                        <span>ቀን፦ <strong className="font-mono text-slate-700">{doc.uploadDate}</strong></span>
                        <span>•</span>
                        <span>መጠን፦ <strong className="font-mono text-slate-700">{doc.fileSize} ({doc.fileType})</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() =>
                          onOpenQR(`ሰነድ - ${doc.title}`, doc.code, 'ሰነድ', {
                            woreda: doc.woredaName,
                            sector: doc.sector,
                            category: doc.category,
                            date: doc.uploadDate,
                          })
                        }
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#22177a] hover:text-white hover:border-[#22177a] text-slate-700 transition-all shadow-xs"
                        title="QR ኮድ አውጣ"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenFeedback(doc)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22177a] to-[#311b92] text-white hover:shadow-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span>ገምግም / ውሳኔ ስጥ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
