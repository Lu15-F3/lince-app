
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  HardDrive, 
  Trash2, 
  FileText, 
  Download, 
  Sun, 
  Moon, 
  Cat,
  Settings,
  Info,
  LayoutGrid,
  Monitor,
  Boxes,
  Database,
  Terminal,
  Activity,
  AlertTriangle,
  Lock,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { UserProfile, DiskType, Disk, Partition, BootMode } from './types';
import { DISTROS, PROFILE_COLORS, PARTITION_INFO } from './constants';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(UserProfile.BASIC);
  const [bootMode, setBootMode] = useState<BootMode>(BootMode.UEFI);
  const [dualBoot, setDualBoot] = useState<boolean>(false);
  const [ram, setRam] = useState<number>(8);
  const [distro, setDistro] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [disks, setDisks] = useState<Disk[]>([{ id: '1', size: 240, type: DiskType.SSD, preservedSize: 0 }]);
  const [sepHome, setSepHome] = useState<boolean>(false); 
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [advOptions, setAdvOptions] = useState({
    var: true,
    opt: false,
    srv: false,
    tmp: false
  });

  useEffect(() => {
    setDistro(DISTROS[profile][0]);
  }, [profile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleAdvOption = (key: string) => {
    if (profile === UserProfile.ADVANCED && key in advOptions) {
      setAdvOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof advOptions] }));
    }
  };

  const addDisk = () => {
    if (disks.length < 4) {
      setDisks([...disks, { id: Date.now().toString(), size: 500, type: DiskType.HDD, preservedSize: 0 }]);
    }
  };

  const removeDisk = (id: string) => {
    if (disks.length > 1) {
      setDisks(disks.filter(d => d.id !== id));
    }
  };

  const updateDisk = (id: string, updates: Partial<Disk>) => {
    setDisks(disks.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const formatSize = (gb: number) => {
    if (gb < 1) return `${Math.round(gb * 1024)} MB`;
    return `${gb.toFixed(1)} GB`;
  };

  const partitionPlan = useMemo(() => {
    const partitions: Partition[] = [];
    const isAdvanced = profile === UserProfile.ADVANCED;
    const isMedium = profile === UserProfile.MEDIUM;
    const isBasic = profile === UserProfile.BASIC;

    if (dualBoot && disks[0].preservedSize && disks[0].preservedSize > 0) {
      partitions.push({
        point: 'SO Existente', 
        size: disks[0].preservedSize, 
        color: '#64748b', 
        diskIndex: 0, 
        fileSystem: 'NTFS/Outro', 
        description: 'NÃO FORMATAR: Espaço Reservado',
        isPreserved: true
      });
    }

    if (bootMode === BootMode.UEFI) {
      partitions.push({
        point: '/boot/efi', 
        size: dualBoot ? 0.8 : 0.6, 
        color: '#475569', 
        diskIndex: 0, 
        fileSystem: 'FAT32', 
        description: dualBoot ? 'EFI (Compartilhado/Novo)' : 'UEFI System Partition'
      });
    } else {
      partitions.push({
        point: '/boot', size: 1.0, color: '#1e293b', diskIndex: 0, fileSystem: 'Ext4', description: 'Legacy Boot Loader'
      });
    }

    let swapSize = 4;
    if (isBasic) swapSize = ram <= 4 ? ram : 4;
    if (isMedium) swapSize = ram; 
    if (isAdvanced) swapSize = ram + 2; 
    
    partitions.push({
      point: 'Swap', size: swapSize, color: '#94a3b8', diskIndex: 0, fileSystem: 'SWAP', description: isMedium || isAdvanced ? 'Hibernation Support' : 'Virtual Memory'
    });

    const fs = isBasic ? 'Ext4' : 'Btrfs';

    if (isMedium) {
      partitions.push({ point: '/var', size: 20, color: '#818cf8', diskIndex: 0, fileSystem: fs, description: 'Logs & System Caches' });
    }

    if (isAdvanced) {
      if (advOptions.var) partitions.push({ point: '/var', size: 25, color: '#818cf8', diskIndex: 0, fileSystem: fs, description: 'Logs & Spool' });
      if (advOptions.opt) partitions.push({ point: '/opt', size: 20, color: '#ec4899', diskIndex: 0, fileSystem: fs, description: 'Third-party Apps' });
      if (advOptions.srv) partitions.push({ point: '/srv', size: 15, color: '#10b981', diskIndex: 0, fileSystem: fs, description: 'Service Data' });
      if (advOptions.tmp) partitions.push({ point: '/tmp', size: 10, color: '#f97316', diskIndex: 0, fileSystem: fs, description: 'Temp Files' });
    }

    const wantsSepHome = isMedium || isAdvanced || (isBasic && sepHome);
    const hasSecondDisk = disks.length > 1;
    
    const overheadOnD1 = partitions.filter(p => p.diskIndex === 0).reduce((acc, p) => acc + p.size, 0);
    const d1Available = Math.max(0, disks[0].size - overheadOnD1);

    if (!wantsSepHome) {
      partitions.push({
        point: '/', 
        size: d1Available, 
        color: '#3b82f6', 
        diskIndex: 0, 
        fileSystem: fs, 
        description: 'SISTEMA + HOME (Seus arquivos ficam aqui)' 
      });
    } else {
      if (hasSecondDisk) {
        partitions.push({
          point: '/', 
          size: d1Available, 
          color: '#3b82f6', 
          diskIndex: 0, 
          fileSystem: fs, 
          description: 'Apenas Arquivos do Sistema' 
        });
        partitions.push({
          point: '/home', 
          size: disks[1].size, 
          color: '#f59e0b', 
          diskIndex: 1, 
          fileSystem: fs, 
          description: 'Disco Exclusivo para seus Dados' 
        });
      } else {
        const rootSize = d1Available > 100 ? 60 : d1Available * 0.4;
        partitions.push({
          point: '/', 
          size: rootSize, 
          color: '#3b82f6', 
          diskIndex: 0, 
          fileSystem: fs, 
          description: 'Raiz do Sistema' 
        });
        partitions.push({
          point: '/home', 
          size: d1Available - rootSize, 
          color: '#f59e0b', 
          diskIndex: 0, 
          fileSystem: fs, 
          description: 'Sua pasta pessoal separada' 
        });
      }
    }

    for (let i = 2; i < disks.length; i++) {
      partitions.push({
        point: `/mnt/extra${i-1}`, 
        size: disks[i].size, 
        color: i === 2 ? '#a855f7' : '#06b6d4', 
        diskIndex: i, 
        fileSystem: 'Ext4/ExFAT', 
        description: 'Armazenamento de Dados Adicional'
      });
    }

    return partitions;
  }, [profile, ram, disks, sepHome, bootMode, advOptions, dualBoot]);

  const extendedReportPlan = useMemo(() => {
    const report = [...partitionPlan];
    const isBasic = profile === UserProfile.BASIC;
    const isMedium = profile === UserProfile.MEDIUM;
    const isAdvanced = profile === UserProfile.ADVANCED;
    const wantsSepHome = isMedium || isAdvanced || (isBasic && sepHome);

    if (!wantsSepHome) {
      report.push({
        point: '/home (Integrada)',
        size: 0,
        color: '#f59e0b',
        diskIndex: 0,
        fileSystem: 'Ext4',
        description: 'Mora dentro da partição Raiz (/). Não requer partição própria.',
        isVirtual: true
      });
    }
    return report;
  }, [partitionPlan, sepHome, profile]);

  const visibleWiki = useMemo(() => {
    return PARTITION_INFO.filter(info => {
      if (info.point === 'DUAL_BOOT') return dualBoot;
      if (info.point === 'EXTRA_DISKS') return disks.length >= 3;
      if (info.point === '/home') return true;

      const profileRank = { [UserProfile.BASIC]: 1, [UserProfile.MEDIUM]: 2, [UserProfile.ADVANCED]: 3 };
      const currentRank = profileRank[profile];
      return info.profiles.some(p => profileRank[p] <= currentRank);
    });
  }, [dualBoot, disks.length, profile]);

  const exportToTXT = () => {
    let content = `LINCE - PLANO DE PARTICIONAMENTO\n==========================================\n\nPREPARO ESSENCIAL:\nAntes de dar o boot no pendrive, acesse o BIOS e desative o Secure Boot e o Fast Boot. Mude o modo SATA para AHCI se necessário.\n\n`;
    extendedReportPlan.forEach(p => content += `${p.point.padEnd(15)} | ${p.size > 0 ? formatSize(p.size).padEnd(10) : 'Integrada'} | Disco ${p.diskIndex + 1} | ${p.fileSystem}\n`);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lince-plano.txt`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('LINCE - PLANO DE PARTICIONAMENTO', 20, 20);
    let y = 30;
    extendedReportPlan.forEach(p => {
      doc.text(`${p.point}: ${p.size > 0 ? formatSize(p.size) : 'Integrada'} (Disco ${p.diskIndex + 1})`, 20, y);
      y += 10;
    });
    doc.save(`lince-plano.pdf`);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-3xl ${PROFILE_COLORS[profile]} transition-all duration-700 shadow-2xl border-2`}>
              <Cat size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">LINCE</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                <Terminal size={10} /> Pro Partition Planner
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDualBoot(!dualBoot)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${dualBoot ? 'bg-amber-500 border-amber-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
              {dualBoot ? <Lock size={14} /> : <Monitor size={14} />} {dualBoot ? 'Dual Boot Ativo' : 'Single OS Mode'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 transition-all hover:border-blue-500">
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-12 space-y-12">
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 p-8 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-blue-500/5">
           <div className="w-16 h-16 bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg">
              <ShieldAlert size={32} />
           </div>
           <div className="flex-1 space-y-2">
              <h3 className="text-lg font-black text-blue-900 dark:text-blue-400 tracking-tight uppercase">Preparo Essencial</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                Antes de dar o boot no pendrive, acesse o BIOS e desative o <span className="text-blue-600 font-bold">Secure Boot</span> e o <span className="text-blue-600 font-bold">Fast Boot</span>. 
                Mude o modo SATA para <span className="text-blue-600 font-bold">AHCI</span> se necessário.
              </p>
           </div>
        </div>

        {dualBoot && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-8 rounded-[3rem] flex items-center gap-6 shadow-xl animate-in slide-in-from-top-4 duration-500">
             <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
             </div>
             <div>
                <h4 className="font-black text-amber-700 dark:text-amber-400 uppercase text-xs tracking-widest mb-1">Aviso de Dual Boot</h4>
                <p className="text-sm font-semibold text-amber-900/70 dark:text-amber-300/70">
                  Cuidado redobrado: Não formate as partições do Windows (NTFS). O Lince reservará o espaço necessário automaticamente no Disco 1.
                </p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[4rem] shadow-xl flex items-center gap-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 shrink-0"><Monitor size={32} /></div>
            <div className="flex-1 space-y-4">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-widest">Tabela de Partição</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                {Object.values(BootMode).map((m) => (
                  <button key={m} onClick={() => setBootMode(m)} className={`flex-1 px-6 py-4 rounded-xl text-[10px] font-black transition-all ${bootMode === m ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xl' : 'text-slate-400'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[4rem] shadow-xl flex items-center gap-10">
            <div className="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 shrink-0"><Activity size={32} /></div>
            <div className="flex-1 space-y-4">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-widest">Experiência</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                {Object.values(UserProfile).map((p) => (
                  <button key={p} onClick={() => setProfile(p)} className={`flex-1 px-4 py-4 rounded-xl text-[10px] font-black transition-all ${profile === p ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>{p.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-[4rem] shadow-2xl space-y-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4">RAM Física (GB)</label>
                  <input type="number" value={ram} onChange={(e) => setRam(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] py-6 px-10 font-black text-2xl outline-none border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500/50" />
                </div>
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4">Distribuição</label>
                  <select value={distro} onChange={(e) => setDistro(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] py-8 px-12 font-black text-lg outline-none border-2 border-slate-100 dark:border-slate-800 appearance-none cursor-pointer">
                    {DISTROS[profile].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between px-6">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Arquitetura de Discos</h3>
                  <button onClick={addDisk} disabled={disks.length >= 4} className="text-[11px] font-black text-blue-500 px-6 py-2 rounded-xl hover:bg-blue-50 transition-all">+ ADICIONAR DRIVE</button>
                </div>
                {disks.map((disk, idx) => (
                  <div key={disk.id} className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 transition-all shadow-sm">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] bg-white dark:bg-slate-700 shadow-lg text-sm font-black text-slate-400 shrink-0">D{idx+1}</div>
                      <input type="number" value={disk.size} onChange={(e) => updateDisk(disk.id, { size: Number(e.target.value) })} className="flex-1 bg-white dark:bg-slate-700 rounded-[1.5rem] py-5 px-10 text-xl font-black outline-none border border-transparent focus:border-blue-500/50" />
                      <select value={disk.type} onChange={(e) => updateDisk(disk.id, { type: e.target.value as DiskType })} className="bg-white dark:bg-slate-700 rounded-[1.5rem] py-5 px-6 font-black uppercase border-none">
                        <option value={DiskType.SSD}>SSD</option>
                        <option value={DiskType.NVME}>NVME</option>
                        <option value={DiskType.HDD}>HDD</option>
                      </select>
                      {disks.length > 1 && <button onClick={() => removeDisk(disk.id)} className="p-4 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={24} /></button>}
                    </div>
                    {dualBoot && idx === 0 && (
                      <div className="bg-amber-500/10 p-6 rounded-[2rem] border border-amber-500/20">
                         <label className="text-[10px] font-black text-amber-600 uppercase mb-2 block">Espaço Ocupado pelo Windows (GB)</label>
                         <input type="number" value={disk.preservedSize || 0} onChange={(e) => updateDisk(disk.id, { preservedSize: Number(e.target.value) })} className="w-full bg-white dark:bg-slate-700 rounded-xl py-3 px-6 font-black text-amber-700 border border-amber-500/30 outline-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {profile === UserProfile.BASIC && (
              <div className="bg-emerald-500/10 p-10 rounded-[3rem] border-2 border-emerald-500/20 flex items-center gap-6 shadow-lg shadow-emerald-500/5">
                <input 
                  type="checkbox" 
                  id="sep-home" 
                  checked={sepHome}
                  onChange={(e) => setSepHome(e.target.checked)}
                  className="w-10 h-10 rounded-xl border-emerald-500 text-emerald-600 cursor-pointer shadow-inner"
                />
                <div className="flex-1">
                  <label htmlFor="sep-home" className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest cursor-pointer select-none">
                    Desejo separar meus arquivos (/home) em uma partição própria.
                  </label>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter opacity-70">RECOMENDADO: Isso protege seus dados em caso de reinstalação do sistema.</p>
                </div>
              </div>
            )}
            
            {/* Seção de Pontos Extras no modo Avançado */}
            {profile === UserProfile.ADVANCED && (
              <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl border-2 border-slate-700 space-y-10 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/30"><Settings size={28} /></div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Estrutura Modular</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Ative ou integre partições ao sistema</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.keys(advOptions).map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => toggleAdvOption(opt)}
                      className={`group p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
                        advOptions[opt as keyof typeof advOptions] 
                        ? 'bg-rose-600 border-rose-400 text-white shadow-lg' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      <h4 className="text-xl font-black uppercase tracking-widest">/{opt}</h4>
                      <p className="text-[9px] font-bold mt-2 opacity-60 uppercase">{advOptions[opt as keyof typeof advOptions] ? 'Partição Ativa' : 'Integrado'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-10">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-8 flex items-center gap-4"><LayoutGrid size={18} /> Guia de Montagem</h3>
             <div className="space-y-8">
               {visibleWiki.map((info) => {
                 const isToggleable = profile === UserProfile.ADVANCED && info.point.startsWith('/') && info.point.length > 1 && info.point !== '/home' && info.point !== '/boot' && info.point !== '/boot/efi';
                 const isActive = isToggleable ? advOptions[info.point.substring(1) as keyof typeof advOptions] : true;
                 
                 return (
                   <button 
                    key={info.point} 
                    onClick={() => isToggleable && toggleAdvOption(info.point.substring(1))}
                    className={`w-full text-left bg-white dark:bg-slate-900 border-2 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden ${
                      isToggleable 
                      ? (isActive ? 'border-rose-500/50 bg-rose-500/5 shadow-rose-500/5' : 'border-slate-200 dark:border-slate-800 opacity-60') 
                      : (info.point === 'DUAL_BOOT' ? 'border-amber-500/30 bg-amber-50/20' : 'border-slate-200 dark:border-slate-800')
                    }`}
                   >
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`w-2 h-10 rounded-full ${isToggleable ? (isActive ? 'bg-rose-500' : 'bg-slate-300') : (info.point === 'DUAL_BOOT' ? 'bg-amber-500' : 'bg-blue-500')}`}></div>
                      <h4 className={`font-black text-sm uppercase ${isToggleable ? (isActive ? 'text-rose-600' : 'text-slate-400') : (info.point === 'DUAL_BOOT' ? 'text-amber-600' : 'text-slate-900 dark:text-slate-100')}`}>{info.title}</h4>
                    </div>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{info.description}</p>
                    
                    {isToggleable && (
                      <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {isActive ? <CheckCircle2 size={12} /> : null}
                        {isActive ? 'Ativo no Plano' : 'Integrado à Raiz'}
                      </div>
                    )}
                   </button>
                 );
               })}
             </div>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 flex items-center gap-4 ml-8"><Info size={20} /> Mapa de Alocação</h2>
          {disks.map((disk, dIdx) => {
            const diskPartitions = partitionPlan.filter(p => p.diskIndex === dIdx);
            const totalUsed = diskPartitions.reduce((acc, p) => acc + p.size, 0);
            return (
              <div key={disk.id} className="bg-white dark:bg-slate-900 border-4 p-14 rounded-[5rem] shadow-2xl border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">Drive D{dIdx + 1} • {disk.size} GB {disk.type}</span>
                </div>
                <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-[4rem] flex p-5 overflow-hidden border-[10px] border-slate-50 dark:border-slate-800">
                  {diskPartitions.map((part, pIdx) => (
                    <div key={pIdx} className={`h-full border-r-[12px] last:border-none border-white/10 flex items-center justify-center transition-all`} style={{ width: `${(part.size / disk.size) * 100}%`, backgroundColor: part.color }}>
                      <span className="text-[12px] text-white font-black uppercase truncate px-4">{part.size > (disk.size * 0.1) ? part.point : ''}</span>
                    </div>
                  ))}
                  {totalUsed < disk.size && <div className="h-full bg-slate-200/40 flex items-center justify-center border-dashed border-4 border-slate-300 rounded-r-[3.5rem]" style={{ width: `${((disk.size - totalUsed) / disk.size) * 100}%` }}></div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[5rem] overflow-hidden shadow-2xl">
          <div className="p-16 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-black text-[12px] uppercase tracking-[0.6em] text-slate-400 flex items-center gap-6"><FileText size={36} className="text-blue-500" /> Relatório Completo</h3>
            <div className="flex relative group">
              <div className={`absolute bottom-full right-0 mb-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl transition-all ${showExportMenu ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
                <button onClick={() => { exportToPDF(); setShowExportMenu(false); }} className="w-full flex items-center gap-4 px-10 py-5 hover:bg-slate-50 dark:hover:bg-slate-700 text-[12px] font-black border-b border-slate-100 dark:border-slate-700"><Download size={18} className="text-rose-500" /> PDF PROFISSIONAL</button>
                <button onClick={() => { exportToTXT(); setShowExportMenu(false); }} className="w-full flex items-center gap-4 px-10 py-5 hover:bg-slate-50 dark:hover:bg-slate-700 text-[12px] font-black"><FileText size={18} className="text-blue-500" /> TXT RELATÓRIO</button>
              </div>
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-5 px-14 py-8 bg-blue-600 text-white rounded-[2.5rem] text-[13px] font-black hover:bg-blue-700 shadow-xl transition-all">EXPORTAR PLANO <ChevronDown size={20} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 text-[12px] uppercase font-black tracking-[0.4em]">
                  <th className="px-20 py-14">Diretório</th>
                  <th className="px-20 py-14 text-center">Tamanho</th>
                  <th className="px-20 py-14">Disco</th>
                  <th className="px-20 py-14">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {extendedReportPlan.map((p, i) => (
                  <tr key={i} className={`hover:bg-slate-50/50 transition-all group ${p.point.includes('Integrada') ? 'bg-slate-50/20 opacity-70' : ''}`}>
                    <td className="px-20 py-16">
                      <div className={`font-black text-2xl tracking-tighter uppercase transition-colors ${p.point.includes('/home') ? 'text-amber-600' : 'text-slate-900 dark:text-white group-hover:text-blue-600'}`}>{p.point}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">{p.description}</div>
                    </td>
                    <td className="px-20 py-16 text-center">
                      <span className="font-black text-3xl tabular-nums text-blue-600 dark:text-blue-400">
                        {p.size > 0 ? formatSize(p.size) : '---'}
                      </span>
                    </td>
                    <td className="px-20 py-16 text-[13px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Drive {p.diskIndex + 1}</td>
                    <td className="px-20 py-16">
                      <span className={`text-[12px] font-black px-6 py-2 rounded-full border ${p.point.includes('Integrada') ? 'border-amber-200 text-amber-600 bg-amber-50' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 uppercase'}`}>{p.fileSystem}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-center py-20 opacity-30 text-[12px] font-black uppercase tracking-[2em]">LINCE • 2026</footer>
      </main>
    </div>
  );
};

export default App;
