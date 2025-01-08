<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { DashboardItem, DashboardItemData } from '../../types/dashboard';
  import { OpenHABService } from '../../services/openhab';
  
  export let widget: DashboardItem;
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  
  $: item = widget?.item;
  $: label = item ? (item.label || item.name) : 'Unnamed Switch';
  $: state = item?.state || 'OFF';

  // Subscribe to OpenHAB events
  onMount(() => {
    const service = new OpenHABService('/api');
    
    const unsubscribe = service.subscribeToUpdates((event) => {
      if (event.topic?.includes(item?.name)) {
        if (item) {
          try {
            // Parse das JSON-Payload
            const payload = JSON.parse(event.payload);
            // Extrahiere den value
            item.state = payload.value;
          } catch (error) {
            console.error('Failed to parse event payload:', error);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  });

  async function toggleSwitch() {
    if (isEditing) return;
    
    const newState = state === 'ON' ? 'OFF' : 'ON';
    
    try {
      const response = await fetch(`/api/rest/items/${item.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        },
        body: newState
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      if (item) {
        item.state = newState;
      }
      
      dispatch('change', {
        itemName: item.name,
        newState
      });
    } catch (error) {
      console.error('Failed to update switch state:', error);
    }
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
  class:active={state === 'ON'}
  on:click={toggleSwitch}
  on:keydown={handleKeyDown}
  disabled={isEditing}
  type="button"
  role="switch"
  aria-checked={state === 'ON'}
>
  <div class="widget-content">
    <div class="widget-info">
      <span class="widget-label">{label}</span>
      <span class="widget-state">{state}</span>
    </div>
    <div class="switch-button">
      <div class="switch-track">
        <div class="switch-thumb"></div>
      </div>
    </div>
  </div>
</button>

<style>
  .switch-widget {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: none;
    border-radius: 1.2rem;
    background: rgba(38, 198, 218, 0.15);
    color: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  }

  .switch-widget:disabled {
    cursor: default;
    opacity: 0.7;
  }

  .switch-widget:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .widget-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }

  .widget-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .widget-label {
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }

  .widget-state {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    opacity: 0.8;
  }

  .switch-button {
    align-self: flex-start;
  }

  .switch-track {
    width: 3.2rem;
    height: 1.8rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    position: relative;
    transition: background 0.3s ease;
  }

  .switch-thumb {
    width: 1.4rem;
    height: 1.4rem;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .switch-widget.active .switch-track {
    background: #26c6da;
  }

  .switch-widget.active .switch-thumb {
    transform: translateX(1.4rem);
  }

  /* Optional: Dunklerer Hintergrund für aktive Widgets */
  .switch-widget.active {
    background: rgba(38, 198, 218, 0.25);
  }

  /* Hover-Effekte */
  .switch-widget:hover .switch-track {
    opacity: 0.9;
  }

  .switch-widget:active .switch-thumb {
    width: 1.6rem;
    transform: translateX(1.3rem);
  }

  /* Editing-Zustand */
  .switch-widget.editing {
    border: 2px dashed rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }
</style> 