<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  
  function toggleEdit() {
    dispatch('toggleEdit');
  }
  
  function addWidget() {
    dispatch('addWidget');
  }

  function handleDisconnect() {
    dispatch('disconnect');
  }
</script>

<div class="toolbar" class:visible={isEditing}>
  <div class="toolbar-content">
    <div class="left-controls">
      {#if isEditing}
        <button class="edit-button active" on:click={toggleEdit}>
          <i class="fas fa-check"></i>
          Done
        </button>
        <button class="control-button" on:click={addWidget}>
          <i class="fas fa-plus"></i>
          Add Widget
        </button>
      {:else}
        <button class="edit-button" on:click={toggleEdit}>
          <i class="fas fa-edit"></i>
          Edit Dashboard
        </button>
      {/if}
    </div>

    <div class="right-controls">
      <button class="disconnect-button" on:click={handleDisconnect}>
        <i class="fas fa-power-off"></i>
        Disconnect
      </button>
    </div>
  </div>
</div>

<style>
  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--surface-container);
    border-bottom: 1px solid var(--border-color);
    z-index: 1000;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  .toolbar.visible {
    transform: translateY(0);
  }

  .toolbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left-controls, .right-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .edit-button, .control-button, .disconnect-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: var(--surface-container-high);
    color: var(--on-surface);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .edit-button:hover, .control-button:hover {
    background: var(--surface-container-highest);
  }

  .edit-button.active {
    background: var(--primary);
    color: var(--on-primary);
  }

  .disconnect-button {
    background: var(--error-container);
    color: var(--on-error-container);
  }

  .disconnect-button:hover {
    opacity: 0.9;
  }
</style> 