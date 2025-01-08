export type WidgetType = 
  | 'switch'
  | 'dimmer'
  | 'number'
  | 'string'
  | 'color'
  | 'rollershutter'
  | 'chart'
  | 'group';

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