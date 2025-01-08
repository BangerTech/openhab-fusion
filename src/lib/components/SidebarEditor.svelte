<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SidebarItem } from '../types/sidebar';

  export let items: SidebarItem[];
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  const availableWidgets = [
    { type: 'weather', name: 'Wetter' },
    { type: 'system', name: 'System Info' },
    { type: 'clock', name: 'Uhr' },
    { type: 'calendar', name: 'Kalender' }
  ];

  function addWidget(type: string) {
    const newWidget = {
      id: crypto.randomUUID(),
      type,
      config: {}
    };
    dispatch('update', { items: [...items, newWidget] });
  }
</script>

<div class="sidebar-editor" class:editing={isEditing}>
  {#if isEditing}
    <div class="widget-palette">
      <h3>Verfügbare Widgets</h3>
      <div class="widget-list">
        {#each availableWidgets as widget}
          <button 
            class="widget-template"
            on:click={() => addWidget(widget.type)}
          >
            <i class="fas fa-plus"></i>
            <span>{widget.name}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="sidebar-content">
    <slot></slot>
  </div>
</div>

<style>
  .sidebar-editor {
    height: 100%;
    transition: all 0.3s;
  }

  .widget-palette {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .widget-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .widget-template {
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .widget-template:hover {
    background: rgba(255, 255, 255, 0.15);
  }
</style> 