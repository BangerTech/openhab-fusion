<script lang="ts">
  export let widget;
  export let isEditing = false;
  export let demo = false;
  export let service = undefined;
  export let key = undefined;

  let state = widget.item?.state === 'ON';
  
  $: options = widget.options || {};
  $: iconColor = options.color || '#ffffff';
  $: showIcon = options.showIcon ?? true;
  $: title = options.title || widget.item?.label || 'Switch';
  
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

<div class="modern-switch" class:editing={isEditing}>
  <button 
    class="switch-card" 
    class:active={state}
    on:click={toggleState}
    type="button"
  >
    {#if showIcon}
      <div class="icon-container" style="color: {iconColor}">
        <i class="fas fa-lightbulb"></i>
      </div>
    {/if}
    <span class="label">{title}</span>
  </button>
</div>

<style>
  .modern-switch {
    width: 100%;
    height: 100%;
  }

  .switch-card {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 73, 94, 0.95));
    border: none;
    border-radius: 16px;
    color: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .switch-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(38, 198, 218, 0.15);
  }

  .switch-card.active {
    background: linear-gradient(135deg, #0288d1, #26c6da);
    box-shadow: 0 6px 12px rgba(38, 198, 218, 0.3);
  }

  .icon-container {
    width: 45%;
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .active .icon-container {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  i {
    font-size: 1.8rem;
    opacity: 0.8;
    transition: all 0.3s;
  }

  .active i {
    opacity: 1;
    transform: scale(1.1);
  }

  .label {
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    padding: 0 0.5rem;
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 