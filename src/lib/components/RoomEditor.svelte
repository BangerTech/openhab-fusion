<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { generateUUID } from '../utils/uuid';
  
  export let tabs: Array<{id: string, name: string}>;
  export let onClose: () => void;
  export let onUpdate: (tabs: Array<{id: string, name: string}>) => void;
  
  let editedTabs = [...tabs];
  let editingTabId: string | null = null;
  
  function addRoom() {
    const newTab = { id: generateUUID(), name: 'New Room' };
    editedTabs = [...editedTabs, newTab];
    editingTabId = newTab.id;
  }
  
  function removeRoom(id: string) {
    editedTabs = editedTabs.filter(tab => tab.id !== id);
  }
  
  function updateRoomName(id: string, name: string) {
    editedTabs = editedTabs.map(tab => 
      tab.id === id ? { ...tab, name } : tab
    );
  }
  
  function save() {
    onUpdate(editedTabs);
    onClose();
  }
</script>

<div 
  class="modal-overlay" 
  transition:fade 
  on:click={onClose}
  on:keydown={e => e.key === 'Escape' && onClose()}
  role="dialog"
  aria-modal="true"
>
  <div 
    class="modal-content" 
    transition:scale 
    on:click|stopPropagation
    on:keydown|stopPropagation
  >
    <div class="modal-header">
      <h3>Edit Rooms</h3>
      <button class="close-button" on:click={onClose}>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="rooms-list">
      {#each editedTabs as tab (tab.id)}
        <div class="room-item" transition:scale|local>
          <div class="room-content">
            {#if editingTabId === tab.id}
              <input
                type="text"
                bind:value={tab.name}
                on:blur={() => editingTabId = null}
                on:keydown={e => e.key === 'Enter' && (editingTabId = null)}
                use:focus
              />
            {:else}
              <span class="room-name" on:dblclick={() => editingTabId = tab.id}>
                {tab.name}
              </span>
            {/if}
          </div>
          
          <div class="room-actions">
            <button 
              class="edit-button"
              on:click={() => editingTabId = tab.id}
            >
              <i class="fas fa-pencil"></i>
            </button>
            <button 
              class="delete-button"
              on:click={() => removeRoom(tab.id)}
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div class="modal-actions">
      <button class="add-button" on:click={addRoom}>
        <i class="fas fa-plus"></i>
        Add Room
      </button>
      <div class="action-buttons">
        <button class="cancel-button" on:click={onClose}>Cancel</button>
        <button class="save-button" on:click={save}>Save</button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin: 0;
    color: #2c3e50;
  }

  .rooms-list {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .room-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .room-item:hover {
    background: #f1f3f5;
  }

  .room-content {
    flex: 1;
    margin-right: 1rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .room-name {
    font-size: 1rem;
    color: #2c3e50;
  }

  .room-actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .edit-button,
  .delete-button {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #ddd;
  }

  .edit-button:hover {
    background: #e9ecef;
    border-color: #ced4da;
  }

  .delete-button:hover {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
  }

  .modal-actions {
    padding: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .add-button {
    background: #26c6da;
    color: white;
  }

  .add-button:hover {
    background: #2dd3e7;
  }

  .save-button {
    background: #4CAF50;
    color: white;
  }

  .save-button:hover {
    background: #45a049;
  }

  .cancel-button {
    background: #f8f9fa;
    border: 1px solid #ddd;
  }

  .cancel-button:hover {
    background: #e9ecef;
  }
</style> 