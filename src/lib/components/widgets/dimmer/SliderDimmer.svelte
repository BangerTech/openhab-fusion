<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let value = parseInt(widget.item?.state || '0');
  
  $: if (!demo && widget.item?.state) {
    value = parseInt(widget.item.state);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = parseInt(target.value);
    if (!demo && !isEditing) {
      service.sendCommand(widget.item.name, value.toString());
    }
  }
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="header">
    <div class="icon">
      <i class="fas fa-lightbulb"></i>
    </div>
    <div class="name">{widget.item?.name || 'Dimmer'}</div>
    <div class="value">{value}%</div>
  </div>

  <div class="content">
    <div class="slider-container">
      <input 
        type="range" 
        min="0" 
        max="100" 
        {value}
        on:input={handleInput}
        disabled={isEditing}
      />
      <div class="slider-track">
        <div class="slider-fill" style="width: {value}%"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .ha-card {
    width: 100%;
    height: 100%;
    background: var(--ha-card-background, var(--card-background-color, rgb(32, 33, 36)));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2)
    );
    color: var(--primary-text-color);
    transition: all 0.3s ease-in-out;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
  }

  .icon i {
    color: white;
    font-size: 1.2rem;
  }

  .name {
    font-size: 1.1rem;
    font-weight: 500;
    flex: 1;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--primary-color);
  }

  .content {
    padding: 1.5rem;
  }

  .slider-container {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
  }

  input[type="range"] {
    position: absolute;
    width: 100%;
    -webkit-appearance: none;
    background: transparent;
    z-index: 2;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    background: transparent;
  }

  .slider-track {
    position: absolute;
    left: 0;
    right: 0;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .slider-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--primary-color);
    transition: width 0.1s ease;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }

  .ha-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow-hover,
      0 3px 3px 0 rgba(0, 0, 0, 0.14),
      0 1px 7px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -1px rgba(0, 0, 0, 0.2)
    );
  }
</style> 