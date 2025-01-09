<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardItem } from '../types/dashboard';

  export let widget: DashboardItem;
  
  const dispatch = createEventDispatcher();
  let config = {
    title: widget.options?.title || widget.item?.label || '',
    icon: widget.options?.icon || '',
    color: widget.options?.color || '#ffffff',
    showIcon: widget.options?.showIcon ?? true,
    showState: widget.options?.showState ?? true,
    ...widget.options
  };

  function updateWidget() {
    const updatedWidget = {
      ...widget,
      options: config
    };
    dispatch('update', updatedWidget);
  }
</script>

<div class="widget-config">
  <div class="config-header">
    <h3>Widget Configuration</h3>
    <button class="close-button" on:click={() => dispatch('close')}>
      <i class="fas fa-times"></i>
    </button>
  </div>

  <div class="form-group">
    <label for="title">Title</label>
    <input 
      type="text" 
      id="title" 
      bind:value={config.title}
      on:change={updateWidget}
    />
  </div>

  <div class="form-group">
    <label for="icon">Icon</label>
    <div class="icon-input">
      <input 
        type="text" 
        id="icon" 
        bind:value={config.icon}
        placeholder="fas fa-lightbulb"
        on:change={updateWidget}
      />
      {#if config.icon}
        <i class={config.icon}></i>
      {/if}
    </div>
  </div>

  <div class="form-group">
    <label for="color">Color</label>
    <input 
      type="color" 
      id="color" 
      bind:value={config.color}
      on:change={updateWidget}
    />
  </div>

  <div class="form-group">
    <label>
      <input 
        type="checkbox" 
        bind:checked={config.showIcon}
        on:change={updateWidget}
      />
      Show Icon
    </label>
  </div>

  <div class="form-group">
    <label>
      <input 
        type="checkbox" 
        bind:checked={config.showState}
        on:change={updateWidget}
      />
      Show State
    </label>
  </div>
</div>

<style>
  .widget-config {
    color: var(--text-color);
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    padding: 0.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"],
  input[type="color"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--input-background);
    color: var(--text-color);
  }

  .icon-input {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .icon-input i {
    font-size: 1.2rem;
  }
</style> 