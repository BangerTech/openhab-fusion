export type WidgetType = 
  | 'switch'
  | 'dimmer'
  | 'number'
  | 'chart'
  | 'camera'
  | 'weather';

export interface WidgetConfig {
  title?: string;
  icon?: string;
  showLabel?: boolean;
  showState?: boolean;
  theme?: string;
  chartPeriod?: string;
  chartType?: 'line' | 'bar';
  decimals?: number;
  unit?: string;
}

export interface WidgetTheme {
  background: string;
  textColor: string;
  borderColor?: string;
  accentColor?: string;
}

export const OPENHAB_TYPE_MAPPING = {
  'Switch': ['switch'],
  'Dimmer': ['dimmer'],
  'Number': ['number', 'number:temperature', 'number:dimensionless', 'number:energy', 'number:power'],
  'String': ['string'],
  'Color': ['color'],
  'Rollershutter': ['rollershutter'],
  'Group': ['group']
} as const; 