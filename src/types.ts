export enum UserProfile {
  BASIC = 'BASIC',
  MEDIUM = 'MEDIUM',
  ADVANCED = 'ADVANCED'
}

export enum DiskType {
  HDD = 'HDD',
  SSD = 'SSD',
  NVME = 'NVME'
}

export enum BootMode {
  UEFI = 'UEFI',
  BIOS = 'BIOS'
}

export enum HomeStrategy {
  INTEGRATED = 'integrated', // / e /home juntos
  SPLIT_DISK1 = 'split_disk1', // / e /home separados no mesmo disco
  DEDICATED_DISK2 = 'dedicated_disk2' // /home em outro disco físico
}

export interface Disk {
  id: string;
  size: number;
  type: DiskType;
  isMain: boolean;
  preservedSize: number;
  devicePath?: string; // NOVO: Campo para /dev/sda, etc.
}

export interface Partition {
  point: string;
  size: number;
  description: string;
  fileSystem: string;
  diskIndex: number;
  isPreserved?: boolean;
}

export interface ThemeConfig {
  primary: string;
  accent: string;
  text: string;
  border: string;
  shadow: string;
}