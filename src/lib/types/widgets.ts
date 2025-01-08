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

export type WidgetVariant = 'default' | 'ha-fusion' | 'minimal' | 'large';

export interface WidgetTemplate {
  type: string;
  variants: WidgetVariant[];
  defaultSize: {
    w: number;
    h: number;
  };
  minSize: {
    w: number;
    h: number;
  };
  maxSize?: {
    w: number;
    h: number;
  };
}

export const WIDGET_TEMPLATES: Record<string, WidgetTemplate> = {
  switch: {
    type: 'switch',
    variants: ['default', 'ha-fusion', 'minimal'],
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 4, h: 4 }
  },
  dimmer: {
    type: 'dimmer',
    variants: ['default', 'ha-fusion', 'slider'],
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 4, h: 4 }
  },
  number: {
    type: 'number',
    variants: ['default', 'gauge', 'minimal'],
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 4, h: 4 }
  },
  temperature: {
    type: 'temperature',
    variants: ['default', 'minimal'],
    defaultSize: { w: 2, h: 1 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 4, h: 2 }
  },
  humidity: {
    type: 'humidity',
    variants: ['default', 'minimal'],
    defaultSize: { w: 2, h: 1 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 4, h: 2 }
  },
  'media-player': {
    type: 'media-player',
    variants: ['default', 'minimal'],
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 6, h: 4 }
  },
  camera: {
    type: 'camera',
    variants: ['default'],
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 8, h: 6 }
  },
  chart: {
    type: 'chart',
    variants: ['line', 'bar'],
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 8, h: 6 }
  },
  weather: {
    type: 'weather',
    variants: ['default', 'forecast'],
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 6, h: 4 }
  }
}; 