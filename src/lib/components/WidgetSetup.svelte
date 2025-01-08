<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { WIDGET_TEMPLATES } from '../types/widgets';
  
  export let widget: any;
  export let items: any[];
  
  const dispatch = createEventDispatcher();
  const template = WIDGET_TEMPLATES[widget.type];

  function handleSubmit() {
    dispatch('save', { widget });
  }
</script>

<div class="widget-setup">
  <h3>Widget Einrichten</h3>
  
  <div class="setup-form">
    <div class="form-group">
      <label>Item</label>
      <select bind:value={widget.item}>
        <option value={null}>Bitte wählen...</option>
        {#each items as item}
          <option value={item}>{item.label || item.name}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label>Variante</label>
      <select bind:value={widget.variant}>
        {#each template.variants as variant}
          <option value={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label>Größe</label>
      <div class="size-inputs">
        <input 
          type="number" 
          bind:value={widget.w}
          min={template.minSize.w}
          max={template.maxSize?.w}
        >
        x
        <input 
          type="number" 
          bind:value={widget.h}
          min={template.minSize.h}
          max={template.maxSize?.h}
        >
      </div>
    </div>

    <button class="save-button" on:click={handleSubmit}>
      Widget Hinzufügen
    </button>
  </div>
</div>

<style>
  .widget-setup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #2c3e50;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
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