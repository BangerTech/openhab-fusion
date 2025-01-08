import { writable } from 'svelte/store';
import type { OpenHABService } from '../services/openhab';

export const openhabService = writable<OpenHABService | null>(null);
export const items = writable<any[]>([]);
export const error = writable<string | null>(null); 