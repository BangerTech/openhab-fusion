<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let isEditing = false;
  export let editTarget: 'dashboard' | 'sidebar' | 'tabs' = 'dashboard';
  
  const dispatch = createEventDispatcher();
</script>

<div class="edit-controls" class:active={isEditing}>
  <!-- Edit Mode Toggle -->
  <button 
    class="edit-toggle"
    class:active={isEditing} 
    on:click={() => dispatch('toggleEdit')}
  >
    <i class="fas fa-{isEditing ? 'check' : 'edit'}"></i>
    <span>{isEditing ? 'Fertig' : 'Bearbeiten'}</span>
  </button>

  {#if isEditing}
    <div class="edit-targets">
      <button 
        class:active={editTarget === 'dashboard'}
        on:click={() => dispatch('setTarget', 'dashboard')}
      >
        <i class="fas fa-th-large"></i>
        <span>Dashboard</span>
      </button>
      
      <button 
        class:active={editTarget === 'sidebar'}
        on:click={() => dispatch('setTarget', 'sidebar')}
      >
        <i class="fas fa-columns"></i>
        <span>Seitenleiste</span>
      </button>
      
      <button 
        class:active={editTarget === 'tabs'}
        on:click={() => dispatch('setTarget', 'tabs')}
      >
        <i class="fas fa-folder"></i>
        <span>Räume</span>
      </button>
    </div>

    <button 
      class="add-button"
      on:click={() => dispatch('showAddDialog')}
    >
      <i class="fas fa-plus"></i>
      <span>Hinzufügen</span>
    </button>
  {/if}
</div>

<style>
  .edit-controls {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    gap: 1rem;
    z-index: 100;
  }

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 12px;
    background: rgba(38, 198, 218, 0.9);
    color: white;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
  }

  button:hover {
    transform: translateY(-2px);
    background: rgba(38, 198, 218, 1);
  }

  .edit-targets {
    display: flex;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    padding: 0.3rem;
    border-radius: 14px;
  }

  .edit-targets button {
    background: transparent;
    opacity: 0.7;
  }

  .edit-targets button.active {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }

  .add-button {
    background: #4CAF50;
  }
</style> 