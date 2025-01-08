<script lang="ts">
  import type { DashboardItem } from '../types/dashboard';
  import type { WidgetConfig } from '../types/widgets';
  import { createEventDispatcher } from 'svelte';

  export let widget: DashboardItem;
  
  const dispatch = createEventDispatcher();
  let config: WidgetConfig = widget.options || {};

  function updateConfig() {
    widget.options = config;
    dispatch('update', widget);
  }
</script>

<div class="widget-config">
  <h3>Widget Konfiguration</h3>
  
  <div class="form-group">
    <label for="title">Titel</label>
    <input 
      type="text" 
      id="title" 
      bind:value={config.title} 
      on:change={updateConfig}
    />
  </div>

  <div class="form-group">
    <label for="icon">Icon</label>
    <div class="icon-selector">
      <input 
        type="text" 
        id="icon" 
        bind:value={config.icon} 
        placeholder="fas fa-lightbulb"
        on:change={updateConfig}
      />
      {#if config.icon}
        <i class={config.icon}></i>
      {/if}
    </div>
  </div>

  <div class="form-group">
    <label>
      <input 
        type="checkbox" 
        bind:checked={config.showLabel} 
        on:change={updateConfig}
      />
      Label anzeigen
    </label>
  </div>

  <div class="form-group">
    <label>
      <input 
        type="checkbox" 
        bind:checked={config.showState} 
        on:change={updateConfig}
      />
      Status anzeigen
    </label>
  </div>

  {#if widget.type === 'number'}
    <div class="form-group">
      <label for="decimals">Dezimalstellen</label>
      <input 
        type="number" 
        id="decimals" 
        bind:value={config.decimals} 
        min="0" 
        max="5"
        on:change={updateConfig}
      />
    </div>

    <div class="form-group">
      <label for="unit">Einheit</label>
      <input 
        type="text" 
        id="unit" 
        bind:value={config.unit} 
        on:change={updateConfig}
      />
    </div>
  {/if}

  {#if widget.type === 'chart'}
    <div class="form-group">
      <label for="chartPeriod">Zeitraum</label>
      <select 
        id="chartPeriod" 
        bind:value={config.chartPeriod}
        on:change={updateConfig}
      >
        <option value="1h">1 Stunde</option>
        <option value="6h">6 Stunden</option>
        <option value="12h">12 Stunden</option>
        <option value="24h">24 Stunden</option>
        <option value="1w">1 Woche</option>
      </select>
    </div>

    <div class="form-group">
      <label for="chartType">Diagramm-Typ</label>
      <select 
        id="chartType" 
        bind:value={config.chartType}
        on:change={updateConfig}
      >
        <option value="line">Linie</option>
        <option value="bar">Balken</option>
      </select>
    </div>
  {/if}
</div>

<style>
  .widget-config {
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }

  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .icon-selector {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .icon-selector i {
    font-size: 1.2rem;
    color: #666;
  }
</style> 