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
  <div class="item-icon">
    <i class="fas fa-{getItemIcon(item.type)}"></i>
  </div>
  <div class="item-content">
    <h3>{item.label}</h3>
    <p class="state">{item.state}</p>
  </div>
  
  {#if item.type === 'Switch'}
    <button 
      class="toggle-button"
      class:active={item.state === 'ON'}
      on:click={() => updateState(item.state === 'ON' ? 'OFF' : 'ON')}
      disabled={loading}
    >
      <span class="toggle-slider"></span>
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
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    transition: transform 0.2s;
  }

  .item-card:hover {
    transform: translateY(-2px);
  }

  .item-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .item-content {
    flex: 1;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .state {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .toggle-button {
    width: 50px;
    height: 26px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 13px;
    position: relative;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .toggle-slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .toggle-button.active .toggle-slider {
    transform: translateX(24px);
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
</style> 