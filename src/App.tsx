'use client';

import React, { useState } from 'react';
import { Sidebar, ActiveModuleType } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { UploadModal } from './components/UploadModal';
import { QRCodeModal } from './components/QRCodeModal';
import { QRVerifierModal } from './components/QRVerifierModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LoginScreen } from './components/LoginScreen';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';

// Dedicated Dashboards for DMS
import { SubcitySuperAdminDashboard } from './components/dashboards/SubcitySuperAdminDashboard';
import { SubcitySectorDashboard } from './components/dashboards/SubcitySectorDashboard';
import { WoredaSuperAdminDashboard } from './components/dashboards/WoredaSuperAdminDashboard';
import { WoredaSectorDashboard } from './components/dashboards/WoredaSectorDashboard';

// Political Trends and Situation Analysis (PTAMIS)
import { SubcitySuperAdminTrends } from './components/trends/SubcitySuperAdminTrends';
import { TrendRegisterModal } from './components/trends/TrendRegisterModal';
import { TrendDetailModal } from './components/trends/TrendDetailModal';
import { TrendExecutiveReportModal } from './components/trends/TrendExecutiveReportModal';
import { TrendItem } from './types/trends';
import { INITIAL_TRENDS } from './data/mockTrends';

// Module 2.4: Idea Bank (የፅሁፍ ባንክ)
import { IdeaBankDashboard } from './components/ideabank/IdeaBankDashboard';
import { IdeaReaderModal } from './components/ideabank/IdeaReaderModal';
import { IdeaShareModal } from './components/ideabank/IdeaShareModal';
import { IdeaItem, IdeaComment } from './types/ideabank';
import { INITIAL_IDEAS } from './data/mockIdeaBank';

// Module 2.5: E-Library (ዲጂታል ቤተ-መፅሀፍት)
import { ELibraryDashboard } from './components/elibrary/ELibraryDashboard';
import { ELibraryReaderModal } from './components/elibrary/ELibraryReaderModal';
import { ELibraryMediaModal } from './components/elibrary/ELibraryMediaModal';
import { ELibraryUploadModal } from './components/elibrary/ELibraryUploadModal';
import { LibraryItem } from './types/elibrary';
import { INITIAL_LIBRARY_ITEMS } from './data/mockELibrary';

