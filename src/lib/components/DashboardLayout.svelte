<script lang="ts">
  import EditToolbar from './EditToolbar.svelte';
  import Sidebar from './Sidebar.svelte';
  import { currentView } from '../stores/view';
  import { editorStore } from '../stores/editor';

  function handleToggleEdit() {
    editorStore.toggleEdit();
  }

  function handleDisconnect() {
    // Implementiere Disconnect-Logik
  }

  function handleAddWidget() {
    // Implementiere Add Widget-Logik
  }
</script>

<div class="dashboard-layout">
  <EditToolbar 
    on:toggleEdit={handleToggleEdit}
    on:disconnect={handleDisconnect}
    on:addWidget={handleAddWidget}
  />

  <Sidebar />

  <div class="content-wrapper">
    <div class="view-header">
      <h1>{$currentView}</h1>
      <button 
        class="edit-toggle"
        class:active={editorStore.isEditing}
        on:click={handleToggleEdit}
      >
        <i class="fas fa-edit"></i>
      </button>
    </div>

    <main class="dashboard-content" class:editing={editorStore.isEditing}>
      <slot />
    </main>
  </div>
</div>

<style>
  .dashboard-layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 300px 1fr;
    background: var(--gradient-bg);
    color: white;
  }

  .content-wrapper {
    padding: 2rem;
    overflow-y: auto;
  }

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .view-header h1 {
    font-size: 2rem;
    font-weight: 500;
    margin: 0;
  }

  .edit-toggle {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
  }

  .edit-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .edit-toggle.active {
    background: var(--primary);
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    transition: padding 0.3s ease;
  }

  .dashboard-content.editing {
    padding-top: 3rem;
  }
</style> 