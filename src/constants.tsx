import { UserProfile, DiskType } from './types';

// Cores base para os perfis
export const PROFILE_COLORS = {
  [UserProfile.BASIC]: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  [UserProfile.MEDIUM]: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  [UserProfile.ADVANCED]: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

// Distribuições sugeridas por perfil
export const DISTROS = {
  [UserProfile.BASIC]: ["Linux Mint", "Ubuntu", "Zorin OS", "Pop!_OS"],
  [UserProfile.MEDIUM]: ["Fedora", "Manjaro", "Debian Stable", "KDE Neon"],
  [UserProfile.ADVANCED]: ["Arch Linux", "Gentoo", "NixOS", "Void Linux", "Debian Sid"],
};

/**
 * Lógica do Conselheiro Lynx (The Advisor)
 * Analisa as escolhas do usuário e sugere melhorias técnicas.
 */
export const getPartitionAdvice = (point: string, size: number, diskType: DiskType, lang: 'pt' | 'en' = 'pt') => {
  const t = {
    pt: {
      fs_standard: "Estável e confiável para qualquer uso.",
      fs_btrfs: "Otimizado para SSDs. Suporta Snapshots e compressão.",
      fs_xfs: "Alta performance para grandes volumes de dados.",
      alert_root_small: "Espaço em Root reduzido. Recomendamos pelo menos 30GB.",
      alert_efi_small: "Partição EFI pequena. Pode lotar com múltiplos kernels.",
      tmpfs_info: "Executar em RAM aumenta a velocidade e preserva o SSD."
    },
    en: {
      fs_standard: "Stable and reliable for any use.",
      fs_btrfs: "Optimized for SSDs. Supports Snapshots and compression.",
      fs_xfs: "High performance for large data volumes.",
      alert_root_small: "Low Root space. At least 30GB recommended.",
      alert_efi_small: "Small EFI partition. May fill up with multiple kernels.",
      tmpfs_info: "Running in RAM increases speed and preserves the SSD."
    }
  }[lang];
  
  let advice = {
    fs: 'Ext4',
    recommendation: t.fs_standard,
    alert: ''
  };

  if ((diskType === DiskType.SSD || diskType === DiskType.NVME) && point === '/') {
    advice.fs = 'Btrfs';
    advice.recommendation = t.fs_btrfs;
  } else if (size >= 100 && point === '/home') {
    advice.fs = 'XFS';
    advice.recommendation = t.fs_xfs;
  } else if (point === '/tmp') {
    advice.fs = 'tmpfs';
    advice.recommendation = t.tmpfs_info;
  }

  if (point === '/' && size > 0 && size < 20) {
    advice.alert = t.alert_root_small;
  }
  if (point === '/boot/efi' && size < 0.5) {
    advice.alert = t.alert_efi_small;
  }

  return advice;
};