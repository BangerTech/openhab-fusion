<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardItem, DashboardItemData } from '../../types/dashboard';
  
  export let widget: DashboardItem;
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  
  $: item = widget?.item;
  $: label = item ? (item.label || item.name) : 'Unnamed Switch';
  $: state = item?.state || 'OFF';

  function toggleSwitch() {
    if (isEditing) return;
    
    const newState = state === 'ON' ? 'OFF' : 'ON';
    dispatch('change', {
      itemName: item.name,
      newState
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleSwitch();
    }
  }
</script>

<button 
  class="switch-widget" 
  class:editing={isEditing}
  on:click={toggleSwitch}
  on:keydown={handleKeyDown}
  disabled={isEditing}
  type="button"
  role="switch"
  aria-checked={state === 'ON'}
>
  <div class="widget-header">
    <span class="widget-label">{label}</span>
  </div>
  <div class="widget-content">
    <div class="switch-state" class:active={state === 'ON'}>
      {state}
    </div>
  </div>
</button>

<style>
  .switch-widget {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    border: none;
    background: white;
    cursor: pointer;
  }

  .switch-widget:disabled {
    cursor: default;
    pointer-events: none;
  }

  .switch-widget:not(:disabled):hover {
    background: #f5f5f5;
  }

  .widget-header {
    margin-bottom: 0.5rem;
  }

  .widget-label {
    font-weight: 500;
    color: #2c3e50;
  }

  .widget-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch-state {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: #f0f0f0;
    color: #666;
  }

  .switch-state.active {
    background: #4CAF50;
    color: white;
  }
</style> 