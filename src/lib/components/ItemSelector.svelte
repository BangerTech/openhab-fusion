<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { OPENHAB_TYPE_MAPPING } from '../types/widgets';
  
  export let items: any[];
  export let widgetType: string;
  
  const dispatch = createEventDispatcher();
  let searchQuery = '';
  
  function focusOnMount(node) {
    node.focus();
    return {};
  }
  
  // Filtere Items basierend auf dem Widget-Typ
  $: compatibleItems = items.filter(item => {
    const itemType = item.type.split(':')[0];
    return OPENHAB_TYPE_MAPPING[itemType]?.includes(widgetType);
  }).sort((a, b) => {
    const labelA = a.label || a.name;
    const labelB = b.label || b.name;
    return labelA.localeCompare(labelB);
  });

  $: filteredItems = compatibleItems.filter(item => {
    const searchTerm = searchQuery.toLowerCase();
    const label = (item.label || item.name).toLowerCase();
    const name = item.name.toLowerCase();
    return label.includes(searchTerm) || name.includes(searchTerm);
  });
</script>

<div class="item-selector" transition:fade>
  <div class="selector-header">
    <h3>Select Item for {widgetType}</h3>
    <button class="close-button" on:click={() => dispatch('close')}>
      <i class="fas fa-times"></i>
    </button>
  </div>

  <div class="search-container">
    <div class="search-input">
      <i class="fas fa-search"></i>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search items..."
        use:focusOnMount
      />
      {#if searchQuery}
        <button 
          class="clear-search" 
          on:click={() => searchQuery = ''}
        >
          <i class="fas fa-times"></i>
        </button>
      {/if}
    </div>
  </div>

  <div class="items-list">
    {#if filteredItems.length === 0}
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No items found matching "{searchQuery}"</p>
      </div>
    {/if}
    {#each filteredItems as item}
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

  .search-container {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem 1rem;
  }

  .search-input i {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 0.5rem;
  }

  .search-input input {
    flex: 1;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    outline: none;
  }

  .search-input input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .clear-search {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .clear-search:hover {
    color: white;
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  .no-results i {
    font-size: 2rem;
    opacity: 0.5;
  }
</style> 