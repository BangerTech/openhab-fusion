export interface DashboardItem {
  id: string;
  type: string;
  item: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  icon?: string;
  options?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  items: DashboardItem[];
} 