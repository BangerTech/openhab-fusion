<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let widget: any;
  export let item: any;
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  function updateValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!item?.name) return;
    
    fetch(`/api/rest/items/${item.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      },
      body: target.value
    }).then(() => {
      item.state = target.value;
      dispatch('change', {
        itemName: item.name,
        newState: target.value
      });
    }).catch(error => {
      console.error('Failed to update dimmer value:', error);
    });
  }
</script>

<div class="dimmer-widget" class:editing={isEditing}>
  <div class="widget-content">
    <span class="widget-label">{item?.label || 'Dimmer'}</span>
    <div class="value-display">{item?.state || '0'}%</div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={item?.state || 0}
      on:input={updateValue}
      disabled={isEditing}
    />
  </div>
</div>

<style>
  .dimmer-widget {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border-radius: 1.2rem;
    background: rgba(38, 198, 218, 0.15);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .widget-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .widget-label {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .value-display {
    font-size: 2rem;
    font-weight: 300;
    text-align: center;
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin: 1rem 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input[type="range"]:disabled {
    opacity: 0.5;
  }

  .dimmer-widget.editing {
    border: 2px dashed rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }
</style> 