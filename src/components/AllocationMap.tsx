import React from 'react';
import { Scale } from 'lucide-react';
import { Partition, Disk } from '../types';
import { translations } from '../translations/translations';

interface AllocationMapProps {
  plan: Partition[];
  disks: Disk[];
  lang: 'pt' | 'en';
}

export const AllocationMap: React.FC<AllocationMapProps> = ({ plan, disks, lang }) => {
  const t = translations[lang];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
          <Scale size={18} />
        </div>
        <h3 className="font-black text-xs tracking-widest text-slate-400 uppercase">
          {t.ui.map_title}
        </h3>
      </div>

      <div className="space-y-8">
        {disks.map((disk, diskIdx) => {
          const diskPartitions = plan.filter(p => p.diskIndex === diskIdx);
          
          return (
            <div key={disk.id} className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  {lang === 'pt' ? `Disco` : `Disk`} {diskIdx + 1} 
                  <span className="ml-2 text-slate-400 font-bold">({disk.type} - {disk.size}GB)</span>
                </span>
              </div>

              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex border border-slate-200 dark:border-slate-700 shadow-inner p-1 gap-1">
                {diskPartitions.length > 0 ? (
                  diskPartitions.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      style={{ width: `${(p.size / disk.size) * 100}%` }}
                      className={`h-full first:rounded-l-lg last:rounded-r-lg transition-all relative group flex items-center justify-center
                        ${p.point === '/' ? 'bg-slate-900 dark:bg-white' : 
                          p.point === 'Swap' ? 'bg-slate-400' : 
                          p.isPreserved ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-500'}`}
                    >
                      {/* Tooltip Simples no Hover */}
                      <div className="absolute -top-8 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-bold">
                        {p.point}: {p.size.toFixed(1)}GB
                      </div>
                      
                      {/* Label dentro da barra se houver espaço */}
                      {(p.size / disk.size) > 0.1 && (
                        <span className={`text-[8px] font-black uppercase truncate px-1 
                          ${p.point === '/' ? 'text-white dark:text-slate-900' : 'text-white'}`}>
                          {p.point}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase italic">
                      {lang === 'pt' ? 'Unidade de Dados / Backup' : 'Data / Backup Drive'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};