
import React from 'react';
import { UserProfile } from './types';

export const PROFILE_COLORS = {
  [UserProfile.BASIC]: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  [UserProfile.MEDIUM]: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  [UserProfile.ADVANCED]: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

export const DISTROS = {
  [UserProfile.BASIC]: ["Linux Mint", "Ubuntu", "Zorin OS", "Pop!_OS"],
  [UserProfile.MEDIUM]: ["Fedora", "Manjaro", "Debian Stable", "KDE Neon"],
  [UserProfile.ADVANCED]: ["Arch Linux", "Gentoo", "NixOS", "Void Linux", "Debian Sid"],
};

export const PARTITION_INFO = [
  { 
    point: 'DUAL_BOOT', 
    title: 'Dual Boot Seguro',
    description: 'Protocolo de coexistência: nunca formate partições identificadas como NTFS, BitLocker ou "Reservado pelo Sistema". O Linux se instalará no espaço "Livre" que você criou previamente.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: 'EXTRA_DISKS', 
    title: 'Discos Adicionais (D3+)',
    description: 'Para drives extras, a recomendação é montar em /mnt/dados. Se for um HDD, use Ext4. Se for um SSD para jogos, considere Btrfs para compressão transparente.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/boot/efi', 
    title: 'Partição EFI',
    description: 'Obrigatória em sistemas UEFI/GPT. Contém os arquivos de boot (.efi). Se estiver em Dual Boot, o instalador costuma detectar a partição EFI existente do Windows.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/boot', 
    title: 'Partição de Boot',
    description: 'Essencial para Legacy/MBR ou se você usa criptografia total de disco (LUKS). Recomenda-se 1GB para evitar lotação com kernels antigos.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/', 
    title: 'Raiz (/)',
    description: 'Onde o sistema operacional "vive". No perfil Médio e Avançado, recomendamos o sistema de arquivos Btrfs por permitir Snapshots e compressão de arquivos.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/home', 
    title: 'Home (/home)',
    description: 'Seu cofre de arquivos. Isolar o /home permite trocar de distro ou reinstalar o sistema mantendo todos os seus documentos e personalizações.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: 'Swap', 
    title: 'Memória Swap',
    description: 'Fundamental para a Hibernação. No perfil Médio e Avançado, configuramos Swap = RAM para garantir que o sistema possa suspender para o disco com segurança.',
    profiles: [UserProfile.BASIC, UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/var', 
    title: 'Variáveis (/var)',
    description: 'Isola logs do sistema e caches de pacotes (como Flatpaks). Recomendado no modo Médio para evitar que o cache lotte a partição raiz e cause travamentos.',
    profiles: [UserProfile.MEDIUM, UserProfile.ADVANCED]
  },
  { 
    point: '/opt', 
    title: 'Opcionais (/opt)',
    description: 'Destinado a softwares proprietários ou grandes pacotes de terceiros (como Chrome ou Slack) que não seguem a estrutura padrão do sistema.',
    profiles: [UserProfile.ADVANCED]
  },
  { 
    point: '/tmp', 
    title: 'Temporários (/tmp)',
    description: 'Arquivos de sessão e buffers voláteis. Em sistemas avançados, pode ser montado como RAM (tmpfs) para velocidade extrema.',
    profiles: [UserProfile.ADVANCED]
  },
  { 
    point: '/srv', 
    title: 'Serviços (/srv)',
    description: 'Contém dados para serviços oferecidos por este sistema, como sites ou repositórios de arquivos.',
    profiles: [UserProfile.ADVANCED]
  }
];
