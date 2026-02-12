import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Cat, Github, ExternalLink, Scale, CheckCircle2, AlertTriangle, Check, Moon, Sun, Languages } from 'lucide-react';

// Imports de Tipos e Constantes
import { UserProfile, DiskType, BootMode, Disk, Partition, HomeStrategy } from './types';
import { DISTROS } from './constants';
import { translations } from './translations/translations';

// Imports de Componentes
import { DiskCard } from './components/DiskCard';
import { PartitionTable } from './components/PartitionTable';
import { WikiSection } from './components/WikiSection';
import { AllocationMap } from './components/AllocationMap';
import { ExportSection } from './components/ExportSection';

const THEMES = {
  [UserProfile.BASIC]: { primary: 'emerald', accent: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
  [UserProfile.MEDIUM]: { primary: 'orange', accent: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', shadow: 'shadow-orange-500/10' },
  [UserProfile.ADVANCED]: { primary: 'rose', accent: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' }
};

const App: React.FC = () => {
  // ESTADOS PRINCIPAIS
  const [profile, setProfile] = useState<UserProfile>(UserProfile.BASIC);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [darkMode, setDarkMode] = useState(true);
  const [ram, setRam] = useState(8);
  const [bootMode, setBootMode] = useState<BootMode>(BootMode.UEFI);
  const [distro, setDistro] = useState(DISTROS[UserProfile.BASIC][0]);
  const [fileSystem, setFileSystem] = useState<'ext4' | 'btrfs' | 'xfs'>('ext4');
  const [dualBoot, setDualBoot] = useState(false);
  const [homeStrategy, setHomeStrategy] = useState<HomeStrategy>(HomeStrategy.INTEGRATED);
  const [advOptions, setAdvOptions] = useState({ var: true, opt: false, srv: false, tmp: false, usrLocal: true });

  const [disks, setDisks] = useState<Disk[]>([
    { id: '1', size: 240, type: DiskType.SSD, isMain: true, preservedSize: 0, devicePath: '' }
  ]);

  const t = translations[lang];
  const currentTheme = THEMES[profile];

  // EFEITOS
  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (profile === UserProfile.ADVANCED) setFileSystem('btrfs');
    else if (profile === UserProfile.MEDIUM) setFileSystem('xfs');
    else setFileSystem('ext4');
  }, [profile]);

  // GESTÃO DE DISCOS
  const addDisk = () => {
    if (disks.length < 4) {
      setDisks([...disks, { id: Math.random().toString(), size: 500, type: DiskType.HDD, isMain: false, preservedSize: 0, devicePath: '' }]);
    }
  };
  const updateDisk = (id: string, updates: Partial<Disk>) => setDisks(disks.map(d => d.id === id ? { ...d, ...updates } : d));
  const removeDisk = (id: string) => setDisks(disks.filter(d => d.id !== id));

  const partitionPlan = useMemo(() => {
  const plan: Partition[] = [];
  const mainDisk = disks[0];
  const fs = fileSystem;
  
  const desc = {
    win: lang === 'pt' ? 'Sistema Preservado' : 'Preserved System',
    boot: lang === 'pt' ? 'Inicialização' : 'Bootloader',
    swap: lang === 'pt' ? 'Memória Virtual' : 'Virtual Memory',
    root: lang === 'pt' ? 'Sistema (Root)' : 'System (Root)',
    home: lang === 'pt' ? 'Arquivos Pessoais' : 'Personal Files',
    extra: lang === 'pt' ? 'Armazenamento Extra' : 'Extra Storage',
    var: lang === 'pt' ? 'Logs e Cache do Sistema' : 'System Logs and Cache',
    opt: lang === 'pt' ? 'Softwares de Terceiros' : 'Third-party Software',
    local: lang === 'pt' ? 'Programas do Usuário (Local)' : 'User Programs (Local)',
    srv: lang === 'pt' ? 'Dados de Servidores/Web' : 'Server/Web Data',
    tmp: lang === 'pt' ? 'Arquivos Temporários' : 'Temporary Files'
  };

  // 1. Partições Obrigatórias Iniciais
  if (dualBoot && mainDisk.preservedSize > 0) {
    plan.push({ point: 'Windows', size: mainDisk.preservedSize, description: desc.win, fileSystem: 'ntfs', diskIndex: 0 });
  }

  if (bootMode === BootMode.UEFI) {
    plan.push({ point: '/boot/efi', size: 0.6, description: `EFI ${desc.boot}`, fileSystem: 'fat32', diskIndex: 0 });
  } else {
    plan.push({ point: '/boot', size: 1.0, description: `Legacy ${desc.boot}`, fileSystem: 'ext4', diskIndex: 0 });
  }

  let swapSize = ram <= 4 ? ram : 8; 
  if (profile === UserProfile.ADVANCED && ram > 8) swapSize = ram; 
  plan.push({ point: 'Swap', size: swapSize, description: desc.swap, fileSystem: 'swap', diskIndex: 0 });

  // 2. Customizações (Apenas se não for Básico)
  if (profile !== UserProfile.BASIC) {
  // Disponível em INTERMEDIÁRIO e AVANÇADO
  if (advOptions.var) plan.push({ point: '/var', size: profile === UserProfile.ADVANCED ? 30 : 20, description: desc.var, fileSystem: fs, diskIndex: 0 });
  if (advOptions.opt) plan.push({ point: '/opt', size: 15, description: desc.opt, fileSystem: fs, diskIndex: 0 });
  if (advOptions.usrLocal) plan.push({ point: '/usr/local', size: 10, description: desc.local, fileSystem: fs, diskIndex: 0 });

  // Disponível APENAS em AVANÇADO
  if (profile === UserProfile.ADVANCED) {
    if (advOptions.srv) plan.push({ point: '/srv', size: 20, description: desc.srv, fileSystem: fs, diskIndex: 0 });
    if (advOptions.tmp) plan.push({ point: '/tmp', size: 8, description: desc.tmp, fileSystem: 'tmpfs', diskIndex: 0 });
  }
}

  // 3. Cálculo da Root e Home (A Mágica da v3.1)
  const currentOverhead = plan.filter(p => p.diskIndex === 0).reduce((acc, p) => acc + p.size, 0);
  const remainingD1 = mainDisk.size - currentOverhead;

  if (homeStrategy === HomeStrategy.INTEGRATED) {
    plan.push({ point: '/', size: Math.max(10, remainingD1), description: lang === 'pt' ? 'Sistema e Arquivos Integrados' : 'Integrated System and Files', fileSystem: fs, diskIndex: 0 });
  } else {
    // Define tamanho fixo da Root baseado no perfil
    const rootSize = profile === UserProfile.ADVANCED ? 100 : 60;
    plan.push({ point: '/', size: rootSize, description: desc.root, fileSystem: fs, diskIndex: 0 });

    // Decide onde vai a Home
    const isDedicated = homeStrategy === HomeStrategy.DEDICATED_DISK2 && disks.length > 1;
    const hDiskIdx = isDedicated ? 1 : 0;
    const hSize = isDedicated ? disks[1].size : (remainingD1 - rootSize);

    plan.push({ 
      point: '/home', 
      size: Math.max(5, hSize), 
      description: isDedicated ? (lang === 'pt' ? 'Home em Disco Dedicado' : 'Home on Dedicated Disk') : desc.home, 
      fileSystem: fs, 
      diskIndex: hDiskIdx 
    });
  }

  // 4. Discos Extras
  disks.forEach((d, idx) => {
    const isHomeDisk = (homeStrategy === HomeStrategy.DEDICATED_DISK2 && idx === 1);
    if (idx > 0 && !isHomeDisk) {
      plan.push({ point: `/mnt/extra${idx}`, size: d.size, description: desc.extra, fileSystem: 'ext4', diskIndex: idx });
    }
  });

  return plan;
}, [lang, profile, disks, ram, bootMode, dualBoot, advOptions, fileSystem, homeStrategy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-['Inter'] pb-20">
      
      {/* HEADER ÚNICO V3.1 */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-[2.5rem] ${currentTheme.accent} text-white shadow-2xl transition-all duration-500`}>
              <Cat size={32} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tighter dark:text-white uppercase">
                  {t.header.app_name}
                </h1>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${currentTheme.border} ${currentTheme.text}`}>
                  {t.header.version}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {t.header.description}
              </p>
            </div>
          </div>

          {/* CONTROLES DE INTERFACE */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500 flex items-center gap-2">
              <Languages size={18} />
              <span className="text-[10px] font-black uppercase">{lang}</span>
            </button>
            <div className="w-px h-4 bg-slate-100 dark:bg-slate-800" />
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* SELETOR DE PERFIL */}
        <section className={`p-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border ${currentTheme.border} shadow-2xl mb-6`}>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
            {Object.values(UserProfile).map(p => (
              <button key={p} onClick={() => {setProfile(p); setDistro(DISTROS[p][0]);}} className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all uppercase ${profile === p ? `${THEMES[p].accent} text-white shadow-lg` : 'text-slate-400 hover:text-slate-600'}`}>
                {t.modes[p.toLowerCase() as keyof typeof t.modes]}
              </button>
            ))}
          </div>
        </section>

        {/* CHECKLIST DE PREPARAÇÃO (ABAIXO DO PERFIL) */}
        <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-1.5 h-4 rounded-full ${currentTheme.accent}`} />
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {t.checklist.title}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[t.checklist.item1, t.checklist.item2, t.checklist.item3, t.checklist.item4].map((item, index) => (
              <label key={index} className="group flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition-all cursor-pointer">
                <div className="relative flex items-center mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 checked:bg-emerald-500 checked:border-emerald-500 transition-all" />
                  <Check size={12} className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug uppercase group-hover:text-slate-800 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="space-y-8">
          {/* PAINEL TÉCNICO */}
          <section className={`p-8 bg-white dark:bg-slate-900 rounded-[3rem] border ${currentTheme.border} shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8`}>
              <div className="lg:col-span-3 space-y-4">
                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t.ui.hardware}</span>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 px-4 border border-slate-100 dark:border-slate-800">
                  <input type="number" value={ram} onChange={e => setRam(Number(e.target.value))} className="w-full bg-transparent py-2 font-black outline-none" />
                  <span className="text-[10px] font-bold opacity-30">GB RAM</span>
                </div>
                <select value={distro} onChange={e => setDistro(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-black text-sm outline-none border border-slate-100 dark:border-slate-800">
                  {DISTROS[profile].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t.ui.boot_format}</span>
                <select value={bootMode} onChange={e => setBootMode(e.target.value as BootMode)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-black text-sm outline-none border border-slate-100 dark:border-slate-800">
                  <option value={BootMode.UEFI}>UEFI (GPT)</option>
                  <option value={BootMode.BIOS}>Legacy (MBR)</option>
                </select>
                <select value={fileSystem} onChange={e => setFileSystem(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-black text-sm outline-none border border-slate-100 dark:border-slate-800">
                  <option value="ext4">Ext4 (Padrão)</option>
                  <option value="btrfs">Btrfs (Snapshots)</option>
                  <option value="xfs">XFS (Data High)</option>
                </select>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t.strategies.label}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-70 italic">• {t.strategies.helper}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[2rem]">
                  {[
                    { id: HomeStrategy.INTEGRATED, label: t.strategies.integrated, desc: t.strategies.desc_integrated, icon: '🏠' },
                    { id: HomeStrategy.SPLIT_DISK1, label: t.strategies.split, desc: t.strategies.desc_split, icon: '↔️' },
                    { id: HomeStrategy.DEDICATED_DISK2, label: t.strategies.dedicated, desc: t.strategies.desc_dedicated, icon: '🚀', disabled: disks.length < 2 }
                  ].map((strat) => (
                    <button key={strat.id} disabled={strat.disabled} onClick={() => setHomeStrategy(strat.id)} className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${homeStrategy === strat.id ? `${currentTheme.accent} text-white shadow-lg scale-[1.02]` : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'} ${strat.disabled ? 'opacity-20 cursor-not-allowed' : ''}`}>
                      <span className="text-xl mb-1">{strat.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">{strat.label}</span>
                      <span className="text-[7px] font-medium opacity-60 uppercase">{strat.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
  {/* Dual Boot - Sempre Visível */}
  <button 
    onClick={() => setDualBoot(!dualBoot)} 
    className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
      ${dualBoot ? 'border-amber-500 bg-amber-500/10 text-amber-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
  >
    Dual Boot Windows
  </button>

  {/* Opções Intermédias e Avançadas */}
  {profile !== UserProfile.BASIC && (
    <>
      <button 
        onClick={() => setAdvOptions({...advOptions, var: !advOptions.var})} 
        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
          ${advOptions.var ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
      >
        /var
      </button>
      <button 
        onClick={() => setAdvOptions({...advOptions, opt: !advOptions.opt})} 
        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
          ${advOptions.opt ? 'border-pink-500 text-pink-600 bg-pink-50' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
      >
        /opt
      </button>
      <button 
        onClick={() => setAdvOptions({...advOptions, usrLocal: !advOptions.usrLocal})} 
        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
          ${advOptions.usrLocal ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
      >
        /local
      </button>
    </>
  )}

  {/* Opções Exclusivas do Perfil Avançado */}
  {profile === UserProfile.ADVANCED && (
    <>
      <button 
        onClick={() => setAdvOptions({...advOptions, srv: !advOptions.srv})} 
        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
          ${advOptions.srv ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
      >
        /srv
      </button>
      <button 
        onClick={() => setAdvOptions({...advOptions, tmp: !advOptions.tmp})} 
        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase border-2 transition-all 
          ${advOptions.tmp ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
      >
        /tmp
      </button>
    </>
  )}
</div>
              </div>
          </section>

          {/* DISCOS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disks.map((disk, index) => (
              <DiskCard key={disk.id} disk={disk} index={index} lang={lang} onUpdate={updateDisk} onRemove={removeDisk} isRemoveDisabled={disk.isMain} dualBoot={dualBoot} />
            ))}
            {/* BOTÃO ADICIONAR UNIDADE ATUALIZADO */}
{disks.length < 4 && (
  <button 
    onClick={addDisk} 
    className={`h-full min-h-[220px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 transition-all gap-4 group
      ${currentTheme.border} bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-400`}
  >
    {/* Ícone Elegante com Background Dinâmico */}
    <div className={`p-4 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-90
      ${currentTheme.accent} text-white shadow-lg ${currentTheme.shadow}`}>
      <Plus size={28} strokeWidth={3} />
    </div>

    <div className="text-center">
      <span className="block font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {t.ui.add_disk}
      </span>
      <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
        {disks.length} / 4 {lang === 'pt' ? 'Unidades' : 'Drives'}
      </span>
    </div>
  </button>
)}
          </section>

          {/* MAPA E TABELA */}
          <AllocationMap plan={partitionPlan} disks={disks} lang={lang} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <WikiSection profile={profile} lang={lang} diskCount={disks.length} dualBoot={dualBoot} isUefi={bootMode === BootMode.UEFI} />
              <div className="lg:col-span-8">
                <PartitionTable plan={partitionPlan} disks={disks} lang={lang} theme={currentTheme} />
              </div>
          </div>

          <ExportSection plan={partitionPlan} disks={disks} distro={distro} profile={profile} lang={lang} theme={currentTheme} />
        </main>
      </div>

      {/* RODAPÉ V3.1 */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${currentTheme.accent} text-white`}><Cat size={20} /></div>
                <span className="font-black text-lg tracking-tighter uppercase dark:text-white">LYNX <span className="opacity-40">Project v3.1</span></span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">{t.footer.description}</p>
              <div className="flex gap-3">
                <a href="https://github.com/Lu15-F3" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors text-slate-600 dark:text-slate-300"><Github size={18}/></a>
                <a href="#" className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors text-slate-600 dark:text-slate-300"><ExternalLink size={18}/></a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-[0.2em]"><Scale size={14} className={currentTheme.text}/> {t.footer.legal_title}</h4>
              <ul className="text-[10px] font-bold space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer"><CheckCircle2 size={12} className="text-emerald-500"/> {t.footer.license}</li>
                <li className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer"><CheckCircle2 size={12} className="text-emerald-500"/> {t.footer.community}</li>
              </ul>
            </div>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-2 tracking-[0.2em]"><AlertTriangle size={14}/> {t.footer.disclaimer_title}</h4>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase">{t.footer.disclaimer_text}</p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">© 2026 LYNX PROJECT V3.1 | {t.footer.dev_by} <span className={`${currentTheme.text}`}>Lu15-F3</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;