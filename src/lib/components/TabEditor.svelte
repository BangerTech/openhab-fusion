<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let tabs: Array<{id: string, name: string}>;
  export let activeTab: string;
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  function addTab() {
    const newTab = {
      id: crypto.randomUUID(),
      name: 'Neuer Raum'
    };
    dispatch('update', { tabs: [...tabs, newTab] });
  }

  function editTab(tab) {
    dispatch('edit', { tab });
  }

  function deleteTab(tabId) {
    dispatch('update', { tabs: tabs.filter(t => t.id !== tabId) });
  }
</script>

<div class="tab-container">
  {#each tabs as tab}
    <div class="tab" class:active={tab.id === activeTab}>
      <span>{tab.name}</span>
      {#if isEditing}
        <div class="tab-controls">
          <button class="edit-btn" on:click={() => editTab(tab)}>
            <i class="fas fa-pencil"></i>
          </button>
          <button class="delete-btn" on:click={() => deleteTab(tab.id)}>
            <i class="fas fa-times"></i>
          </button>
        </div>
      {/if}
    </div>
  {/each}
  
  {#if isEditing}
    <button class="add-tab" on:click={addTab}>
      <i class="fas fa-plus"></i>
    </button>
  {/if}
</div>

<style>
  .tab-container {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }

  .tab {
    padding: 0.7rem 1rem;
    border-radius: 8px;
    color: white;
    opacity: 0.7;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tab.active {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }

  .tab-controls {
    display: flex;
    gap: 0.3rem;
  }

  .edit-btn, .delete-btn {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .add-tab {
    padding: 0.7rem 1rem;
    border-radius: 8px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    background: none;
    color: white;
    cursor: pointer;
  }
</style> 