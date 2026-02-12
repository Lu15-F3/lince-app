import React from 'react';
import { HardDrive, Trash2, Cpu, Info, Terminal } from 'lucide-react';
import { Disk, DiskType } from '../types';
import { translations } from '../translations/translations';

interface DiskCardProps {
  disk: Disk;
  index: number;
  lang: 'pt' | 'en';
  onUpdate: (id: string, updates: Partial<Disk>) => void;
  onRemove: (id: string) => void;
  isRemoveDisabled: boolean;
  dualBoot: boolean;
}

export const DiskCard: React.FC<DiskCardProps> = ({ 
  disk, 
  index, 
  lang, 
  onUpdate, 
  onRemove, 
  isRemoveDisabled,
  dualBoot 
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
            <Cpu size={14} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            {lang === 'pt' ? `UNIDADE 0${index + 1}` : `DRIVE 0${index + 1}`}
          </span>
        </div>
        
        {!isRemoveDisabled && (
          <button 
            onClick={() => onRemove(disk.id)}
            className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="space-y-4">

        {/* Aviso e Input de Caminho */}
<div className="mb-4 space-y-2">
  <div className="flex items-start gap-2 px-1">
  <Info size={12} className="text-blue-500 mt-0.5" />
  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
    {t.ui.disk_tip}
  </span>
</div>

  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 p-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500/50 transition-all">
    <Terminal size={12} className="text-slate-400" />
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.ui.path_placeholder}</span>
    <input 
      type="text" 
      placeholder="Ex: /dev/sda" 
      value={disk.devicePath || ''}
      onChange={(e) => onUpdate(disk.id, { devicePath: e.target.value })}
      className="bg-transparent text-[11px] font-mono font-bold outline-none w-full text-emerald-600 dark:text-emerald-400 placeholder:text-slate-300 dark:placeholder:text-slate-700 uppercase"
    />
  </div>
</div>

{/* ESPAÇO RESERVADO PARA WINDOWS */}
{dualBoot && disk.isMain && (
  <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-[9px] font-black text-amber-600 uppercase">{t.ui.win_reserved}</span>
    </div>
    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-500/20">
      <input 
        type="number" 
        value={disk.preservedSize} 
        onChange={(e) => onUpdate(disk.id, { preservedSize: Number(e.target.value) })}
        className="bg-transparent w-full text-xs font-black outline-none text-amber-600"
      />
      <span className="text-[10px] font-bold text-amber-600/40">GB</span>
    </div>
    <p className="text-[8px] font-medium text-amber-600/60 mt-2 leading-tight uppercase">
      {t.ui.win_warning}
    </p>
  </div>
)}

        {/* TIPO DE DISCO */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 mb-1 block">
            {t.labels.disk_type}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {Object.values(DiskType).map((type) => (
              <button
                key={type}
                onClick={() => onUpdate(disk.id, { type })}
                className={`py-1.5 rounded-lg text-[9px] font-black transition-all border ${
                  disk.type === type 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* CAPACIDADE */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 mb-1 block">
            {t.labels.disk_size} (GB)
          </label>
          <input 
            type="number" 
            value={disk.size}
            onChange={(e) => onUpdate(disk.id, { size: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {disk.isMain && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">
          OS TARGET
        </div>
      )}
    </div>
  );
};