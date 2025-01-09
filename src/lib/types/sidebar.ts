export interface SidebarItem {
  id: string;
  type: 'clock' | 'weather' | 'system-info' | 'navigation';
  settings?: {
    fontSize?: string;
    showDate?: boolean;
    showTime?: boolean;
    showSeconds?: boolean;
    format?: string;
    [key: string]: any;
  };
  position: number;
} 