import React, { useState, useEffect } from 'react';
import { Terminal, FileText, FileCode, X, Check, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Partition, Disk, UserProfile } from '../types';
import { translations } from '../translations/translations';

interface ExportSectionProps {
  plan: Partition[];
  disks: Disk[];
  distro: string;
  profile: UserProfile;
  lang: 'pt' | 'en';
  theme: { accent: string; border: string; primary: string };
}

export const ExportSection: React.FC<ExportSectionProps> = ({ plan, disks, distro, profile, lang, theme }) => {
  const t = translations[lang];
  const [showScript, setShowScript] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showScript ? 'hidden' : 'unset';
  }, [showScript]);

  // Função mestre para gerar o caminho da partição (SATA vs NVMe)
  // Agora conta as partições por disco individualmente
  const getPartitionPath = (p: Partition) => {
  const targetDisk = disks[p.diskIndex];
  // 1. Obtém o nome base do disco (ex: sda ou nvme0n1)
  const diskBase = targetDisk?.devicePath ? targetDisk.devicePath.replace('/dev/', '') : 'sdX';
  
  // 2. Filtra apenas partições formatáveis deste disco para garantir sequência 1, 2, 3...
  const validPartitionsOnDisk = plan
    .filter(part => part.diskIndex === p.diskIndex)
    .filter(part => part.fileSystem !== 'swap' && part.fileSystem !== 'ntfs');

  // 3. Descobre a posição desta partição na lista filtrada
  const indexOnDisk = validPartitionsOnDisk.indexOf(p) + 1;

  // 4. Regra de Ouro: NVMe usa 'p' antes do número (nvme0n1p1), SATA não (sda1)
  const isNvme = diskBase.includes('nvme');
  
  return `/dev/${diskBase}${isNvme ? 'p' : ''}${indexOnDisk}`;
};

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text("LYNX PROJECT", 20, 25);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`v3.1 STABLE | ${distro.toUpperCase()} | PROFILE: ${profile.toUpperCase()}`, 20, 35);

    autoTable(doc, {
      startY: 55,
      head: [[t.ui.table_mount, t.ui.table_size, 'FS', t.ui.table_drive, 'Description']],
      body: plan.map((p) => [p.point, `${p.size.toFixed(1)} GB`, p.fileSystem.toUpperCase(), `D${p.diskIndex + 1}`, p.description]),
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;

    doc.setTextColor(40);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(t.footer.disclaimer_title, 20, finalY + 15);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    const disclaimer = doc.splitTextToSize(t.footer.disclaimer_text, pageWidth - 40);
    doc.text(disclaimer, 20, finalY + 22);

    doc.setTextColor(0, 102, 204);
    doc.text("Repository: github.com/Lu15-F3/lynx-project", 20, finalY + 40);
    doc.save(`lynx-plan-${distro.toLowerCase()}.pdf`);
  };

  const exportTXT = () => {
    let content = `LYNX PROJECT v3.1 - ESTRATÉGIA DE PARTICIONAMENTO\n`;
    content += `Distro: ${distro} | Perfil: ${profile}\n`;
    content += `--------------------------------------------------\n\n`;
    plan.forEach((p) => {
      content += `[${p.point.padEnd(12)}] | ${p.size.toFixed(1)}GB | ${p.fileSystem.toUpperCase()} | ${p.description}\n`;
    });
    content += `\n--------------------------------------------------\n`;
    content += `TERMOS: ${t.footer.disclaimer_text}\n\n`;
    content += `REPO: github.com/Lu15-F3/lynx-project\n`;

    const blob = new Blob(["\ufeff", content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lynx-plan-${distro.toLowerCase()}.txt`;
    link.click();
  };

  const copyToClipboard = () => {
    const scriptText = plan
      .filter(p => p.fileSystem !== 'swap' && p.fileSystem !== 'ntfs')
      .map((p) => `mkfs.${p.fileSystem.toLowerCase()} ${getPartitionPath(p)}  # ${p.point}`)
      .join('\n');
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowScript(false); }, 1500);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
  {/* Botão PDF */}
  <button onClick={exportPDF} className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-sm">
    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
      <FileText size={20}/>
    </div>
    <div className="text-left">
      <span className="block font-black text-[10px] uppercase tracking-widest text-slate-400">
        {t.ui.export_pdf_title}
      </span>
      <span className="text-[9px] font-bold text-slate-500 uppercase italic">
        {t.ui.export_pdf_desc}
      </span>
    </div>
  </button>

  {/* Botão TXT */}
  <button onClick={exportTXT} className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-500/50 transition-all group shadow-sm">
    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
      <Download size={20}/>
    </div>
    <div className="text-left">
      <span className="block font-black text-[10px] uppercase tracking-widest text-slate-400">
        {t.ui.export_txt_title}
      </span>
      <span className="text-[9px] font-bold text-slate-500 uppercase italic">
        {t.ui.export_txt_desc}
      </span>
    </div>
  </button>

  {/* Botão Script Terminal */}
  <button onClick={() => setShowScript(true)} className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-[2.5rem] hover:bg-slate-800 transition-all group shadow-xl">
    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
      <Terminal size={20}/>
    </div>
    <div className="text-left">
      <span className="block font-black text-[10px] uppercase tracking-widest opacity-80">
        {t.ui.export_terminal_title}
      </span>
      <span className="text-[9px] font-bold uppercase italic">
        {t.ui.export_terminal_desc}
      </span>
    </div>
  </button>

      {showScript && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/30">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"/><div className="w-3 h-3 rounded-full bg-amber-500"/><div className="w-3 h-3 rounded-full bg-emerald-500"/></div>
              <span className="text-[10px] font-mono text-slate-500 font-black tracking-widest uppercase italic">lynx_terminal_v3.1</span>
              <button onClick={() => setShowScript(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            <div className="p-10 font-mono text-sm max-h-[50vh] overflow-y-auto">
              <p className="text-slate-600 mb-6 italic"># {t.ui.terminal_header} {distro}</p>
              {plan.filter(p => p.fileSystem !== 'swap' && p.fileSystem !== 'ntfs').map((p, i) => (
                <div key={i} className="mb-2 flex gap-4">
                  <span className="text-slate-800 select-none font-bold">{i + 1}</span>
                  <code>
                    <span className="text-emerald-500">mkfs.{p.fileSystem.toLowerCase()}</span> <span className="text-white font-bold">{getPartitionPath(p)}</span>
                    <span className="text-slate-700 ml-4"># {p.point}</span>
                  </code>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-900">
              <button onClick={copyToClipboard} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
                {copied ? <Check size={16}/> : <FileCode size={16}/>}
                {copied ? t.ui.copied : t.ui.terminal_copy}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};