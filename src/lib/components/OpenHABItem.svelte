<script lang="ts">
  import { onMount } from 'svelte';
  import type { OpenHABService } from '../services/openhab';

  interface Item {
    name: string;
    state: string;
    type: string;
    label: string;
  }

  export let item: Item;
  export let openhabService: OpenHABService;

  let loading = false;

  async function updateState(newState: string) {
    try {
      loading = true;
      await openhabService.updateItemState(item.name, newState);
    } catch (error) {
      console.error('Failed to update state:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    openhabService.subscribeToUpdates((event) => {
      if (event.topic.includes(item.name)) {
        item.state = event.payload;
      }
    });
  });
</script>

<div class="item-card" class:loading>
  <h3>{item.label}</h3>
  <p>Status: {item.state}</p>
  
  {#if item.type === 'Switch'}
    <button 
      on:click={() => updateState(item.state === 'ON' ? 'OFF' : 'ON')}
      disabled={loading}
    >
      {item.state === 'ON' ? 'Ausschalten' : 'Einschalten'}
    </button>
  {:else if item.type === 'Dimmer'}
    <input 
      type="range" 
      min="0" 
      max="100" 
      bind:value={item.state}
      on:change={(e) => updateState(e.target.value)}
      disabled={loading}
    />
  {/if}
</div>

<style>
  .item-card {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    background: #0066cc;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #0052a3;
  }
</style> 