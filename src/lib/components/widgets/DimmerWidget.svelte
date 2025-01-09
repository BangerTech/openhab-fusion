<script lang="ts">
  export let widget;
  export let isEditing = false;
  export let demo = false;
  export let service = undefined;

  let value = parseInt(widget.item?.state || '0');
  let isDragging = false;

  async function updateValue(newValue: number) {
    if (demo) return;
    
    try {
      value = newValue;
      await service.updateItemState(widget.item.name, newValue.toString());
    } catch (error) {
      console.error('Failed to update dimmer value:', error);
    }
  }

  function handleInput(event) {
    const newValue = parseInt(event.target.value);
    updateValue(newValue);
  }
</script>

<div class="dimmer-widget" class:editing={isEditing}>
  <div class="widget-header">
    <i class="fas fa-lightbulb"></i>
    <span class="label">{widget.item?.label || 'Dimmer'}</span>
    <div class="brightness">{value}%</div>
  </div>

  <div class="slider-container">
    <div class="slider-track" style="--value: {value}%">
      <div class="slider-fill"></div>
    </div>
    <input 
      type="range"
      min="0"
      max="100"
      {value}
      on:input={handleInput}
      disabled={isEditing}
    />
  </div>

  <div class="controls">
    <button class="brightness-button min">
      <i class="fas fa-minus"></i>
    </button>
    <button class="brightness-button max">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>

<style>
  .dimmer-widget {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 73, 94, 0.95));
    border-radius: 16px;
    padding: 1.5rem;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .widget-header i {
    font-size: 1.5rem;
    color: #ffd700;
    opacity: 0.8;
  }

  .label {
    flex: 1;
    font-size: 1.2rem;
  }

  .brightness {
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .slider-container {
    position: relative;
    padding: 1rem 0;
  }

  .slider-track {
    position: relative;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--value);
    background: linear-gradient(to right, #0288d1, #26c6da);
    border-radius: 2px;
  }

  input[type="range"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .brightness-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .brightness-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 