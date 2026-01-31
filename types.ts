export enum UserProfile {
  BASIC = 'basic',
  MEDIUM = 'medium',
  ADVANCED = 'advanced'
}

export enum DiskType {
  SSD = 'SSD',
  HDD = 'HDD',
  NVME = 'NVMe'
}

export enum BootMode {
  UEFI = 'UEFI (GPT)',
  LEGACY = 'Legacy (MBR)'
}

export interface Disk {
  id: string;
  size: number;
  type: DiskType;
  preservedSize?: number;
}

export interface Partition {
  point: string;
  size: number;
  color: string;
  diskIndex: number;
  fileSystem: string;
  description: string;
  isPreserved?: boolean;
  isVirtual?: boolean;
}