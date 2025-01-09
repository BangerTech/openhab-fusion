import ModernSwitch from '../components/widgets/switch/ModernSwitch.svelte';
import AppleSwitch from '../components/widgets/switch/AppleSwitch.svelte';
import HAFusionSwitch from '../components/widgets/switch/HAFusionSwitch.svelte';
import MinimalSwitch from '../components/widgets/switch/MinimalSwitch.svelte';
import CircularDimmer from '../components/widgets/dimmer/CircularDimmer.svelte';
import SliderDimmer from '../components/widgets/dimmer/SliderDimmer.svelte';
import ModernThermostat from '../components/widgets/thermostat/ModernThermostat.svelte';
import SimpleThermo from '../components/widgets/thermostat/SimpleThermo.svelte';
import VacuumCard from '../components/widgets/vacuum/VacuumCard.svelte';
import MinimalVacuum from '../components/widgets/vacuum/MinimalVacuum.svelte';
import WeatherWidget from '../components/widgets/weather/WeatherWidget.svelte';
import CompactWeather from '../components/widgets/weather/CompactWeather.svelte';
import RGBWidget from '../components/widgets/RGBWidget.svelte';
import SensorWidget from '../components/widgets/SensorWidget.svelte';
import ModernTempWidget from '../components/widgets/temperature/ModernTempWidget.svelte';
import MinimalTempWidget from '../components/widgets/temperature/MinimalTempWidget.svelte';
import DimmerWidget from '../components/widgets/DimmerWidget.svelte';
import SwitchWidget from '../components/widgets/SwitchWidget.svelte';
import CameraWidget from '../components/widgets/camera/CameraWidget.svelte';
import MinimalCamera from '../components/widgets/camera/MinimalCamera.svelte';
import ContactWidget from '../components/widgets/contact/ContactWidget.svelte';
import MinimalContact from '../components/widgets/contact/MinimalContact.svelte';

export const OPENHAB_TYPE_MAPPING = {
  'Switch': ['switch', 'light'],
  'Dimmer': ['dimmer', 'light'],
  'Number': ['number', 'temperature', 'humidity', 'sensor'],
  'String': ['string', 'condition', 'status'],
  'Color': ['rgb', 'light'],
  'Rollershutter': ['rollershutter'],
  'Group': ['group', 'vacuum', 'weather'],
  'DateTime': ['datetime'],
  'Contact': ['contact', 'security'],
  'Location': ['location', 'weather']
};

// Zusätzliches Mapping für spezifische Widget-Typen
export const WIDGET_ITEM_TYPES = {
  switch: ['Switch'],
  dimmer: ['Dimmer'],
  rgb: ['Color'],
  thermostat: ['Number', 'Group'],
  vacuum: ['Group', 'Switch'],
  weather: ['Group', 'Number', 'String'],
  sensor: ['Number', 'String'],
  temperature: ['Number:Temperature', 'Number'],
  camera: ['String', 'Image'],
  contact: ['Contact']
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
  category: string;
}

