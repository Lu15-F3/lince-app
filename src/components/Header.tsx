import React from 'react';
import { Cat, Sun, Moon, Github } from 'lucide-react';
import { translations } from '../translations/translations';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  lang: 'pt' | 'en';
  setLang: (l: 'pt' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, lang, setLang }) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-500/20">
            <Cat size={20} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter leading-none dark:text-white">
              {t.title}
            </h1>
            <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              v3.1 Stable
            </span>
          </div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-4">
          {/* LANGUAGE TOGGLE */}
          <button 
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 group"
          >
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
            </span>
          </button>

          {/* GITHUB LINK */}
          <a 
            href="https://github.com/Lu15-F3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={18}/>
          </a>
          
          {/* THEME TOGGLE */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
          >
            {darkMode ? (
              <Sun size={18} className="text-amber-500" />
            ) : (
              <Moon size={18} className="text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};