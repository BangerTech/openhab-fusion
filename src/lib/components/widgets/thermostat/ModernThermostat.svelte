<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let currentTemp = parseFloat(widget.item?.state || '20');
  let targetTemp = parseFloat(widget.item?.setpoint || '21');
  let mode = widget.item?.mode || 'heat';
  let isDragging = false;
  let startY: number;
  let startTemp: number;

  const modes = ['off', 'heat', 'cool', 'auto'];
  const modeIcons = {
    off: 'power-off',
    heat: 'fire',
    cool: 'snowflake',
    auto: 'sync'
  };

  const modeColors = {
    off: 'var(--disabled-color, #666)',
    heat: 'var(--error-color, #ff6b6b)',
    cool: 'var(--info-color, #4dabf7)',
    auto: 'var(--success-color, #69db7c)'
  };

  $: displayTemp = currentTemp.toFixed(1);
  $: displayTarget = targetTemp.toFixed(1);

  function handleMouseDown(e: MouseEvent) {
    if (isEditing || demo || mode === 'off') return;
    isDragging = true;
    startY = e.clientY;
    startTemp = targetTemp;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const newTemp = Math.round((startTemp + deltaY * 0.1) * 2) / 2;
    targetTemp = Math.min(30, Math.max(5, newTemp));
    if (!demo) {
      service.sendCommand(widget.item.name, targetTemp.toString());
    }
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function toggleMode() {
    if (isEditing || demo) return;
    const currentIndex = modes.indexOf(mode);
    mode = modes[(currentIndex + 1) % modes.length];
    service.sendCommand(`${widget.item.name}_mode`, mode);
  }

  $: title = widget.options?.title || widget.item?.label || 'Thermostat';
  $: showIcon = widget.options?.showIcon ?? true;
  $: showState = widget.options?.showState ?? true;
  $: iconColor = widget.options?.color || '#ffffff';
</script>

<div class="ha-card" class:editing={isEditing} style="--mode-color: {modeColors[mode]}">
  <div class="header">
    {#if showIcon}
    <div class="icon" style="color: {iconColor}">
      <i class="fas fa-thermometer-half"></i>
    </div>
    {/if}
    <div class="name">{title}</div>
    <button class="mode-button" on:click={toggleMode}>
      <i class="fas fa-{modeIcons[mode]}"></i>
    </button>
  </div>

  <div class="content" on:mousedown={handleMouseDown}>
    <div class="temperature-ring">
      <div class="current-temp">
        <span class="temp">{displayTemp}°</span>
        <span class="label">Current</span>
      </div>
      <div class="target-temp" style="opacity: {mode === 'off' ? 0.5 : 1}">
        <i class="fas fa-chevron-up"></i>
        <span>{displayTarget}°</span>
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
    background: var(--mode-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    transition: background-color 0.3s ease;
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

  .mode-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: none;
    background: var(--mode-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .mode-button:hover {
    transform: scale(1.1);
  }

  .content {
    padding: 2rem;
    cursor: ns-resize;
  }

  .temperature-ring {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border: 8px solid var(--mode-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s ease;
  }

  .current-temp {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .temp {
    font-size: 3rem;
    font-weight: 300;
  }

  .label {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .target-temp {
    position: absolute;
    top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--mode-color);
    transition: color 0.3s ease;
  }

  .target-temp i {
    font-size: 1.2rem;
  }

  .target-temp span {
    font-size: 1.5rem;
    font-weight: 500;
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