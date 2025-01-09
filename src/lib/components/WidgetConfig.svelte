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
    <h2>Widget Configuration</h2>
    <button class="close-button" on:click={() => dispatch('close')}>
      <i class="fas fa-times"></i>
    </button>
  </div>

  <div class="config-content">
    <div class="form-group">
      <label for="title">Title</label>
      <input 
        type="text" 
        id="title" 
        bind:value={config.title}
        on:change={updateWidget}
        placeholder="Enter widget title"
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
          <div class="icon-preview">
            <i class={config.icon}></i>
          </div>
        {/if}
      </div>
    </div>

    <div class="form-group">
      <label for="color">Color</label>
      <div class="color-input">
        <input 
          type="color" 
          id="color" 
          bind:value={config.color}
          on:change={updateWidget}
        />
        <span class="color-value">{config.color}</span>
      </div>
    </div>

    <div class="options-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          bind:checked={config.showIcon}
          on:change={updateWidget}
        />
        <span class="checkbox-text">Show Icon</span>
      </label>

      <label class="checkbox-label">
        <input 
          type="checkbox" 
          bind:checked={config.showState}
          on:change={updateWidget}
        />
        <span class="checkbox-text">Show State</span>
      </label>
    </div>
  </div>
</div>

<style>
  .widget-config {
    color: white;
    min-width: 400px;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 500;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.2rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .close-button:hover {
    opacity: 1;
  }

  .config-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 1.2rem;
    font-weight: 500;
  }

  input[type="text"] {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.8rem 1rem;
    color: white;
    font-size: 1rem;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .icon-input {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .icon-preview {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .color-input {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  input[type="color"] {
    width: 60px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: none;
    cursor: pointer;
  }

  .color-value {
    font-family: monospace;
    opacity: 0.8;
  }

  .options-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    appearance: none;
    cursor: pointer;
    position: relative;
  }

  input[type="checkbox"]:checked {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .checkbox-text {
    font-size: 1rem;
  }

  ::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
</style> 