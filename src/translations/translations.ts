export const translations = {
  pt: {
    title: "LYNX-PROJECT",
    header: {
      app_name: "LYNX-PROJECT",
      description: "Particionamento Linux Inteligente",
      version: "v3.1 Stable"
    },
    checklist: {
      title: "PREPARAÇÃO PRÉ-INSTALAÇÃO",
      item1: "Desativar Secure Boot e Fast Boot na BIOS",
      item2: "Mudar modo SATA para AHCI (se necessário)",
      item3: "Confirmar tabela de partição: UEFI (GPT) ou Legacy (MBR)",
      item4: "Identificar partição de destino p/ Dual Boot"
    },
    modes: {
      basic: "Básico",
      medium: "Intermediário",
      advanced: "Avançado"
    },
    strategies: {
      integrated: "Integrada",
      split: "Separada",
      dedicated: "Dedicada",
      desc_integrated: "Tudo em /",
      desc_split: "Mesmo Disco",
      desc_dedicated: "Disco 2+",
      label: "Estratégia de Armazenamento",
      helper: "Define o local da pasta /home (arquivos pessoais)"
    },
    ui: {
      hardware: "HARDWARE",
      boot_format: "BOOT & FORMATO",
      customization: "CUSTOMIZAÇÃO",
      add_disk: "ADICIONAR UNIDADE",
      max_disks: "LIMITE ATINGIDO",
      map_title: "MAPA LOGÍSTICO DE DISCO",
      wiki_title: "BIBLIOTECA TÉCNICA",
      export_btn: "EXPORTAR PDF",
      script_btn: "SCRIPT SHELL",
      copy_script: "COPIAR COMANDOS",
      copied: "✓ COPIADO",
      strategy_label: "Configuração de Pastas e Dual-Boot",
      table_mount: "Ponto de Montagem",
      table_size: "Capacidade",
      table_drive: "Unidade",
      backup_alert: "Nota: O LYNX calcula as partições com base no seu hardware. Certifique-se de salvar seus dados antes de aplicar as mudanças.",
      add_disk_btn: "Adicionar Disco",
      path_placeholder: "caminho:",
      disk_tip: "Dica: No Live USB, abra o terminal (Ctrl+Alt+T), digite lsblk e use o identificador em 'Caminho:' (ex: sda, nvme0n1)",
      win_reserved: "Espaço Reservado p/ Windows",
      win_warning: "⚠️ Esse valor será subtraído do total e não será formatado.",
      wiki_subtitle: "Contexto Inteligente",
      export_pdf_title: "RELATÓRIO / PDF PROFISSIONAL",
      export_pdf_desc: "Gerar documentação técnica",
      export_txt_title: "CONFIGURAÇÃO / ARQUIVO TXT",
      export_txt_desc: "Resumo para consulta rápida",
      export_terminal_title: "DEPLOY SCRIPT / ABRIR CONSOLE",
      export_terminal_desc: "Comandos de particionamento",
      terminal_header: "# Plano Gerado para:",
      terminal_warning: "# Substitua /dev/sdXn pelos seus discos reais",
      terminal_copy: "COPIAR E EXECUTAR NO TERMINAL",
      disclaimer_title: "TERMOS DE RESPONSABILIDADE",
      disclaimer_text: "O LYNX é uma ferramenta de auxílio. A execução das operações de disco é de total responsabilidade do usuário. Backups são mandatórios.",
      subtitle: "ESTRATÉGIA TÉCNICA DE ALOCAÇÃO",
      table_desc: "Descrição"
    },
    labels: {
      ram: "Memória RAM",
      boot_mode: "Modo de Inicialização",
      distro: "Distribuição Alvo",
      disk_type: "Tipo de Unidade",
      disk_size: "Capacidade",
      preserved: "Preservado (Dual-Boot)",
      integrated: "Integrada"
    },
    wiki: {
  '/': { 
    title: "Partição Raiz (/)", 
    desc: 'A "raiz" do sistema. É onde o sistema operacional, drivers e programas principais são instalados.' 
  },
  '/home': { 
    title: "Partição /home", 
    desc: "Contém seus documentos, fotos, vídeos e configurações personalizadas dos aplicativos." 
  },
  'Swap': { 
    title: "Memória Swap", 
    desc: "Memória de troca usada quando a RAM física está cheia. Essencial para hibernação e estabilidade." 
  },
  '/boot/efi': { 
    title: "Partição EFI", 
    desc: "Partição de inicialização necessária para placas-mãe UEFI modernas para carregar o sistema." 
  },
  '/boot': { 
    title: "Partição /boot", 
    desc: "Armazena o Kernel Linux e os arquivos necessários para o processo inicial de boot." 
  },
  '/var': { 
    title: "Partição /var", 
    desc: "Contém dados variáveis como logs do sistema, caches de pacotes e bancos de dados." 
  },
  '/opt': { 
    title: "Diretório /opt", 
    desc: "Destinada à instalação de softwares adicionais (proprietários ou de terceiros) fora do repositório padrão." 
  },
  '/usr/local': { 
    title: "Diretório /usr/local", 
    desc: "Utilizada pelo administrador para instalar softwares localmente, garantindo que não sejam sobrescritos pelo sistema." 
  },
  '/srv': { 
    title: "Diretório /srv", 
    desc: "Armazena dados de serviços ativos, como arquivos de servidores web (HTML) ou repositórios FTP." 
  },
  '/tmp': { 
    title: "Diretório /tmp", 
    desc: "Espaço para arquivos temporários. No LYNX, sugerimos o uso de tmpfs (executado na memória RAM)." 
  },
  'Windows': { 
    title: "Partição Windows", 
    desc: "Partição preservada do Windows detectada para configuração de Dual-Boot." 
  },
  'DUAL_BOOT': { 
    title: "Dual-Boot", 
    desc: "Configuração que permite ter dois sistemas operacionais instalados no mesmo computador." 
  },
  'EXTRA_DISKS': { 
    title: "Discos Extras", 
    desc: "Unidades físicas adicionais configuradas para armazenamento de dados em massa." 
  },
  'MBR': { 
    title: "MBR (Legacy)", 
    desc: "Padrão antigo. O bootloader é instalado no início do disco. Não requer partição EFI." 
  }
    },
    footer: {
      description: "Ferramenta open-source de planejamento de discos para sistemas Linux.",
      legal_title: "Jurídico & Licença",
      license: "Licença MIT - Código Livre",
      community: "Uso Aberto para Comunidade",
      terms: "Termos de Contribuição",
      disclaimer_title: "Responsabilidade",
      disclaimer_text: "O uso desta ferramenta é de total responsabilidade do utilizador. O LYNX automatiza cálculos, mas a execução exige conhecimento técnico.",
      dev_by: "DESENVOLVIDO POR"
    }
  },
  en: {
    title: "LYNX-PROJECT",
    header: {
      app_name: "LYNX-PROJECT",
      description: "Smart Linux Partitioning",
      version: "v3.1 Stable"
    },
    checklist: {
      title: "PRE-INSTALLATION CHECKLIST",
      item1: "Disable Secure Boot and Fast Boot in BIOS",
      item2: "Change SATA mode to AHCI (if required)",
      item3: "Confirm partition table: UEFI (GPT) or Legacy (MBR)",
      item4: "Identify target partition for Dual Boot"
    },
    modes: {
      basic: "Basic",
      medium: "Intermediate",
      advanced: "Advanced"
    },
    strategies: {
      integrated: "Integrated",
      split: "Split",
      dedicated: "Dedicated",
      desc_integrated: "Everything in /",
      desc_split: "Same Disk",
      desc_dedicated: "Disk 2+",
      label: "Storage Strategy",
      helper: "Defines the /home folder location (personal files)"
    },
    ui: {
      hardware: "HARDWARE",
      boot_format: "BOOT & FORMAT",
      customization: "CUSTOMIZATION",
      add_disk: "ADD DRIVE",
      max_disks: "MAX REACHED",
      map_title: "DISK LOGISTIC MAP",
      wiki_title: "TECHNICAL LIBRARY",
      export_btn: "EXPORT PDF",
      script_btn: "SHELL SCRIPT",
      copy_script: "COPY COMMANDS",
      copied: "✓ COPIED",
      strategy_label: "Folder & Dual-Boot Setup",
      table_mount: "Mount Point",
      table_size: "Capacity",
      table_drive: "Drive",
      backup_alert: "Note: LYNX calculates partitions based on your hardware. Make sure to save your data before applying changes.",
      add_disk_btn: "Add Disk",
      path_placeholder: "path:",
      disk_tip: "Tip: On Live USB, open terminal (Ctrl+Alt+T), type lsblk and use the ID in 'Path:' (e.g. sda, nvme0n1)",
      win_reserved: "Reserved Space for Windows",
      win_warning: "⚠️ This value will be subtracted from total and will not be formatted.",
      wiki_subtitle: "Smart Context",
      export_pdf_title: "REPORT / PROFESSIONAL PDF",
      export_pdf_desc: "Generate technical documentation",
      export_txt_title: "CONFIG / TXT FILE",
      export_txt_desc: "Quick reference summary",
      export_terminal_title: "DEPLOY SCRIPT / OPEN CONSOLE",
      export_terminal_desc: "Partitioning commands",
      terminal_header: "# Plan Generated for:",
      terminal_warning: "# Replace /dev/sdXn with your actual disks",
      terminal_copy: "COPY AND RUN IN TERMINAL",
      disclaimer_title: "DISCLAIMER",
      disclaimer_text: "LYNX is a support tool. Disk operations are the sole responsibility of the user. Backups are mandatory.",
      subtitle: "TECHNICAL ALLOCATION STRATEGY",
      table_desc: "Description"
    },
    labels: {
      ram: "RAM Memory",
      boot_mode: "Boot Mode",
      distro: "Target Distribution",
      disk_type: "Drive Type",
      disk_size: "Capacity",
      preserved: "Preserved (Dual-Boot)",
      integrated: "Integrated"
    },
    wiki: {
  '/': { 
    title: "Root Partition (/)", 
    desc: 'The "root" of the system. This is where the operating system, drivers, and core programs are installed.' 
  },
  '/home': { 
    title: "/home Partition", 
    desc: "Contains your documents, photos, videos, and personalized application settings." 
  },
  'Swap': { 
    title: "Swap Memory", 
    desc: "Exchange memory used when physical RAM is full. Essential for hibernation and stability." 
  },
  '/boot/efi': { 
    title: "EFI Partition", 
    desc: "Boot partition required for modern UEFI motherboards to load the system." 
  },
  '/boot': { 
    title: "/boot Partition", 
    desc: "Stores the Linux Kernel and the files required for the initial boot process." 
  },
  '/var': { 
    title: "/var Partition", 
    desc: "Contains variable data such as system logs, package caches, and databases." 
  },
  '/opt': { 
    title: "/opt Directory", 
    desc: "Intended for installing additional software (proprietary or third-party) outside the standard repository." 
  },
  '/usr/local': { 
    title: "/usr/local Directory", 
    desc: "Used by the administrator to install software locally, ensuring they are not overwritten by the system." 
  },
  '/srv': { 
    title: "/srv Directory", 
    desc: "Stores data for active services, such as web server files (HTML) or FTP repositories." 
  },
  '/tmp': { 
    title: "/tmp Directory", 
    desc: "Space for temporary files. In LYNX, we suggest using tmpfs (running in RAM)." 
  },
  'Windows': { 
    title: "Windows Partition", 
    desc: "Preserved Windows partition detected for Dual-Boot configuration." 
  },
  'DUAL_BOOT': { 
    title: "Dual-Boot", 
    desc: "Configuration that allows having two operating systems installed on the same computer." 
  },
  'EXTRA_DISKS': { 
    title: "Extra Disks", 
    desc: "Additional physical drives configured for mass data storage." 
  },
  'MBR': { 
    title: "MBR (Legacy)", 
    desc: "Legacy standard. The bootloader is installed at the beginning of the disk. Does not require an EFI partition." 
  }
},
    footer: {
      description: "Open-source disk planning tool for Linux systems.",
      legal_title: "Legal & License",
      license: "MIT License - Open Source",
      community: "Open for Community Use",
      terms: "Contribution Terms",
      disclaimer_title: "Disclaimer",
      disclaimer_text: "Use of this tool is the sole responsibility of the user. LYNX automates calculations, but execution requires technical knowledge.",
      dev_by: "DEVELOPED BY"
    }
  }
};