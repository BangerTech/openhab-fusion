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
      state = newState;
      await service.updateItemState(item.name, newState);
    } catch (error) {
      state = state === 'ON' ? 'OFF' : 'ON';
      console.error('Failed to update switch state:', error);
    }
  }
</script>

<button 
  class="ha-fusion-switch"
  class:active={state === 'ON'}
  class:editing={isEditing}
  on:click={toggleSwitch}
  disabled={isEditing}
>
  <div class="switch-content">
    <div class="switch-header">
      <i class="fas fa-lightbulb"></i>
      <div class="switch-toggle">
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>
      </div>
    </div>
    <div class="switch-info">
      <span class="switch-label">{label}</span>
      <span class="switch-state">{state}</span>
    </div>
  </div>
</button>

<style>
  .ha-fusion-switch {
    width: 100%;
    height: 100%;
    padding: 1.2rem;
    border: none;
    border-radius: 12px;
    background: rgba(30, 30, 30, 0.6);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .switch-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .switch-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .switch-toggle {
    width: 40px;
    height: 24px;
    padding: 2px;
  }

  .toggle-track {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    position: relative;
    transition: background 0.3s;
  }

  .toggle-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    left: 2px;
    transition: transform 0.3s;
  }

  .switch-info {
    text-align: left;
  }

  .switch-label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
  }

  .switch-state {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .ha-fusion-switch.active {
    background: rgba(38, 198, 218, 0.3);
  }

  .ha-fusion-switch.active .toggle-track {
    background: #26c6da;
  }

  .ha-fusion-switch.active .toggle-thumb {
    transform: translateX(16px);
  }

  .ha-fusion-switch:hover {
    background: rgba(38, 198, 218, 0.2);
  }

  .ha-fusion-switch.editing {
    opacity: 0.7;
    cursor: default;
  }
</style> 