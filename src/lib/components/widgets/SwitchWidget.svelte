<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { DashboardItem, DashboardItemData } from '../../types/dashboard';
  import { OpenHABService } from '../../services/openhab';
  
  export let widget: any;
  export let isEditing = false;
  export let demo = false;
  export let service: OpenHABService;
  export let key: number | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  // Reaktive Deklarationen für Widget-Optionen
  $: {
    console.log('Widget received:', widget);
    console.log('Widget options:', widget.options);
  }
  
  $: options = widget.options ?? {};
  $: title = options.title || widget.item?.label || 'Switch';
  $: showIcon = options.showIcon ?? true;
  $: showState = options.showState ?? true;
  $: iconColor = options.color || '#ffffff';
  
  $: item = widget?.item;
  $: state = item?.state || 'OFF';
  
  let demoState = 'OFF';
  $: displayState = demo ? demoState : state;

  // Subscribe to OpenHAB events
  onMount(() => {
    if (demo) return;
    
    const unsubscribe = service.subscribeToUpdates((event) => {
      if (event.topic?.includes(item?.name)) {
        item.state = event.payload;
        state = event.payload;
      }
    });

    return () => {
      unsubscribe();
    };
  });

  async function toggleSwitch() {
    if (demo) {
      demoState = demoState === 'ON' ? 'OFF' : 'ON';
      return;
    }
    
    if (!item?.name) return;
    
    try {
      const newState = state === 'ON' ? 'OFF' : 'ON';
      // Optimistisches Update
      state = newState;
      await service.updateItemState(item.name, newState);
    } catch (error) {
      console.error('Failed to update switch state:', error);
      // Bei Fehler zurücksetzen
      state = state === 'ON' ? 'OFF' : 'ON';
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleSwitch();
    }
  }

  // Initialen Status setzen
  $: {
    if (item?.state) {
      state = item.state;
    }
  }

  $: {
    console.log('Widget updated:', widget);
    console.log('Current options:', widget.options);
  }
</script>

<button 
  class="switch-widget" 
  class:editing={isEditing}
  class:active={displayState === 'ON'}
  on:click={toggleSwitch}
  on:keydown={handleKeyDown}
  disabled={isEditing && !demo}
  type="button"
  role="switch"
  aria-checked={displayState === 'ON'}
>
  <div class="widget-content">
    <div class="widget-info">
      <span class="widget-label">{title}</span>
      {#if showState}
        <span class="widget-state">{displayState}</span>
      {/if}
    </div>
    {#if showIcon}
    <div class="switch-button">
      <div class="switch-track">
        <div class="switch-thumb"></div>
      </div>
    </div>
    {/if}
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