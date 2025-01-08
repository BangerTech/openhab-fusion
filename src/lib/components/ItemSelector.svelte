<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { WidgetType } from '../types/widgets';
  
  export let items: any[] = [];
  let searchQuery = '';
  let selectedType: WidgetType | 'all' = 'all';
  
  const dispatch = createEventDispatcher();

  // Gruppiere Items nach Typ
  $: groupedItems = items.reduce((acc, item) => {
    const type = item.type.toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  // Filtere Items basierend auf Suche und Typ
  $: filteredItems = items.filter(item => {
    const matchesSearch = item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  function selectItem(item) {
    dispatch('select', { item });
  }
</script>

<div class="item-selector">
  <div class="search-bar">
    <i class="fas fa-search"></i>
    <input 
      type="text" 
      bind:value={searchQuery}
      placeholder="Suche nach Items..."
    />
  </div>

  <div class="type-filter">
    <button 
      class:active={selectedType === 'all'}
      on:click={() => selectedType = 'all'}
    >
      Alle
    </button>
    {#each Object.keys(groupedItems) as type}
      <button 
        class:active={selectedType === type}
        on:click={() => selectedType = type}
      >
        {type} ({groupedItems[type].length})
      </button>
    {/each}
  </div>

  <div class="items-grid">
    {#each filteredItems as item (item.name)}
      <button 
        class="item-card"
        on:click={() => selectItem(item)}
      >
        <div class="item-icon">
          <i class="fas fa-{getIconForType(item.type)}"></i>
        </div>
        <div class="item-info">
          <span class="item-label">{item.label || item.name}</span>
          <span class="item-type">{item.type}</span>
        </div>
        <div class="item-state">
          {formatState(item.state)}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .item-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
  }

  .search-bar {
    position: relative;
  }

  .search-bar i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }

  .search-bar input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
  }

  .type-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .type-filter button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    background: white;
    color: #666;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .type-filter button.active {
    background: #0066cc;
    color: white;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .item-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px;
    color: #666;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .item-label {
    font-weight: 500;
    color: #333;
  }

  .item-type {
    font-size: 0.8rem;
    color: #666;
  }

  .item-state {
    font-size: 0.9rem;
    color: #0066cc;
  }
</style> 