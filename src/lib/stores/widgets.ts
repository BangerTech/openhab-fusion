import { writable } from 'svelte/store';

export interface WidgetPosition {
  id: string;
  order: number;
}

export const widgetPositions = writable<WidgetPosition[]>([
  { id: 'clock-1', order: 0 },
  { id: 'weather-1', order: 1 },
  { id: 'viewlist-1', order: 2 }
]); 