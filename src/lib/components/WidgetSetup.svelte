<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { WIDGET_TEMPLATES } from '../types/widgets';
  
  export let selectedWidgetType: string;
  export let items: any[];
  
  const dispatch = createEventDispatcher();
  const template = WIDGET_TEMPLATES[selectedWidgetType];

  let selectedItem = null;
  let selectedVariant = template?.variants[0] || 'default';
  let widgetSize = {
    w: template?.defaultSize.w || 2,
    h: template?.defaultSize.h || 2
  };

  function handleSave() {
    if (!selectedItem) return;

    const widget = {
      id: crypto.randomUUID(),
      type: selectedWidgetType,
      variant: selectedVariant,
      x: 0,
      y: 0,
      w: widgetSize.w,
      h: widgetSize.h,
      item: selectedItem,
      options: {}
    };

    dispatch('save', { widget });
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="widget-setup-overlay">
  <div class="widget-setup">
    <h3>Configure Widget: {selectedWidgetType}</h3>
    
    <div class="setup-form">
      <div class="form-group">
        <label for="item-select">Select Item</label>
        <select 
          id="item-select"
          bind:value={selectedItem}
        >
          <option value={null}>Please select...</option>
          {#each items as item}
            <option value={item}>{item.label || item.name}</option>
          {/each}
        </select>
      </div>

      {#if template?.variants.length > 1}
        <div class="form-group">
          <label id="variant-label">Widget Variant</label>
          <div class="variant-options">
            {#each template.variants as variant}
              <button 
                class="variant-option" 
                class:active={selectedVariant === variant}
                on:click={() => selectedVariant = variant}
              >
                {variant}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <div class="form-group">
        <label for="width-input">Size</label>
        <div class="size-inputs">
          <div class="size-input">
            <span>Width</span>
            <input 
              id="width-input"
              type="number" 
              bind:value={widgetSize.w}
              min={template?.minSize.w}
              max={template?.maxSize?.w}
            >
          </div>
          <div class="size-input">
            <span>Height</span>
            <input 
              type="number" 
              bind:value={widgetSize.h}
              min={template?.minSize.h}
              max={template?.maxSize?.h}
            >
          </div>
        </div>
      </div>

      <div class="button-group">
        <button class="cancel-button" on:click={handleCancel}>Cancel</button>
        <button 
          class="save-button" 
          on:click={handleSave}
          disabled={!selectedItem}
        >
          Add Widget
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .widget-setup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .widget-setup {
    background: #2c3e50;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    min-width: 300px;
  }

  .setup-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    color: white;
    font-size: 0.9rem;
  }

  select, input {
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .size-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .save-button {
    margin-top: 1rem;
    padding: 0.8rem;
    border-radius: 6px;
    border: none;
    background: #26c6da;
    color: white;
    cursor: pointer;
    font-weight: 500;
  }
</style> 