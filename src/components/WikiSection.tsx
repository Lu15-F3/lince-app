import React, { useState } from 'react';
import { Book, ChevronDown, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../translations/translations';

interface WikiSectionProps {
  profile: UserProfile;
  lang: 'pt' | 'en';
  diskCount: number;
  dualBoot: boolean;
  isUefi: boolean; // Adicione esta prop para a Wiki ser inteligente
}

export const WikiSection: React.FC<WikiSectionProps> = ({ profile, lang, diskCount, dualBoot, isUefi }) => {
  const [openItem, setOpenItem] = useState<string | null>('/');
  const t = translations[lang];

  const getVisibleItems = () => {
    // Itens básicos
    const items = ['/', '/home', 'Swap'];

    // Lógica inteligente: UEFI ou MBR
    if (isUefi) {
      items.push('/boot/efi');
    } else {
      items.push('MBR');
    }

    if (dualBoot) items.push('DUAL_BOOT'); 
    if (diskCount > 1) items.push('EXTRA_DISKS');

    // Itens por perfil
    if (profile === UserProfile.MEDIUM) {
      items.push('/var', '/opt', '/usr/local');
    } else if (profile === UserProfile.ADVANCED) {
      items.push('/var', '/opt', '/usr/local', '/srv', '/tmp');
    }

    return items;
  };

  const visibleKeys = getVisibleItems();

  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-xl sticky top-8">
        
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <Book size={18} />
          </div>
          <div>
            <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
              {t.ui.wiki_title}
            </h2>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              {t.ui.wiki_subtitle}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {visibleKeys.map((key) => {
            // Agora pegamos tudo diretamente do translations.ts
            const info = (t.wiki as any)[key];
            const isOpen = openItem === key;

            if (!info) return null;

            return (
              <div 
                key={key} 
                className={`transition-all duration-300 rounded-2xl border ${
                  isOpen 
                    ? 'border-blue-500/30 bg-blue-500/5' 
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <button 
                  onClick={() => setOpenItem(isOpen ? null : key)}
                  className="w-full flex items-center justify-between p-4 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isOpen ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />
                    <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase">
                      {info.title}
                    </span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 ml-4 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                      {info.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-amber-600/80 uppercase leading-loose">
              {t.ui.backup_alert}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};