export const WIDGET_TEMPLATES: Record<string, WidgetTemplate> = {
  switch: {
    type: 'switch',
    label: 'Switch',
    icon: 'toggle-on',
    variants: ['default', 'modern', 'apple', 'ha-fusion', 'minimal'],
    component: {
      default: SwitchWidget,
      modern: ModernSwitch,
      apple: AppleSwitch,
      'ha-fusion': HAFusionSwitch,
      minimal: MinimalSwitch
    },
    defaultSize: { w: 2, h: 2 },
    category: 'lighting'
  },
  dimmer: {
    type: 'dimmer',
    label: 'Dimmer',
    icon: 'sliders-h',
    variants: ['default', 'circular', 'slider'],
    component: {
      default: DimmerWidget,
      circular: CircularDimmer,
      slider: SliderDimmer
    },
    defaultSize: { w: 2, h: 3 },
    category: 'lighting'
  },
  thermostat: {
    type: 'thermostat',
    label: 'Thermostat',
    icon: 'thermometer-half',
    variants: ['modern', 'simple'],
    component: {
      modern: ModernThermostat,
      simple: SimpleThermo
    },
    defaultSize: { w: 2, h: 4 },
    category: 'climate'
  },
  vacuum: {
    type: 'vacuum',
    label: 'Vacuum',
    icon: 'robot',
    variants: ['card', 'minimal'],
    component: {
      card: VacuumCard,
      minimal: MinimalVacuum
    },
    defaultSize: { w: 4, h: 3 },
    category: 'appliances'
  },
  weather: {
    type: 'weather',
    label: 'Weather',
    icon: 'cloud-sun',
    variants: ['detailed', 'compact'],
    component: {
      detailed: WeatherWidget,
      compact: CompactWeather
    },
    defaultSize: { w: 4, h: 4 },
    category: 'weather'
  },
  rgb: {
    type: 'rgb',
    label: 'RGB Light',
    icon: 'palette',
    variants: ['default'],
    component: {
      default: RGBWidget
    },
    defaultSize: { w: 2, h: 4 },
    category: 'lighting'
  },
  sensor: {
    type: 'sensor',
    label: 'Sensor',
    icon: 'chart-line',
    variants: ['default'],
    component: {
      default: SensorWidget
    },
    defaultSize: { w: 2, h: 2 },
    category: 'sensors'
  },
  temperature: {
    type: 'temperature',
    label: 'Temperature',
    icon: 'thermometer-half',
    variants: ['modern', 'minimal'],
    component: {
      modern: ModernTempWidget,
      minimal: MinimalTempWidget
    },
    defaultSize: { w: 2, h: 2 },
    category: 'climate'
  },
  camera: {
    type: 'camera',
    label: 'Camera',
    icon: 'video',
    variants: ['default', 'minimal'],
    component: {
      default: CameraWidget,
      minimal: MinimalCamera
    },
    defaultSize: { w: 4, h: 3 },
    category: 'security'
  },
  contact: {
    type: 'contact',
    label: 'Contact Sensor',
    icon: 'door-closed',
    variants: ['default', 'minimal'],
    component: {
      default: ContactWidget,
      minimal: MinimalContact
    },
    defaultSize: { w: 2, h: 2 },
    category: 'security'
  }
};

export const WIDGETS = Object.values(WIDGET_TEMPLATES);

// Aktualisierte Kategorien
export const categories = [
  { id: 'all', name: 'All', icon: 'th' },
  { id: 'controls', name: 'Controls', icon: 'sliders-h' },
  { id: 'climate', name: 'Climate', icon: 'temperature-high' },
  { id: 'lighting', name: 'Lighting', icon: 'lightbulb' },
  { id: 'appliances', name: 'Appliances', icon: 'robot' },
  { id: 'sensors', name: 'Sensors', icon: 'chart-line' },
  { id: 'security', name: 'Security', icon: 'shield-alt' },
  { id: 'weather', name: 'Weather', icon: 'cloud-sun' }
];

export interface WidgetTypeDefinition {
  type: string;
  icon: string;
  label: string;
  minW: number;
  minH: number;
  defaultW: number;
  defaultH: number;
}

export const WIDGET_TYPES: WidgetTypeDefinition[] = [
  { 
    type: 'switch', 
    icon: 'toggle-on', 
    label: 'Switch', 
    minW: 2, 
    minH: 1, 
    defaultW: 3, 
    defaultH: 2 
  },
  { 
    type: 'dimmer', 
    icon: 'sliders-h', 
    label: 'Dimmer', 
    minW: 2, 
    minH: 1, 
    defaultW: 3, 
    defaultH: 2 
  },
  { 
    type: 'number', 
    icon: 'thermometer-half', 
    label: 'Sensor', 
    minW: 2, 
    minH: 1, 
    defaultW: 3, 
    defaultH: 2 
  },
  { 
    type: 'chart', 
    icon: 'chart-line', 
    label: 'Chart', 
    minW: 4, 
    minH: 3, 
    defaultW: 5, 
    defaultH: 4 
  },
  { 
    type: 'camera', 
    icon: 'video', 
    label: 'Camera', 
    minW: 4, 
    minH: 3, 
    defaultW: 5, 
    defaultH: 4 
  },
  { 
    type: 'weather', 
    icon: 'cloud-sun', 
    label: 'Weather', 
    minW: 4, 
    minH: 2, 
    defaultW: 5, 
    defaultH: 3 
  }
]; 