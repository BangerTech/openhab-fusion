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
      state = !state;
    }
  }
</script>

<div class="ha-fusion-switch" class:editing={isEditing}>
  <button 
    class="switch-button" 
    class:active={state}
    on:click={toggleState}
    type="button"
  >
    <i class="fas fa-lightbulb"></i>
    <span class="label">{widget.item?.label || 'Switch'}</span>
    <div class="state-indicator" class:on={state}></div>
  </button>
</div>

<style>
  .ha-fusion-switch {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
  }

  .switch-button {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 12px;
    padding: 1rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.2s;
  }

  .switch-button:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  .switch-button.active {
    background: rgba(38, 198, 218, 0.2);
  }

  i {
    font-size: 1.5rem;
    opacity: 0.7;
  }

  .active i {
    color: #26c6da;
    opacity: 1;
  }

  .label {
    flex: 1;
    text-align: left;
    font-size: 1rem;
  }

  .state-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.2s;
  }

  .state-indicator.on {
    background: #4CAF50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 