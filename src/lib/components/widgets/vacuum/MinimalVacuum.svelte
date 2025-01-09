<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let status = widget.item?.state || 'docked';
  let battery = parseInt(widget.item?.battery || '100');

  function toggleVacuum() {
    if (isEditing || demo) return;
    const command = status === 'cleaning' ? 'pause' : 'start';
    service.sendCommand(widget.item.name, command);
  }

  function dock() {
    if (isEditing || demo) return;
    service.sendCommand(widget.item.name, 'dock');
  }

  $: isActive = status === 'cleaning';
</script>

<div class="minimal-vacuum" class:editing={isEditing}>
  <div class="content">
    <div class="status-section">
      <i class="fas fa-robot main-icon" class:active={isActive}></i>
      <div class="info">
        <span class="name">{widget.item?.name || 'Vacuum'}</span>
        <span class="status">{status}</span>
      </div>
    </div>

    <div class="battery" style="--battery-level: {battery}%">
      <i class="fas fa-battery-{Math.ceil(battery/25)*25}"></i>
      {battery}%
    </div>
  </div>

  <div class="controls">
    <button 
      class="control-button"
      class:active={isActive}
      on:click={toggleVacuum}
      disabled={isEditing}
    >
      <i class="fas fa-{isActive ? 'pause' : 'play'}"></i>
    </button>
    <button 
      class="control-button"
      on:click={dock}
      disabled={isEditing}
    >
      <i class="fas fa-home"></i>
    </button>
  </div>
</div>

<style>
  .minimal-vacuum {
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .status-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .main-icon {
    font-size: 1.8rem;
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  .main-icon.active {
    color: var(--primary-color);
    opacity: 1;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .name {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .status {
    font-size: 0.9rem;
    opacity: 0.7;
    text-transform: capitalize;
  }

  .battery {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: hsl(120, calc(var(--battery-level) * 0.8%), 45%);
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  .control-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    color: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }

  .control-button:hover {
    background: rgba(255,255,255,0.1);
  }

  .control-button.active {
    background: var(--primary-color);
    color: white;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }
</style> 