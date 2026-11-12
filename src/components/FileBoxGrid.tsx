import React, { useState } from 'react';
import { 
  Folder, 
  QrCode, 
  ChevronRight, 
  Building2, 
  MapPin, 
  ArrowLeft,
  Lock,
  ShieldCheck,
  FolderLock
} from 'lucide-react';
import { Sector, Woreda, DocumentItem, DocumentCategory } from '../types/dms';
import { SECTORS, WOREDAS } from '../data/mockData';
import { User } from '../types/auth';

interface FileBoxGridProps {
  documents: DocumentItem[];
  currentUser: User;
  onOpenQR: (title: string, code: string, type: 'ሰነድ' | 'ፋይል ቦክስ / አቃፊ', metadata: any) => void;
  onSelectCategory: (sectorOrWoreda: string, category: DocumentCategory) => void;
}

export const FileBoxGrid: React.FC<FileBoxGridProps> = ({
  documents,
  currentUser,
  onOpenQR,
  onSelectCategory,
}) => {
  const isSuperAdmin = currentUser.role === 'SUBCITY_SUPER_ADMIN';
  const isSubcitySector = currentUser.role === 'SUBCITY_SECTOR_ADMIN';
  const isWoredaSuper = currentUser.role === 'WOREDA_SUPER_ADMIN';
  const isWoredaSector = currentUser.role === 'WOREDA_SECTOR_ADMIN';

  const [levelView, setLevelView] = useState<'ክፍለ ከተማ' | 'ወረዳ'>(
    isWoredaSuper || isWoredaSector ? 'ወረዳ' : 'ክፍለ ከተማ'
  );

  const [selectedBox, setSelectedBox] = useState<{
    id: string;
    title: string;
    code: string;
    level: 'ክፍለ ከተማ' | 'ወረዳ';
  } | null>(null);

  const categories: DocumentCategory[] = ['ዕቅድ', 'ሪፖርት', 'ደብዳቤ', 'ሰርኩላር', 'ሌሎች'];

  // Count docs for category strictly within the current box
  const getDocCountForCategory = (boxTitle: string, cat: DocumentCategory, level: 'ክፍለ ከተማ' | 'ወረዳ') => {
    if (isWoredaSector) {
      return documents.filter(
        (d) =>
          d.woredaId === currentUser.woredaId &&
          d.sector === currentUser.sectorName &&
          d.category === cat
      ).length;
    }
    if (level === 'ክፍለ ከተማ') {
      return documents.filter((d) => d.sector === boxTitle && d.category === cat && d.level === 'ክፍለ ከተማ').length;
    } else {
      return documents.filter((d) => d.woredaName === boxTitle && d.category === cat).length;
    }
  };

  return (
    <div className="space-y-4">
      {/* Level View Switcher & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-black tracking-tight">
              የዲጂታል ፋይል ቦክስ ማህደር (Digital File Cabinet)
            </h2>
            <span className="text-[10px] px-2 py-0.5 border border-black bg-neutral-100 font-mono font-bold">
              {isSuperAdmin
                ? 'ሙሉ ፍቃድ (19 ቦክሶች)'
                : isSubcitySector
                ? `${currentUser.sectorName} ብቻ`
                : isWoredaSuper
                ? `${currentUser.woredaName} ብቻ`
                : `${currentUser.woredaName} • ${currentUser.sectorName}`}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            {isSuperAdmin && 'የ14ቱ ወረዳዎች እና የ5ቱ ማዕከላዊ ዘርፎች ዲጂታል ካቢኔቶች'}
            {isSubcitySector && `የ${currentUser.sectorName} ማዕከላዊ ማህደር እና በ14ቱ ወረዳዎች ያሉ የዘርፉ ቋቶች`}
            {isWoredaSuper && `የ${currentUser.woredaName} ይፋዊ ካቢኔት እና በስሩ የሚገኙ 5ቱ ዘርፎች`}
            {isWoredaSector && `የ${currentUser.woredaName} ${currentUser.sectorName} ይፋዊ አቃፊዎች`}
          </p>
        </div>

        {/* Level Switcher: ONLY for Super Admin and Subcity Sector Admin */}
        {(isSuperAdmin || isSubcitySector) && (
          <div className="inline-flex border-2 border-black p-0.5 bg-neutral-100 self-start sm:self-auto">
            <button
              onClick={() => {
                setLevelView('ክፍለ ከተማ');
                setSelectedBox(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-colors ${
                levelView === 'ክፍለ ከተማ'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isSubcitySector ? 'ማዕከላዊ ዘርፍ' : 'ክፍለ ከተማ (5 ዘርፎች)'}</span>
            </button>
            <button
              onClick={() => {
                setLevelView('ወረዳ');
                setSelectedBox(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-colors ${
                levelView === 'ወረዳ'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isSubcitySector ? 'በወረዳዎች ያሉ ቋቶች' : 'ወረዳዎች (14 ወረዳዎች)'}</span>
            </button>
          </div>
        )}

        {/* Lock Notice for Woreda users */}
        {(isWoredaSuper || isWoredaSector) && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 border border-neutral-300 px-2 py-1 bg-neutral-50 self-start sm:self-auto">
            <Lock className="w-3 h-3 text-black" />
            <span>ወደ ሌላ ወረዳ መግባት በጥብቅ የተከለከለ ነው</span>
          </div>
        )}
      </div>

      {/* --- SCENARIO 1: WOREDA SECTOR ADMIN (Directly show their 5 subfolders) --- */}
      {isWoredaSector && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-neutral-50 p-3 border-2 border-black">
            <div>
              <span className="text-[10px] font-mono border border-black px-1.5 py-0.2 bg-white">
                ቦክስ-{currentUser.woredaId?.toUpperCase()}-{currentUser.sectorId?.toUpperCase()}
              </span>
              <h3 className="font-bold text-sm text-black mt-1">
                {currentUser.woredaName} • {currentUser.sectorName} ማህደር
              </h3>
            </div>

            <button
              onClick={() =>
                onOpenQR(
                  `የ${currentUser.woredaName} ${currentUser.sectorName} ማህደር`,
                  `AKK-${currentUser.woredaId?.toUpperCase()}-${currentUser.sectorId?.toUpperCase()}`,
                  'ፋይል ቦክስ / አቃፊ',
                  {
                    woreda: currentUser.woredaName,
                    sector: currentUser.sectorName,
                  }
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>የቦክስ QR ኮድ አውጣ</span>
            </button>
          </div>

          <div className="text-xs font-bold text-neutral-700">
            የዘርፉ 5ቱ ይፋዊ ንዑስ አቃፊዎች (Folders)፦
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const count = getDocCountForCategory(currentUser.woredaName || 'ወረዳ', cat, 'ወረዳ');
              return (
                <div
                  key={cat}
                  onClick={() => onSelectCategory(currentUser.sectorName || 'ዘርፍ', cat)}
                  className="border-2 border-black p-3 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-5 h-5 text-black" />
                    <div>
                      <div className="font-bold text-xs text-black">{cat}</div>
                      <div className="text-[10px] text-neutral-500">2017 ዓ.ም ማህደር</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100">
                      {count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SCENARIO 2: WOREDA SUPER ADMIN (Show ONLY their Woreda's 5 sectors) --- */}
      {isWoredaSuper && !selectedBox && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-neutral-50 p-3 border-2 border-black">
            <div>
              <span className="text-[10px] font-mono border border-black px-1.5 py-0.2 bg-white">
                ቦክስ-{currentUser.woredaId?.toUpperCase()}
              </span>
              <h3 className="font-bold text-sm text-black mt-1">
                የ{currentUser.woredaName} ዲጂታል ፋይል ቦክስ
              </h3>
              <p className="text-[11px] text-neutral-600">
                በ{currentUser.woredaName} ስር የሚገኙ 5ቱ ይፋዊ ዘርፎች ቋቶች
              </p>
            </div>

            <button
              onClick={() =>
                onOpenQR(
                  `የ${currentUser.woredaName} ፋይል ቦክስ`,
                  `AKK-BOX-${currentUser.woredaId?.toUpperCase()}`,
                  'ፋይል ቦክስ / አቃፊ',
                  {
                    woreda: currentUser.woredaName,
                  }
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>የወረዳውን QR አውጣ</span>
            </button>
          </div>

          <div className="text-xs font-bold text-neutral-700">
            በወረዳው ውስጥ የሚገኙ 5ቱ ዘርፎች፦
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SECTORS.map((sec) => {
              const secDocs = documents.filter(
                (d) => d.woredaId === currentUser.woredaId && d.sector === sec.name
              );
              return (
                <div
                  key={sec.id}
                  className="border-2 border-black bg-white p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold border border-black px-1.5 py-0.5 bg-neutral-100">
                        {sec.code}
                      </span>
                      <button
                        onClick={() =>
                          onOpenQR(
                            `የ${currentUser.woredaName} ${sec.name}`,
                            `AKK-${currentUser.woredaId?.toUpperCase()}-${sec.code}`,
                            'ፋይል ቦክስ / አቃፊ',
                            {
                              woreda: currentUser.woredaName,
                              sector: sec.name,
                            }
                          )
                        }
                        className="p-1 border border-neutral-300 hover:border-black"
                      >
                        <QrCode className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-black mb-1">{sec.name}</h3>
                    <p className="text-[11px] text-neutral-600 mb-3">
                      ዕቅድ፣ ሪፖርት፣ ሰርኩላር እና ይፋዊ ደብዳቤዎች
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-2.5 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 text-[11px]">
                      ሰነዶች፦ <strong className="text-black font-mono">{secDocs.length}</strong>
                    </span>
                    <button
                      onClick={() =>
                        setSelectedBox({
                          id: sec.id,
                          title: sec.name,
                          code: `${currentUser.woredaName}-${sec.code}`,
                          level: 'ወረዳ',
                        })
                      }
                      className="font-bold text-black hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <span>አቃፊዎችን ክፈት</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- DRILL DOWN INTO A BOX SUBFOLDERS (For Subcity and Woreda Super) --- */}
      {selectedBox && !isWoredaSector && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-neutral-50 p-3 border-2 border-black">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedBox(null)}
                className="p-1 border border-black hover:bg-neutral-200"
                title="ወደ ኋላ ተመለስ"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-mono border border-black px-1.5 py-0.2 bg-white">
                  {selectedBox.code}
                </span>
                <h3 className="font-bold text-sm text-black">{selectedBox.title}</h3>
              </div>
            </div>

            <button
              onClick={() =>
                onOpenQR(
                  `የፋይል ቦክስ ማህደር - ${selectedBox.title}`,
                  selectedBox.code,
                  'ፋይል ቦክስ / አቃፊ',
                  { sector: selectedBox.title }
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>የቦክስ QR ኮድ አውጣ</span>
            </button>
          </div>

          <div className="text-xs font-bold text-neutral-700">
            በቦክሱ ውስጥ ያሉ 5ቱ ንዑስ አቃፊዎች፦
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const count = getDocCountForCategory(selectedBox.title, cat, selectedBox.level);
              return (
                <div
                  key={cat}
                  onClick={() => onSelectCategory(selectedBox.title, cat)}
                  className="border-2 border-black p-3 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-5 h-5 text-black" />
                    <div>
                      <div className="font-bold text-xs text-black">{cat}</div>
                      <div className="text-[10px] text-neutral-500">2017 ዓ.ም ማህደር</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 border border-black bg-neutral-100">
                      {count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SCENARIO 3: SUBCITY SUPER ADMIN & SUBCITY SECTOR ADMIN VIEWS --- */}
      {(isSuperAdmin || isSubcitySector) && !selectedBox && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {levelView === 'ክፍለ ከተማ' ? (
            /* Subcity Central Sectors */
            (isSubcitySector
              ? SECTORS.filter((s) => s.name === currentUser.sectorName)
              : SECTORS
            ).map((sector: Sector) => {
              const count = documents.filter(
                (d) => d.sector === sector.name && d.level === 'ክፍለ ከተማ'
              ).length;

              return (
                <div
                  key={sector.id}
                  className="border-2 border-black bg-white p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold border border-black px-1.5 py-0.5 bg-neutral-100">
                        {sector.boxCode}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQR(
                            `ፋይል ቦክስ - ${sector.name}`,
                            sector.boxCode,
                            'ፋይል ቦክስ / አቃፊ',
                            { sector: sector.name }
                          );
                        }}
                        className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                        title="የቦክስ QR ኮድ አትም"
                      >
                        <QrCode className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-black mb-1">{sector.name}</h3>
                    <p className="text-[11px] text-neutral-600 mb-3">
                      ዕቅድ፣ ሪፖርት፣ ሰርኩላር እና ይፋዊ ደብዳቤዎች
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-2.5 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 text-[11px]">
                      የተመዘገቡ ሰነዶች፦ <strong className="text-black font-mono">{count}</strong>
                    </span>
                    <button
                      onClick={() =>
                        setSelectedBox({
                          id: sector.id,
                          title: sector.name,
                          code: sector.boxCode,
                          level: 'ክፍለ ከተማ',
                        })
                      }
                      className="font-bold text-black hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <span>ክፈት</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            /* Woredas list */
            WOREDAS.map((woreda: Woreda) => {
              const woredaDocs = isSubcitySector
                ? documents.filter(
                    (d) => d.woredaId === woreda.id && d.sector === currentUser.sectorName
                  )
                : documents.filter((d) => d.woredaId === woreda.id);

              return (
                <div
                  key={woreda.id}
                  className="border-2 border-black bg-white p-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold border border-black px-1.5 py-0.2 bg-neutral-100">
                        {woreda.boxCode}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQR(
                            `ፋይል ቦክስ - ${woreda.name}`,
                            woreda.boxCode,
                            'ፋይል ቦክስ / አቃፊ',
                            { woreda: woreda.name }
                          );
                        }}
                        className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                        title="የቦክስ QR ኮድ አትም"
                      >
                        <QrCode className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-black mb-0.5">{woreda.name}</h3>
                    <p className="text-[11px] text-neutral-600 mb-2">
                      {isSubcitySector
                        ? `የ${currentUser.sectorName} ቋት`
                        : 'የወረዳው 5ቱም ዘርፎች ቋት'}
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-2 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 text-[11px]">
                      ሰነዶች፦ <strong className="text-black font-mono">{woredaDocs.length}</strong>
                    </span>
                    <button
                      onClick={() =>
                        setSelectedBox({
                          id: woreda.id,
                          title: woreda.name,
                          code: woreda.boxCode,
                          level: 'ወረዳ',
                        })
                      }
                      className="font-bold text-black hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <span>ክፈት</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
