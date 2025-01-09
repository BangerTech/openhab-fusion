import ModernSwitch from '../components/widgets/switch/ModernSwitch.svelte';
import DimmerWidget from '../components/widgets/DimmerWidget.svelte';
import RGBWidget from '../components/widgets/RGBWidget.svelte';
import ThermostatWidget from '../components/widgets/ThermostatWidget.svelte';

export const OPENHAB_TYPE_MAPPING = {
  'Switch': ['switch'],
  'Dimmer': ['dimmer'],
  'Number': ['number', 'temperature'],
  'String': ['string'],
  'Color': ['rgb'],
  'Rollershutter': ['rollershutter'],
  'Group': ['group']
};

export interface WidgetTemplate {
  type: string;
  label: string;
  icon: string;
  variants?: string[];
  component: any;
  defaultSize: {
    w: number;
    h: number;
  };
}

export const WIDGET_TEMPLATES: Record<string, WidgetTemplate> = {
  switch: {
    type: 'switch',
    label: 'Switch',
    icon: 'toggle-on',
    variants: ['default', 'modern', 'ha-fusion'],
    component: {
      default: ModernSwitch,
      modern: ModernSwitch,
      'ha-fusion': ModernSwitch
    },
    defaultSize: { w: 2, h: 2 }
  },
  dimmer: {
    type: 'dimmer',
    label: 'Dimmer',
    icon: 'sliders-h',
    component: DimmerWidget,
    defaultSize: { w: 2, h: 3 }
  },
  rgb: {
    type: 'rgb',
    label: 'RGB Light',
    icon: 'palette',
    component: RGBWidget,
    defaultSize: { w: 2, h: 4 }
  },
  thermostat: {
    type: 'thermostat',
    label: 'Thermostat',
    icon: 'thermometer-half',
    component: ThermostatWidget,
    defaultSize: { w: 2, h: 4 }
  }
};

export const WIDGETS = Object.values(WIDGET_TEMPLATES); 