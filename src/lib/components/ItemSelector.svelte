<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { OPENHAB_TYPE_MAPPING } from '../types/widgets';
  
  export let items: any[];
  export let widgetType: string;
  
  const dispatch = createEventDispatcher();
  
  // Filtere Items basierend auf dem Widget-Typ
  $: compatibleItems = items.filter(item => {
    const itemType = item.type.split(':')[0];
    return OPENHAB_TYPE_MAPPING[itemType]?.includes(widgetType);
  }).sort((a, b) => {
    const labelA = a.label || a.name;
    const labelB = b.label || b.name;
    return labelA.localeCompare(labelB);
  });
</script>

<div class="item-selector" transition:fade>
  <div class="selector-header">
    <h3>Select Item for {widgetType}</h3>
    <button class="close-button" on:click={() => dispatch('close')}>
      <i class="fas fa-times"></i>
    </button>
  </div>

  <div class="items-list">
    {#each compatibleItems as item}
      <button 
        class="item-option"
        on:click={() => dispatch('select', item)}
      >
        <div class="item-info">
          <span class="item-name">{item.label || item.name}</span>
          <span class="item-state">{item.state}</span>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .item-selector {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(44, 62, 80, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    min-width: 400px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1100;
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .items-list {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .item-option {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }

  .item-option:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .item-state {
    font-size: 0.9rem;
    opacity: 0.7;
  }
</style> 