import { DocumentItem, FeedbackEntry, LevelType, Sector, Woreda } from './types/dms';
import { User, PRESET_USERS } from './types/auth';
import { INITIAL_DOCUMENTS, SECTORS as INITIAL_SECTORS, WOREDAS as INITIAL_WOREDAS } from './data/mockData';

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(PRESET_USERS[0]); // Default: Super Admin
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);

  // Active Module State ('dms' | 'trends' | 'ideabank' | 'elibrary')
  const [activeModule, setActiveModule] = useState<ActiveModuleType>('dms');

  // Master Data State (CRUD-able)
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [woredas, setWoredas] = useState<Woreda[]>(INITIAL_WOREDAS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [trends, setTrends] = useState<TrendItem[]>(INITIAL_TRENDS);
  const [ideas, setIdeas] = useState<IdeaItem[]>(INITIAL_IDEAS);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY_ITEMS);

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // DMS Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [uploadPrefill, setUploadPrefill] = useState<{
    level?: LevelType;
    woredaId?: string;
    sector?: string;
  }>({});
  const [isVerifierOpen, setIsVerifierOpen] = useState<boolean>(false);
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    title: string;
    code: string;
    type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ';
    metadata: any;
  }>({
    isOpen: false,
    title: '',
    code: '',
    type: 'ሰነድ',
    metadata: {},
  });
  const [feedbackDoc, setFeedbackDoc] = useState<DocumentItem | null>(null);

  // Trends Modals
  const [isTrendRegisterOpen, setIsTrendRegisterOpen] = useState<boolean>(false);
  const [trendRegisterPrefill, setTrendRegisterPrefill] = useState<{
    level?: 'ክፍለ ከተማ' | 'ወረዳ';
    woredaId?: string;
    sector?: string;
  }>({});
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState<boolean>(false);

  // Idea Bank Modals
  const [isIdeaShareOpen, setIsIdeaShareOpen] = useState<boolean>(false);
  const [selectedIdeaForReader, setSelectedIdeaForReader] = useState<IdeaItem | null>(null);

  // E-Library Modals
  const [isLibraryUploadOpen, setIsLibraryUploadOpen] = useState<boolean>(false);
  const [selectedLibraryItemForReader, setSelectedLibraryItemForReader] = useState<LibraryItem | null>(null);
  const [selectedLibraryItemForMedia, setSelectedLibraryItemForMedia] = useState<LibraryItem | null>(null);

  // If user is not logged in, show the official government Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  // Derive role scopes and filter documents accordingly
  const isSuperAdmin = currentUser.role === 'SUBCITY_SUPER_ADMIN';
  const isSubcitySector = currentUser.role === 'SUBCITY_SECTOR_ADMIN';
  const isWoredaSuper = currentUser.role === 'WOREDA_SUPER_ADMIN';
  const isWoredaSector = currentUser.role === 'WOREDA_SECTOR_ADMIN';

  // Role-filtered documents for the table views
  const roleFilteredDocs = documents.filter((doc) => {
    if (isSuperAdmin) return true;
    if (isSubcitySector) {
      return doc.sector === currentUser.sectorName;
    }
    if (isWoredaSuper) {
      return doc.woredaId === currentUser.woredaId;
    }
    if (isWoredaSector) {
      return (
        doc.woredaId === currentUser.woredaId &&
        doc.sector === currentUser.sectorName
      );
    }
    return true;
  });

  // Revisions count based on current user scope
  const scopedRevisions = roleFilteredDocs.filter((d) => d.status === 'ማሻሻያ የተጠየቀበት');
  const revisionCount = scopedRevisions.length;
  const roleScopeText = isSuperAdmin || isSubcitySector ? 'ክፍለ ከተማ' : 'ወረዳ';

  // Handlers for DMS
  const handleOpenQR = (
    title: string,
    code: string,
    type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ',
    metadata: any
  ) => {
    setQrModalData({
      isOpen: true,
      title,
      code,
      type,
      metadata,
    });
  };

  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    handleOpenQR(`ሰነድ - ${newDoc.title}`, newDoc.code, 'ሰነድ', {
      sector: newDoc.sector,
      woreda: newDoc.woredaName,
      category: newDoc.category,
      date: newDoc.uploadDate,
    });
  };

  const handleAddFeedback = (
    docId: string,
    feedback: FeedbackEntry,
    newStatus?: DocumentItem['status']
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: newStatus || doc.status,
            feedbacks: [...doc.feedbacks, feedback],
          };
        }
        return doc;
      })
    );
    setFeedbackDoc(null);
  };

  const handleReuploadRevised = (_doc: DocumentItem) => {
    setIsUploadOpen(true);
  };

  // Handlers for Trends
  const handleAddTrend = (newTrend: TrendItem) => {
    setTrends((prev) => [newTrend, ...prev]);
  };

  const handleUpdateTrendFeedback = (
    trendId: string,
    feedback: string,
    newStatus: TrendItem['status']
  ) => {
    setTrends((prev) =>
      prev.map((t) => {
        if (t.id === trendId) {
          return {
            ...t,
            feedback,
            status: newStatus,
          };
        }
        return t;
      })
    );
  };

  // Idea Bank Handlers
  const handleAddIdea = (newIdea: IdeaItem) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const handleAddIdeaComment = (ideaId: string, comment: IdeaComment) => {
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === ideaId
          ? { ...item, comments: [comment, ...item.comments] }
          : item
      )
    );
    setSelectedIdeaForReader((prev) =>
      prev && prev.id === ideaId
        ? { ...prev, comments: [comment, ...prev.comments] }
        : prev
    );
  };

  const handleToggleIdeaLike = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === ideaId
          ? { ...item, likesCount: item.likesCount + 1 }
          : item
      )
    );
  };

  // E-Library Handlers
  const handleAddLibraryItem = (newItem: LibraryItem) => {
    setLibraryItems((prev) => [newItem, ...prev]);
  };

  // Render role-appropriate main overview dashboard
  const renderDashboard = () => {
    if (isSuperAdmin) {
      return (
        <SubcitySuperAdminDashboard
          currentUser={currentUser}
          documents={documents}
          sectors={sectors}
          woredas={woredas}
          onOpenUpload={(prefill) => {
            if (prefill) {
              setUploadPrefill(prefill);
            } else {
              setUploadPrefill({});
            }
            setIsUploadOpen(true);
          }}
          onOpenQR={handleOpenQR}
          onOpenFeedback={(doc) => setFeedbackDoc(doc)}
        />
      );
    }

    if (isSubcitySector) {
      return (
        <SubcitySectorDashboard
          currentUser={currentUser}
          documents={documents}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenQR={handleOpenQR}
          onOpenFeedback={(doc) => setFeedbackDoc(doc)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );
    }

    if (isWoredaSuper) {
      return (
        <WoredaSuperAdminDashboard
          currentUser={currentUser}
          documents={documents}
          sectors={sectors}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenQR={handleOpenQR}
          onOpenFeedback={(doc) => setFeedbackDoc(doc)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );
    }

    // Woreda Sector Admin
    return (
      <WoredaSectorDashboard
        currentUser={currentUser}
        documents={documents}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenQR={handleOpenQR}
        onOpenFeedback={(doc) => setFeedbackDoc(doc)}
        onReuploadRevised={handleReuploadRevised}
      />
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-black flex flex-col md:flex-row font-sans">
      {/* Desktop & Mobile Drawer Sidebar with Azmamya Huneta Option */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        docCount={roleFilteredDocs.length}
        trendCount={trends.length}
        ideaCount={ideas.length}
        libraryCount={libraryItems.length}
        revisionCount={revisionCount}
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-6">
        {/* Simplified Government Header displaying current module */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          currentUser={currentUser}
          onOpenSwitchRole={() => setIsRoleSwitcherOpen(true)}
          activeModule={activeModule}
        />

        {/* Active Page Body - Modern Full-Width SaaS Workspace */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 transition-all">
          {activeModule === 'dms' && renderDashboard()}

          {activeModule === 'trends' && (
            <SubcitySuperAdminTrends
              currentUser={currentUser}
              trends={trends}
              sectors={sectors}
              woredas={woredas}
              onOpenRegister={(prefill) => {
                if (prefill) setTrendRegisterPrefill(prefill);
                else setTrendRegisterPrefill({});
                setIsTrendRegisterOpen(true);
              }}
              onOpenDetail={(trend) => setSelectedTrend(trend)}
              onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
            />
          )}

          {activeModule === 'ideabank' && (
            <IdeaBankDashboard
              currentUser={currentUser}
              ideas={ideas}
              onOpenShareModal={() => setIsIdeaShareOpen(true)}
              onOpenReader={(idea) => setSelectedIdeaForReader(idea)}
            />
          )}

          {activeModule === 'elibrary' && (
            <ELibraryDashboard
              currentUser={currentUser}
              items={libraryItems}
              onOpenUploadModal={() => setIsLibraryUploadOpen(true)}
              onOpenReader={(item) => setSelectedLibraryItemForReader(item)}
              onOpenMedia={(item) => setSelectedLibraryItemForMedia(item)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        revisionCount={revisionCount}
      />

      {/* Upload Document Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setUploadPrefill({});
        }}
        onAddDocument={handleAddDocument}
        currentUser={currentUser}
        defaultLevel={uploadPrefill.level || roleScopeText}
        defaultWoredaId={uploadPrefill.woredaId || currentUser.woredaId || 'wor-04'}
        defaultSector={uploadPrefill.sector}
      />

      {/* Printable QR Code Certificate Modal */}
      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData((prev) => ({ ...prev, isOpen: false }))}
        title={qrModalData.title}
        code={qrModalData.code}
        type={qrModalData.type}
        metadata={qrModalData.metadata}
      />

      {/* QR Verifier Modal */}
      <QRVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        documents={documents}
      />

      {/* Feedback & Review Modal */}
      <FeedbackModal
        isOpen={feedbackDoc !== null}
        onClose={() => setFeedbackDoc(null)}
        document={feedbackDoc}
        onAddFeedback={handleAddFeedback}
        currentUser={currentUser}
        onReuploadRevised={handleReuploadRevised}
      />

      {/* Trend Register Modal */}
      <TrendRegisterModal
        isOpen={isTrendRegisterOpen}
        onClose={() => setIsTrendRegisterOpen(false)}
        onAddTrend={handleAddTrend}
        currentUser={currentUser}
        prefill={trendRegisterPrefill}
      />

      {/* Trend Detail & Leadership Directive Modal */}
      <TrendDetailModal
        isOpen={selectedTrend !== null}
        onClose={() => setSelectedTrend(null)}
        trend={selectedTrend}
        currentUser={currentUser}
        onUpdateFeedback={handleUpdateTrendFeedback}
      />

      {/* 1-Page Executive Trend Briefing Report Modal */}
      <TrendExecutiveReportModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        trends={trends}
      />

      {/* Role Switcher Dialog */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setActiveTab('overview');
        }}
      />

      {/* Idea Share Modal */}
      <IdeaShareModal
        isOpen={isIdeaShareOpen}
        onClose={() => setIsIdeaShareOpen(false)}
        currentUser={currentUser}
        onAddIdea={handleAddIdea}
      />

      {/* Idea Reader Modal */}
      <IdeaReaderModal
        isOpen={selectedIdeaForReader !== null}
        onClose={() => setSelectedIdeaForReader(null)}
        idea={selectedIdeaForReader}
        currentUser={currentUser}
        onAddComment={handleAddIdeaComment}
        onToggleLike={handleToggleIdeaLike}
      />

      {/* E-Library Reader Modal */}
      <ELibraryReaderModal
        isOpen={selectedLibraryItemForReader !== null}
        onClose={() => setSelectedLibraryItemForReader(null)}
        item={selectedLibraryItemForReader}
      />

      {/* E-Library Media Modal (Video/Audio/Photos) */}
      <ELibraryMediaModal
        isOpen={selectedLibraryItemForMedia !== null}
        onClose={() => setSelectedLibraryItemForMedia(null)}
        item={selectedLibraryItemForMedia}
      />

      {/* E-Library Resource Ingestion / Upload Modal */}
      <ELibraryUploadModal
        isOpen={isLibraryUploadOpen}
        onClose={() => setIsLibraryUploadOpen(false)}
        currentUser={currentUser}
        onAddItem={handleAddLibraryItem}
      />
    </div>
  );
};

export default App;
