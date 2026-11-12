import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Layers,
  FolderArchive,
  Users
} from 'lucide-react';
import { Sector, Woreda } from '../types/dms';

interface StructureManagementProps {
  sectors: Sector[];
  setSectors: React.Dispatch<React.SetStateAction<Sector[]>>;
  woredas: Woreda[];
  setWoredas: React.Dispatch<React.SetStateAction<Woreda[]>>;
}

interface WoredaSectorItem {
  id: string;
  woredaId: string;
  name: string;
  focalPerson: string;
  boxCode: string;
  phone: string;
}

export const StructureManagement: React.FC<StructureManagementProps> = ({
  sectors,
  setSectors,
  woredas,
  setWoredas,
}) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'woredas' | 'woreda-sectors'>('sectors');

  // Sector form modal state
  const [sectorModalOpen, setSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [sectorName, setSectorName] = useState('');
  const [sectorCode, setSectorCode] = useState('');
  const [sectorBoxCode, setSectorBoxCode] = useState('');

  // Woreda form modal state
  const [woredaModalOpen, setWoredaModalOpen] = useState(false);
  const [editingWoreda, setEditingWoreda] = useState<Woreda | null>(null);
  const [woredaName, setWoredaName] = useState('');
  const [woredaNumber, setWoredaNumber] = useState<number>(15);
  const [woredaBoxCode, setWoredaBoxCode] = useState('');

  // Woreda Sector State
  const [selectedWoredaId, setSelectedWoredaId] = useState<string>('wor-04');
  const [woredaSectors, setWoredaSectors] = useState<WoredaSectorItem[]>([
    {
      id: 'ws-1',
      woredaId: 'wor-04',
      name: 'የፖለቲካ ዘርፍ',
      focalPerson: 'አቶ ካሳሁን ታደሰ',
      boxCode: 'ቦክስ-ወረዳ-04-ፖለ',
      phone: '0911223344',
    },
    {
      id: 'ws-2',
      woredaId: 'wor-04',
      name: 'የአደረጃጀት ዘርፍ',
      focalPerson: 'ወ/ሮ አልማዝ ኃይሉ',
      boxCode: 'ቦክስ-ወረዳ-04-አደ',
      phone: '0922334455',
    },
    {
      id: 'ws-3',
      woredaId: 'wor-04',
      name: 'የሴቶችና ወጣቶች ዘርፍ',
      focalPerson: 'ወ/ሮ ፋንቱ መኮንን',
      boxCode: 'ቦክስ-ወረዳ-04-ሴወ',
      phone: '0933445566',
    },
    {
      id: 'ws-4',
      woredaId: 'wor-04',
      name: 'የፋይናንስና ንብረት ዘርፍ',
      focalPerson: 'አቶ ታሪኩ አሰፋ',
      boxCode: 'ቦክስ-ወረዳ-04-ፋይ',
      phone: '0944556677',
    },
    {
      id: 'ws-5',
      woredaId: 'wor-04',
      name: 'የህዝብ ግንኙነት ዘርፍ',
      focalPerson: 'አቶ ዳዊት በቀለ',
      boxCode: 'ቦክስ-ወረዳ-04-ህግ',
      phone: '0955667788',
    },
  ]);

  const [woredaSectorModalOpen, setWoredaSectorModalOpen] = useState(false);
  const [editingWoredaSector, setEditingWoredaSector] = useState<WoredaSectorItem | null>(null);
  const [wsName, setWsName] = useState('');
  const [wsPerson, setWsPerson] = useState('');
  const [wsBoxCode, setWsBoxCode] = useState('');
  const [wsPhone, setWsPhone] = useState('');

  // Save Sector
  const handleSaveSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorName.trim()) return;

    if (editingSector) {
      setSectors((prev) =>
        prev.map((s) =>
          s.id === editingSector.id
            ? { ...s, name: sectorName.trim(), code: sectorCode.trim() || s.code, boxCode: sectorBoxCode.trim() || s.boxCode }
            : s
        )
      );
    } else {
      const newId = `sec-${Date.now().toString().slice(-4)}`;
      const newBoxCode = sectorBoxCode.trim() || `ቦክስ-ክ/ከተማ-0${sectors.length + 1}`;
      setSectors((prev) => [
        ...prev,
        {
          id: newId,
          name: sectorName.trim(),
          code: sectorCode.trim() || 'SEC',
          boxCode: newBoxCode,
        },
      ]);
    }
    setSectorModalOpen(false);
    setEditingSector(null);
    setSectorName('');
    setSectorCode('');
    setSectorBoxCode('');
  };

  // Delete Sector
  const handleDeleteSector = (id: string) => {
    if (confirm('እርግጠኛ ነዎት ይህን ዘርፍ መሰረዝ ይፈልጋሉ?')) {
      setSectors((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Save Woreda
  const handleSaveWoreda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!woredaName.trim()) return;

    if (editingWoreda) {
      setWoredas((prev) =>
        prev.map((w) =>
          w.id === editingWoreda.id
            ? { ...w, name: woredaName.trim(), number: woredaNumber, boxCode: woredaBoxCode.trim() || w.boxCode }
            : w
        )
      );
    } else {
      const numStr = woredaNumber < 10 ? `0${woredaNumber}` : `${woredaNumber}`;
      const newId = `wor-${numStr}`;
      setWoredas((prev) => [
        ...prev,
        {
          id: newId,
          number: woredaNumber,
          name: woredaName.trim(),
          boxCode: woredaBoxCode.trim() || `ቦክስ-ወረዳ-${numStr}`,
        },
      ]);
    }
    setWoredaModalOpen(false);
    setEditingWoreda(null);
    setWoredaName('');
    setWoredaBoxCode('');
  };

  // Delete Woreda
  const handleDeleteWoreda = (id: string) => {
    if (confirm('እርግጠኛ ነዎት ይህን ወረዳ መሰረዝ ይፈልጋሉ?')) {
      setWoredas((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // Save Woreda Sector
  const handleSaveWoredaSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;

    if (editingWoredaSector) {
      setWoredaSectors((prev) =>
        prev.map((item) =>
          item.id === editingWoredaSector.id
            ? {
                ...item,
                name: wsName.trim(),
                focalPerson: wsPerson.trim(),
                boxCode: wsBoxCode.trim(),
                phone: wsPhone.trim(),
              }
            : item
        )
      );
    } else {
      const newId = `ws-${Date.now().toString().slice(-4)}`;
      setWoredaSectors((prev) => [
        ...prev,
        {
          id: newId,
          woredaId: selectedWoredaId,
          name: wsName.trim(),
          focalPerson: wsPerson.trim(),
          boxCode: wsBoxCode.trim(),
          phone: wsPhone.trim(),
        },
      ]);
    }
    setWoredaSectorModalOpen(false);
    setEditingWoredaSector(null);
    setWsName('');
    setWsPerson('');
    setWsBoxCode('');
    setWsPhone('');
  };

  // Delete Woreda Sector
  const handleDeleteWoredaSector = (id: string) => {
    if (confirm('ይህን የወረዳ ዘርፍ መሰረዝ ይፈልጋሉ?')) {
      setWoredaSectors((prev) => prev.filter((ws) => ws.id !== id));
    }
  };

  const currentWoredaSectors = woredaSectors.filter(
    (ws) => ws.woredaId === selectedWoredaId
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b-2 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <span>የአደረጃጀት እና የዘርፎች ማስተዳደሪያ</span>
          </h2>
          <p className="text-xs text-neutral-600">
            የክፍለ ከተማው ዋና አስተዳዳሪ ዘርፎችን፣ ወረዳዎችን እና የወረዳ ዘርፎችን የሚቆጣጠርበት ክፍል
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex border-2 border-black p-0.5 bg-neutral-100 flex-wrap">
          <button
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors ${
              activeTab === 'sectors' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>የክ/ከተማ ዘርፎች ({sectors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('woredas')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors ${
              activeTab === 'woredas' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>ወረዳዎች ({woredas.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('woreda-sectors')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors ${
              activeTab === 'woreda-sectors' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>የወረዳ ዘርፎች</span>
          </button>
        </div>
      </div>

      {/* Content for SECTORS */}
      {activeTab === 'sectors' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
            <div className="text-xs font-bold text-black">
              በክፍለ ከተማው የተመዘገቡ ይፋዊ ዘርፎች ({sectors.length})
            </div>
            <button
              onClick={() => {
                setEditingSector(null);
                setSectorName('');
                setSectorCode('');
                setSectorBoxCode(`ቦክስ-ክ/ከተማ-0${sectors.length + 1}`);
                setSectorModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs font-bold hover:bg-neutral-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ዘርፍ ጨምር</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2 border-r">የቦክስ መለያ</th>
                  <th className="p-2 border-r">የዘርፉ ሙሉ ስም</th>
                  <th className="p-2 border-r">አጭር ኮድ</th>
                  <th className="p-2 border-r">የፋይል ሁኔታ</th>
                  <th className="p-2 text-center">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sectors.map((sector) => (
                  <tr key={sector.id} className="hover:bg-neutral-50">
                    <td className="p-2 font-mono font-bold border-r">{sector.boxCode}</td>
                    <td className="p-2 font-bold text-black border-r">{sector.name}</td>
                    <td className="p-2 font-mono border-r">{sector.code}</td>
                    <td className="p-2 border-r">
                      <span className="px-1.5 py-0.5 border border-black bg-neutral-100 text-[10px] font-bold">
                        ንቁ ፋይል ቦክስ
                      </span>
                    </td>
                    <td className="p-2 text-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingSector(sector);
                          setSectorName(sector.name);
                          setSectorCode(sector.code);
                          setSectorBoxCode(sector.boxCode);
                          setSectorModalOpen(true);
                        }}
                        className="p-1 border border-neutral-300 hover:border-black"
                        title="አስተካክል"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-black" />
                      </button>
                      <button
                        onClick={() => handleDeleteSector(sector.id)}
                        className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                        title="ሰርዝ"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-black" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for WOREDAS */}
      {activeTab === 'woredas' && (
        <div className="border-2 border-black bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
            <div className="text-xs font-bold text-black">
              በክፍለ ከተማው የተመዘገቡ ወረዳዎች ({woredas.length})
            </div>
            <button
              onClick={() => {
                setEditingWoreda(null);
                setWoredaNumber(woredas.length + 1);
                setWoredaName(`ወረዳ ${woredas.length + 1 < 10 ? '0' : ''}${woredas.length + 1}`);
                setWoredaBoxCode(`ቦክስ-ወረዳ-${woredas.length + 1 < 10 ? '0' : ''}${woredas.length + 1}`);
                setWoredaModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs font-bold hover:bg-neutral-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ወረዳ መዝግብ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2 border-r w-24">ተ.ቁ</th>
                  <th className="p-2 border-r">የወረዳው ስም</th>
                  <th className="p-2 border-r">የዲጂታል ቦክስ መለያ</th>
                  <th className="p-2 border-r">የዘርፎች ሁኔታ</th>
                  <th className="p-2 text-center w-28">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {woredas.map((woreda) => (
                  <tr key={woreda.id} className="hover:bg-neutral-50">
                    <td className="p-2 font-mono font-bold border-r">ወረዳ-{woreda.number}</td>
                    <td className="p-2 font-bold text-black border-r">{woreda.name}</td>
                    <td className="p-2 font-mono border-r">{woreda.boxCode}</td>
                    <td className="p-2 border-r">
                      <span className="text-[10px] text-neutral-600">
                        5ቱም ዘርፎች ንቁ ናቸው
                      </span>
                    </td>
                    <td className="p-2 text-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingWoreda(woreda);
                          setWoredaName(woreda.name);
                          setWoredaNumber(woreda.number);
                          setWoredaBoxCode(woreda.boxCode);
                          setWoredaModalOpen(true);
                        }}
                        className="p-1 border border-neutral-300 hover:border-black"
                        title="አስተካክል"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-black" />
                      </button>
                      <button
                        onClick={() => handleDeleteWoreda(woreda.id)}
                        className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                        title="ሰርዝ"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-black" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for WOREDA SECTORS */}
      {activeTab === 'woreda-sectors' && (
        <div className="border-2 border-black bg-white p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-300 pb-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-black">ወረዳ ምረጥ፦</label>
              <select
                value={selectedWoredaId}
                onChange={(e) => setSelectedWoredaId(e.target.value)}
                className="border-2 border-black px-2 py-1 text-xs font-bold bg-white"
              >
                {woredas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingWoredaSector(null);
                setWsName('');
                setWsPerson('');
                setWsBoxCode(`ቦክስ-${woredas.find((w) => w.id === selectedWoredaId)?.name || 'ወረዳ'}-ዘርፍ`);
                setWsPhone('');
                setWoredaSectorModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs font-bold hover:bg-neutral-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ የወረዳ ዘርፍ መዝግብ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                <tr>
                  <th className="p-2 border-r">የዘርፉ ስም</th>
                  <th className="p-2 border-r">ተጠሪ/ኃላፊ</th>
                  <th className="p-2 border-r">ስልክ ቁጥር</th>
                  <th className="p-2 border-r">የቦክስ መለያ</th>
                  <th className="p-2 text-center">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {currentWoredaSectors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-neutral-500">
                      ለዚህ ወረዳ የተመዘገበ ዘርፍ የለም። አዲስ ዘርፍ መዝግብ።
                    </td>
                  </tr>
                ) : (
                  currentWoredaSectors.map((ws) => (
                    <tr key={ws.id} className="hover:bg-neutral-50">
                      <td className="p-2 font-bold text-black border-r">{ws.name}</td>
                      <td className="p-2 font-medium border-r">{ws.focalPerson}</td>
                      <td className="p-2 font-mono border-r text-neutral-700">{ws.phone}</td>
                      <td className="p-2 font-mono border-r">{ws.boxCode}</td>
                      <td className="p-2 text-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingWoredaSector(ws);
                            setWsName(ws.name);
                            setWsPerson(ws.focalPerson);
                            setWsBoxCode(ws.boxCode);
                            setWsPhone(ws.phone);
                            setWoredaSectorModalOpen(true);
                          }}
                          className="p-1 border border-neutral-300 hover:border-black"
                          title="አስተካክል"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-black" />
                        </button>
                        <button
                          onClick={() => handleDeleteWoredaSector(ws.id)}
                          className="p-1 border border-neutral-300 hover:border-black hover:bg-neutral-100"
                          title="ሰርዝ"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-black" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sector Modal */}
      {sectorModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-xs font-bold text-black">
                {editingSector ? 'ዘርፍ አስተካክል' : 'አዲስ የክ/ከተማ ዘርፍ ምዝገባ'}
              </span>
              <button onClick={() => setSectorModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSector} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">የዘርፉ ሙሉ ስም፦</label>
                <input
                  type="text"
                  required
                  value={sectorName}
                  onChange={(e) => setSectorName(e.target.value)}
                  placeholder="ለምሳሌ፡ የህግና ፍትህ ዘርፍ"
                  className="w-full border border-black p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">አጭር ኮድ፦</label>
                <input
                  type="text"
                  value={sectorCode}
                  onChange={(e) => setSectorCode(e.target.value)}
                  placeholder="የዘርፉ አጭር መለያ ኮድ..."
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">የፋይል ቦክስ መለያ፦</label>
                <input
                  type="text"
                  value={sectorBoxCode}
                  onChange={(e) => setSectorBoxCode(e.target.value)}
                  placeholder="ለምሳሌ፡ ቦክስ-ክ/ከተማ-06"
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-300">
                <button
                  type="button"
                  onClick={() => setSectorModalOpen(false)}
                  className="px-3 py-1 border border-black"
                >
                  ይቅር
                </button>
                <button type="submit" className="px-3 py-1 bg-black text-white font-bold">
                  መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Woreda Modal */}
      {woredaModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-xs font-bold text-black">
                {editingWoreda ? 'ወረዳ አስተካክል' : 'አዲስ ወረዳ ምዝገባ'}
              </span>
              <button onClick={() => setWoredaModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWoreda} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">የወረዳው ስም፦</label>
                <input
                  type="text"
                  required
                  value={woredaName}
                  onChange={(e) => setWoredaName(e.target.value)}
                  placeholder="ለምሳሌ፡ ወረዳ 15"
                  className="w-full border border-black p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">የወረዳ ቁጥር፦</label>
                <input
                  type="number"
                  required
                  value={woredaNumber}
                  onChange={(e) => setWoredaNumber(parseInt(e.target.value) || 1)}
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">የፋይል ቦክስ መለያ፦</label>
                <input
                  type="text"
                  value={woredaBoxCode}
                  onChange={(e) => setWoredaBoxCode(e.target.value)}
                  placeholder="ለምሳሌ፡ ቦክስ-ወረዳ-15"
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-300">
                <button
                  type="button"
                  onClick={() => setWoredaModalOpen(false)}
                  className="px-3 py-1 border border-black"
                >
                  ይቅር
                </button>
                <button type="submit" className="px-3 py-1 bg-black text-white font-bold">
                  መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Woreda Sector Modal */}
      {woredaSectorModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-xs font-bold text-black">
                {editingWoredaSector ? 'የወረዳ ዘርፍ አስተካክል' : 'አዲስ የወረዳ ዘርፍ ምዝገባ'}
              </span>
              <button onClick={() => setWoredaSectorModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWoredaSector} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">የዘርፉ ስም፦</label>
                <input
                  type="text"
                  required
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  placeholder="ለምሳሌ፡ የፖለቲካ ዘርፍ"
                  className="w-full border border-black p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">ኃላፊ / ተጠሪ፦</label>
                <input
                  type="text"
                  required
                  value={wsPerson}
                  onChange={(e) => setWsPerson(e.target.value)}
                  placeholder="ለምሳሌ፡ አቶ ካሳሁን ታደሰ"
                  className="w-full border border-black p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">ስልክ ቁጥር፦</label>
                <input
                  type="text"
                  value={wsPhone}
                  onChange={(e) => setWsPhone(e.target.value)}
                  placeholder="0911..."
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">የቦክስ መለያ፦</label>
                <input
                  type="text"
                  value={wsBoxCode}
                  onChange={(e) => setWsBoxCode(e.target.value)}
                  placeholder="ቦክስ-ወረዳ-..."
                  className="w-full border border-black p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-300">
                <button
                  type="button"
                  onClick={() => setWoredaSectorModalOpen(false)}
                  className="px-3 py-1 border border-black"
                >
                  ይቅር
                </button>
                <button type="submit" className="px-3 py-1 bg-black text-white font-bold">
                  መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
