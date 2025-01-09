<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardItem } from '../../../types/dashboard';
  
  export let widget: DashboardItem;
  export let isEditing = false;
  export let service: any;
  
  const dispatch = createEventDispatcher();
  
  $: item = widget?.item;
  $: state = item?.state || 'OFF';
  $: label = item?.label || 'Switch';

  async function toggleSwitch() {
    if (isEditing) return;
    
    try {
      const newState = state === 'ON' ? 'OFF' : 'ON';
      state = newState; // Optimistisches Update
      await service.updateItemState(item.name, newState);
    } catch (error) {
      state = state === 'ON' ? 'OFF' : 'ON'; // Zurücksetzen bei Fehler
      console.error('Failed to update switch state:', error);
    }
  }
</script>

<button 
  class="apple-switch"
  class:active={state === 'ON'}
  class:editing={isEditing}
  on:click={toggleSwitch}
  disabled={isEditing}
>
  <div class="content">
    <div class="icon-wrapper">
      <i class="fas fa-lightbulb"></i>
      <div class="status-indicator"></div>
    </div>
    <div class="info">
      <span class="label">{label}</span>
      <span class="state">{state}</span>
    </div>
  </div>
</button>

<style>
  .apple-switch {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border: none;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .icon-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    place-items: center;
    font-size: 1.2rem;
  }

  .status-indicator {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: 2px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    text-align: left;
  }

  .label {
    font-size: 1rem;
    font-weight: 500;
  }

  .state {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .apple-switch.active {
    background: rgba(38, 198, 218, 0.2);
  }

  .apple-switch.active .icon-wrapper {
    background: #26c6da;
  }

  .apple-switch.active .status-indicator {
    background: #4CAF50;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .apple-switch:hover {
    transform: scale(1.02);
  }

  .apple-switch.editing {
    opacity: 0.7;
    cursor: default;
  }
</style> 