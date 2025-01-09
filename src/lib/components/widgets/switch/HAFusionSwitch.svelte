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
    class="switch-card" 
    class:active={state}
    on:click={toggleState}
    type="button"
  >
    <div class="icon-container">
      <i class="fas fa-lightbulb"></i>
    </div>
    <span class="label">{widget.item?.label || 'Switch'}</span>
  </button>
</div>

<style>
  .ha-fusion-switch {
    width: 100%;
    height: 100%;
    min-height: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch-card {
    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 73, 94, 0.95));
    border: none;
    border-radius: min(16px, 15%);
    color: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: min(1rem, 10%);
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: min(1.5rem, 10%);
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
    width: min(60px, 45%);
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
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    opacity: 0.8;
    transition: all 0.3s;
  }

  .active i {
    opacity: 1;
    transform: scale(1.1);
  }

  .label {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    padding: 0 0.5rem;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 