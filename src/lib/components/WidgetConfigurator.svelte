<script lang="ts">
  import { WIDGET_TEMPLATES } from '../types/widgets';
  
  export let widget: any;
  
  const template = WIDGET_TEMPLATES[widget.type];
</script>

<div class="widget-config">
  <h3>Widget Konfiguration</h3>
  
  {#if template?.variants.length > 1}
    <div class="config-section">
      <label>Variante</label>
      <select bind:value={widget.variant}>
        {#each template.variants as variant}
          <option value={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </option>
        {/each}
      </select>
    </div>
  {/if}
  
  <div class="config-section">
    <label>Größe</label>
    <div class="size-inputs">
      <input 
        type="number" 
        bind:value={widget.w}
        min={template?.minSize.w}
        max={template?.maxSize?.w}
      >
      x
      <input 
        type="number" 
        bind:value={widget.h}
        min={template?.minSize.h}
        max={template?.maxSize?.h}
      >
    </div>
  </div>
</div>

<style>
  .widget-config {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }

  .config-section {
    margin: 1rem 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: white;
  }

  select, input {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    padding: 0.5rem;
    border-radius: 6px;
    color: white;
    width: 100%;
  }

  .size-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style> 