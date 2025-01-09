<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SidebarItem } from '../types/sidebar';
  import { onMount } from 'svelte';

  export let items: SidebarItem[] = [];
  export let isEditing = false;
  export let editTarget: 'dashboard' | 'sidebar' | 'tabs' = 'dashboard';
  export let settings = {
    title: 'Home',
    showTime: true,
    showDate: true,
    showWeather: true
  };

  const dispatch = createEventDispatcher();

  let time = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString('de-DE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  let weather = { temp: '21', humidity: '65' };
  
  let navigation = [
    { id: 'home', label: 'Home', icon: 'home', active: true },
    { id: 'entities', label: 'Entities', icon: 'shapes', active: false }
  ];

  // Zeit aktualisieren
  onMount(() => {
    const interval = setInterval(() => {
      time = new Date().toLocaleTimeString();
      date = new Date().toLocaleDateString('de-DE', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  function editComponent(type: string) {
    dispatch('editComponent', { type });
  }

  function editNavItem(item: any) {
    dispatch('editNavItem', { item });
  }

  function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    dispatch('updateSettings', settings);
  }

  function addSidebarWidget() {
    showWidgetSelector = true;
  }

  let showWidgetSelector = false;

  function handleDrop(event) {
    if (!isEditing) return;
    // Implementiere Drag & Drop Logik
  }
  
  function handleRemove(itemId) {
    if (!isEditing) return;
    items = items.filter(item => item.id !== itemId);
    dispatch('update', { items });
  }
</script>

<div class="sidebar-editor" class:editing={isEditing}>
  {#if isEditing}
    <div class="edit-overlay">
      <div class="edit-controls">
        <button on:click={() => handleAdd()}>
          <i class="fas fa-plus"></i>
          Add Widget
        </button>
      </div>
    </div>
  {/if}
  
  <slot></slot>
</div>

<style>
  .sidebar-editor {
    position: relative;
    height: 100%;
  }
  
  .edit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    pointer-events: none;
  }
  
  .editing .edit-overlay {
    pointer-events: all;
  }
  
  .edit-controls {
    padding: 1rem;
  }
</style> 