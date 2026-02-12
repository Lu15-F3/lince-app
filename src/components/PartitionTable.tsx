import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Partition, Disk, DiskType } from '../types';
import { translations } from '../translations/translations';
import { getPartitionAdvice } from '../constants';

interface PartitionTableProps {
  plan: Partition[];
  disks: Disk[];
  lang: 'pt' | 'en';
  theme: { text: string };
}

export const PartitionTable: React.FC<PartitionTableProps> = ({ plan, disks, lang, theme }) => {
  const t = translations[lang];

  // Helper para formatar tamanho (GB)
  const formatSize = (size: number) => {
    return size < 1 ? `${(size * 1024).toFixed(0)}MB` : `${size.toFixed(1)}GB`;
  };

  return (
    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-fit">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-black text-xs tracking-widest text-slate-400 uppercase">
          {t.ui.map_title}
        </h3>
        <Info size={14} className="text-slate-300" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
             <th className="text-left pb-4 px-4">{t.ui.table_mount}</th>
             <th className="text-left pb-4 px-4">{t.ui.table_size}</th>
             <th className="text-left pb-4 px-4">{t.ui.table_drive}</th>
           </tr>
         </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {plan.map((p, i) => {
              // Obtendo a consultoria técnica do Lynx
              const diskType = disks[p.diskIndex]?.type || DiskType.SSD;
              const advice = getPartitionAdvice(p.point, p.size, diskType, lang);

              return (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className={`font-black text-xs uppercase group-hover:${theme.text} transition-colors`}>
                        {p.point === 'Swap' ? 'SWAP AREA' : p.point}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mb-2">
                        {p.description}
                      </span>
                      
                      {/* LYNX ADVISOR - SUGESTÕES E ALERTAS */}
                      <div className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800 pl-3 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] font-black bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-700">
                            {advice.fs}
                          </span>
                          <span className="text-[9px] text-slate-500 italic leading-none">
                            {advice.recommendation}
                          </span>
                        </div>
                        
                        {advice.alert && (
                          <div className="flex items-center gap-1 mt-1 text-amber-500 animate-pulse">
                            <AlertTriangle size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-tighter">
                              {advice.alert}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className={`p-6 font-black ${theme.text} text-xs tabular-nums`}>
                    {formatSize(p.size)}
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-black text-slate-500 border border-slate-200 dark:border-slate-700">
                        D{p.diskIndex + 1}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                        {diskType}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};