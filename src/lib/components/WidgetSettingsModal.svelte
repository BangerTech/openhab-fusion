<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let show = false;
  export let widget: {
    id: string;
    type: string;
    settings: any;
  };
  
  const dispatch = createEventDispatcher();
  
  let localSettings = { ...widget.settings };
  
  function handleSave() {
    dispatch('save', {
      id: widget.id,
      settings: localSettings
    });
    show = false;
  }
  
  function handleClose() {
    show = false;
  }
  
  $: if (widget) {
    localSettings = { ...widget.settings };
  }
</script>

<div class="modal-backdrop" class:show on:click={handleClose}>
  <div class="modal" on:click|stopPropagation>
    <header>
      <h2>Widget Einstellungen</h2>
      <button class="close-btn" on:click={handleClose}>&times;</button>
    </header>
    
    <div class="content">
      {#if widget.type === 'clock'}
        <div class="setting-group">
          <label>
            <input type="checkbox" bind:checked={localSettings.showTime}>
            Zeit anzeigen
          </label>
          
          <label>
            <input type="checkbox" bind:checked={localSettings.showDate}>
            Datum anzeigen
          </label>
          
          <label>
            <input type="checkbox" bind:checked={localSettings.showSeconds}>
            Sekunden anzeigen
          </label>
          
          <label>
            Schriftgröße
            <input type="text" bind:value={localSettings.fontSize}>
          </label>
        </div>
      {:else if widget.type === 'weather'}
        <div class="setting-group">
          <label>
            <input type="checkbox" bind:checked={localSettings.showTemp}>
            Temperatur anzeigen
          </label>
          
          <label>
            <input type="checkbox" bind:checked={localSettings.showHumidity}>
            Luftfeuchtigkeit anzeigen
          </label>
        </div>
      {/if}
    </div>
    
    <footer>
      <button class="secondary" on:click={handleClose}>Abbrechen</button>
      <button class="primary" on:click={handleSave}>Speichern</button>
    </footer>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }
  
  .modal-backdrop.show {
    display: flex;
  }
  
  .modal {
    background: var(--surface);
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h2 {
    margin: 0;
  }
  
  .content {
    padding: 1rem;
    overflow-y: auto;
  }
  
  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .primary {
    background: var(--primary);
    color: var(--on-primary);
  }
  
  .secondary {
    background: var(--surface-variant);
    color: var(--on-surface-variant);
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
  }
</style> 