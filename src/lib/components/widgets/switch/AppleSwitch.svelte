<script lang="ts">
  export let widget;
  export let isEditing = false;
  export let demo = false;
  export let service = undefined;

  let state = widget.item?.state === 'ON';
  
  async function toggleState() {
    if (demo) return;
    
    state = !state;
    try {
      await service.updateItemState(widget.item.name, state ? 'ON' : 'OFF');
    } catch (error) {
      console.error('Failed to update switch state:', error);
      state = !state; // Revert on error
    }
  }
</script>

<div class="apple-switch" class:editing={isEditing}>
  <button 
    class="switch-button" 
    class:active={state}
    on:click={toggleState}
    type="button"
  >
    <div class="switch-track">
      <div class="switch-thumb" />
    </div>
    <span class="label">{widget.item?.label || 'Switch'}</span>
  </button>
</div>

<style>
  .apple-switch {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch-button {
    width: 100%;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }

  .switch-track {
    position: relative;
    width: min(100%, 60px);  /* Maximale Breite begrenzen */
    height: 0;
    padding-bottom: min(31px, 52%); /* Aspect ratio beibehalten */
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    transition: all 0.2s;
  }

  .switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(100% / 2 - 4px);
    height: calc(100% - 4px);
    aspect-ratio: 1;  /* Kreis beibehalten */
    background: white;
    border-radius: 50%;
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .active .switch-track {
    background: rgb(48, 209, 88);
  }

  .active .switch-thumb {
    left: calc(50% + 2px);
  }

  .label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .editing {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }
</style> 