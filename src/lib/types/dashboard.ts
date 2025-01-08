export interface DashboardItemData {
  name: string;
  label: string;
  type: string;
  state: string | null;
}

export interface DashboardItem {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  item: DashboardItemData | null;
  options: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  items: DashboardItem[];
} 