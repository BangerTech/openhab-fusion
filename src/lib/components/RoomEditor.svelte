<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  
  export let tabs: Array<{id: string, name: string}>;
  export let onClose: () => void;
  export let onUpdate: (tabs: Array<{id: string, name: string}>) => void;
  
  let editedTabs = [...tabs];
  
  function addRoom() {
    editedTabs = [...editedTabs, { id: crypto.randomUUID(), name: 'New Room' }];
  }
  
  function removeRoom(id: string) {
    editedTabs = editedTabs.filter(tab => tab.id !== id);
  }
  
  function save() {
    onUpdate(editedTabs);
    onClose();
  }
</script>

<div class="modal-overlay" transition:fade on:click={onClose}>
  <div class="modal-content" transition:scale on:click|stopPropagation>
    <div class="modal-header">
      <h2>Edit Rooms</h2>
      <button class="close-button" on:click={onClose}>
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="rooms-list">
      {#each editedTabs as tab (tab.id)}
        <div class="room-item" transition:scale>
          <div class="room-input">
            <i class="fas fa-home"></i>
            <input 
              type="text" 
              bind:value={tab.name}
              placeholder="Room name"
            />
          </div>
          <button class="delete-room" on:click={() => removeRoom(tab.id)}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      {/each}
      
      <button class="add-room" on:click={addRoom}>
        <i class="fas fa-plus"></i>
        Add Room
      </button>
    </div>
    
    <div class="modal-actions">
      <button class="cancel-button" on:click={onClose}>Cancel</button>
      <button class="save-button" on:click={save}>Save Changes</button>
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
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: rgba(44, 62, 80, 0.95);
    border-radius: 16px;
    padding: 1.5rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .rooms-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .room-item {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .room-input {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.8rem;
    border-radius: 12px;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
  }

  .add-room {
    background: rgba(38, 198, 218, 0.2);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .save-button {
    background: #26c6da;
    color: white;
  }

  .cancel-button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
</style> 