import { writable, type Writable } from 'svelte/store';

type ConnectionState = {
  url: string;
  connected: boolean;
};

export const connectionStore: Writable<ConnectionState> = writable({
  url: '',
  connected: false
}); 