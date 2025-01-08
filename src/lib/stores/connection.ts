import { writable } from 'svelte/store';

type ConnectionState = {
  url: string;
  connected: boolean;
};

export const connectionStore = writable<ConnectionState>({
  url: '',
  connected: false
}); 