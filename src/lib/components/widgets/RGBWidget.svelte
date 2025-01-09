<script lang="ts">
  export let widget;
  export let isEditing = false;
  export let demo = false;
  export let service = undefined;

  let brightness = parseInt(widget.item?.state || '0');
  let color = '#ff6b6b';
  let selectedMode = 'solid';

  const modes = [
    { id: 'solid', icon: 'circle', label: 'Solid' },
    { id: 'rainbow', icon: 'rainbow', label: 'Rainbow' },
    { id: 'pulse', icon: 'wave-square', label: 'Pulse' },
    { id: 'strobe', icon: 'bolt', label: 'Strobe' }
  ];

  async function updateBrightness(newValue: number) {
    if (demo) return;
    
    try {
      brightness = newValue;
      await service.updateItemState(widget.item.name, newValue.toString());
    } catch (error) {
      console.error('Failed to update brightness:', error);
    }
  }

  async function updateColor(newColor: string) {
    if (demo) return;
    
    try {
      color = newColor;
      await service.updateItemState(widget.item.name, newColor);
    } catch (error) {
      console.error('Failed to update color:', error);
    }
  }

  function handleInput(event) {
    const newValue = parseInt(event.target.value);
    updateBrightness(newValue);
  }
</script>

<div class="rgb-widget" class:editing={isEditing}>
  <div class="widget-header">
    <i class="fas fa-lightbulb" style="color: {color}"></i>
    <span class="label">{widget.item?.label || 'RGB Light'}</span>
    <div class="brightness">{brightness}%</div>
  </div>

  <div class="color-preview" style="background: {color}">
    <input 
      type="color" 
      bind:value={color} 
      on:change={() => updateColor(color)}
      disabled={isEditing}
    />
  </div>

  <div class="slider-container">
    <div class="slider-track" style="--value: {brightness}%; --color: {color}">
      <div class="slider-fill"></div>
    </div>
    <input 
      type="range"
      min="0"
      max="100"
      value={brightness}
      on:input={handleInput}
      disabled={isEditing}
    />
  </div>

  <div class="modes">
    {#each modes as mode}
      <button 
        class="mode-button" 
        class:active={selectedMode === mode.id}
        on:click={() => selectedMode = mode.id}
        disabled={isEditing}
      >
        <i class="fas fa-{mode.icon}"></i>
        <span class="mode-label">{mode.label}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .rgb-widget {
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
    opacity: 0.8;
    transition: color 0.3s;
  }

  .label {
    flex: 1;
    font-size: 1.2rem;
  }

  .brightness {
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .color-preview {
    position: relative;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
  }

  .color-preview input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
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
    background: var(--color);
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

  .modes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }

  .mode-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 0.8rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .mode-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .mode-button.active {
    background: linear-gradient(135deg, #0288d1, #26c6da);
  }

  .mode-label {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 