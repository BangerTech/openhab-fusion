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
    padding: 1.2rem;
    border: none;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .widget-content {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 1rem;
  }

  .widget-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .widget-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: white;
  }

  .widget-state {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .switch-track {
    width: 44px;
    height: 26px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 13px;
    position: relative;
    transition: background 0.3s ease;
  }

  .switch-thumb {
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .switch-widget.active {
    background: rgba(38, 198, 218, 0.15);
  }

  .switch-widget.active .switch-track {
    background: #26c6da;
  }

  .switch-widget.active .switch-thumb {
    transform: translateX(18px);
  }

  .switch-widget:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
</style> 