<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let currentTemp = parseFloat(widget.item?.state || '20');
  let targetTemp = parseFloat(widget.item?.setpoint || '21');

  $: displayTemp = currentTemp.toFixed(1);
  $: displayTarget = targetTemp.toFixed(1);
  $: isHeating = currentTemp < targetTemp;
  $: isCooling = currentTemp > targetTemp;

  function adjustTemp(delta: number) {
    if (isEditing || demo) return;
    targetTemp = Math.round((targetTemp + delta) * 2) / 2;
    service.sendCommand(widget.item.name, targetTemp.toString());
  }
</script>

<div class="simple-thermo" class:editing={isEditing}>
  <div class="temp-display" class:heating={isHeating} class:cooling={isCooling}>
    <span class="current-temp">{displayTemp}°</span>
    <div class="target-temp">
      <i class="fas fa-{isHeating ? 'arrow-up' : isCooling ? 'arrow-down' : 'equals'}"></i>
      {displayTarget}°
    </div>
  </div>

  <div class="controls">
    <button 
      class="control-button"
      on:click={() => adjustTemp(-0.5)}
      disabled={isEditing}
    >
      <i class="fas fa-minus"></i>
    </button>
    <span class="name">{widget.item?.name || 'Thermostat'}</span>
    <button 
      class="control-button"
      on:click={() => adjustTemp(0.5)}
      disabled={isEditing}
    >
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>

<style>
  .simple-thermo {
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .temp-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    transition: all 0.3s ease;
  }

  .temp-display.heating {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
  }

  .temp-display.cooling {
    background: rgba(77, 171, 247, 0.1);
    color: #4dabf7;
  }

  .current-temp {
    font-size: 2.5rem;
    font-weight: bold;
  }

  .target-temp {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .control-button {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    border: none;
    background: rgba(255,255,255,0.1);
    color: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }

  .control-button:hover {
    background: rgba(255,255,255,0.2);
  }

  .name {
    font-size: 1rem;
    opacity: 0.9;
    text-align: center;
    flex: 1;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }
</style> 