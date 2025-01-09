<script lang="ts">
  import { onMount } from 'svelte';
  
  export let widget;
  export let isEditing = false;
  export let demo = false;
  export let service = undefined;

  let currentTemp = parseFloat(widget.item?.state || '20');
  let targetTemp = 22;
  let lastUpdate = '24° in 20 min';
  
  // Kreisförmiger Slider Variablen
  let isDragging = false;
  let center = { x: 100, y: 100 };
  let radius = 80;
  let startAngle = -135; // Start bei -135 Grad
  let endAngle = 135;   // Ende bei 135 Grad
  let minTemp = 5;
  let maxTemp = 30;

  function calculateTemperature(angle) {
    // Konvertiere den Winkel in Temperatur
    const normalizedAngle = (angle - startAngle) / (endAngle - startAngle);
    return minTemp + normalizedAngle * (maxTemp - minTemp);
  }

  function calculateAngle(temp) {
    // Konvertiere Temperatur in Winkel
    const normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
    return startAngle + normalizedTemp * (endAngle - startAngle);
  }

  function handleMouseMove(event) {
    if (!isDragging || isEditing) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - center.x;
    const y = event.clientY - rect.top - center.y;
    
    let angle = Math.atan2(y, x) * 180 / Math.PI;
    
    // Beschränke den Winkel auf den erlaubten Bereich
    angle = Math.max(startAngle, Math.min(endAngle, angle));
    
    targetTemp = Math.round(calculateTemperature(angle) * 2) / 2;
    updateTemperature(targetTemp);
  }

  async function updateTemperature(temp: number) {
    if (demo) return;
    
    try {
      await service.updateItemState(widget.item.name, temp.toString());
    } catch (error) {
      console.error('Failed to update temperature:', error);
    }
  }

  $: angle = calculateAngle(targetTemp);
  $: arcPath = describeArc(center.x, center.y, radius, startAngle, angle);
  $: remainingArcPath = describeArc(center.x, center.y, radius, angle, endAngle);

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
</script>

<div class="thermostat-widget" class:editing={isEditing}>
  <div class="widget-header">
    <span class="label">{widget.item?.label || 'Thermostat'}</span>
    <div class="last-update">{lastUpdate}</div>
  </div>

  <div class="temperature-control"
    on:mousedown={() => isDragging = true}
    on:mousemove={handleMouseMove}
    on:mouseup={() => isDragging = false}
    on:mouseleave={() => isDragging = false}
  >
    <svg width="200" height="200" viewBox="0 0 200 200">
      <!-- Hintergrund-Bogen -->
      <path
        d={describeArc(center.x, center.y, radius, startAngle, endAngle)}
        class="temp-track"
      />
      <!-- Aktiver Bogen -->
      <path
        d={arcPath}
        class="temp-progress"
      />
      <!-- Verbleibender Bogen -->
      <path
        d={remainingArcPath}
        class="temp-remaining"
      />
      <!-- Temperaturanzeige -->
      <text x="100" y="90" class="current-temp">{currentTemp}°</text>
      <text x="100" y="120" class="target-temp">{targetTemp}°</text>
    </svg>
  </div>

  <div class="controls">
    <button class="temp-button" on:click={() => targetTemp = Math.max(minTemp, targetTemp - 0.5)}>
      <i class="fas fa-minus"></i>
    </button>
    <button class="temp-button" on:click={() => targetTemp = Math.min(maxTemp, targetTemp + 0.5)}>
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>

<style>
  .thermostat-widget {
    width: 100%;
    height: 100%;
    background: rgba(30, 30, 30, 0.9);
    border-radius: 16px;
    padding: 1.5rem;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    font-size: 1.2rem;
  }

  .last-update {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .temperature-control {
    position: relative;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }

  .temp-track {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 8;
  }

  .temp-progress {
    fill: none;
    stroke: linear-gradient(135deg, #0288d1, #26c6da);
    stroke-width: 8;
    stroke-linecap: round;
    transition: all 0.3s;
  }

  .temp-remaining {
    fill: none;
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 8;
    stroke-linecap: round;
  }

  text {
    fill: white;
    text-anchor: middle;
    font-family: sans-serif;
  }

  .current-temp {
    font-size: 2.5rem;
    font-weight: 300;
  }

  .target-temp {
    font-size: 1.2rem;
    opacity: 0.7;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 2rem;
  }

  .temp-button {
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

  .temp-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .editing {
    opacity: 0.7;
    pointer-events: none;
  }
</style> 