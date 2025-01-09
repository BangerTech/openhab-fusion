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
</script>

<div class="sidebar-editor" class:editing={isEditing}>
  <div class="sidebar-content">
    <slot></slot>
  </div>

  {#if isEditing && editTarget === 'sidebar'}
    <div class="edit-buttons">
      <button class="edit-button" on:click={() => editComponent('time')}>
        <i class="fas fa-pencil"></i>
      </button>
      <button class="edit-button" on:click={() => editComponent('date')}>
        <i class="fas fa-pencil"></i>
      </button>
      <button class="edit-button" on:click={() => editComponent('weather')}>
        <i class="fas fa-pencil"></i>
      </button>
    </div>
  {/if}
</div>

<style>
  .sidebar-editor {
    position: relative;
    height: 100%;
  }

  .edit-buttons {
    position: absolute;
    top: 0;
    right: -40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .edit-button {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    opacity: 0;
  }

  .edit-buttons:hover .edit-button {
    opacity: 1;
  }

  .edit-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
</style> 