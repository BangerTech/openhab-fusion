<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let value = parseInt(widget.item?.state || '0');
  let isDragging = false;
  let startY: number;
  let startValue: number;

  $: percentage = Math.min(100, Math.max(0, value));
  $: degrees = (percentage / 100) * 360;

  function handleMouseDown(e: MouseEvent) {
    if (isEditing || demo) return;
    isDragging = true;
    startY = e.clientY;
    startValue = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const newValue = Math.min(100, Math.max(0, startValue + (deltaY / 2)));
    value = Math.round(newValue);
    if (!demo) {
      service.sendCommand(widget.item.name, value.toString());
    }
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="header">
    <div class="icon">
      <i class="fas fa-lightbulb"></i>
    </div>
    <div class="name">{widget.item?.name || 'Dimmer'}</div>
  </div>

  <div class="content">
    <div 
      class="dimmer-ring"
      on:mousedown={handleMouseDown}
      style="--percentage: {percentage}"
    >
      <div class="inner-circle">
        <span class="value">{percentage}%</span>
      </div>
      <div class="control-handle" style="transform: rotate({degrees}deg)"></div>
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
  }

  .content {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dimmer-ring {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      var(--primary-color) 0%,
      var(--primary-color) calc(var(--percentage) * 1%),
      rgba(255, 255, 255, 0.1) calc(var(--percentage) * 1%),
      rgba(255, 255, 255, 0.1) 100%
    );
    cursor: pointer;
  }

  .inner-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: var(--ha-card-background);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .control-handle {
    position: absolute;
    top: 0;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    background: var(--primary-color);
    border-radius: 50%;
    transform-origin: 50% 75px;
    transition: transform 0.1s ease;
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