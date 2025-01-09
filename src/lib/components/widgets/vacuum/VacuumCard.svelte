<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  $: title = widget.options?.title || widget.item?.label || 'Vacuum';
  $: showIcon = widget.options?.showIcon ?? true;
  $: showState = widget.options?.showState ?? true;
  $: iconColor = widget.options?.color || '#ffffff';

  let status = widget.item?.state || 'docked';
  let battery = parseInt(widget.item?.battery || '100');
  let area = widget.item?.area || '0';

  const actions = [
    { icon: 'play', label: 'Start', command: 'start' },
    { icon: 'pause', label: 'Pause', command: 'pause' },
    { icon: 'home', label: 'Dock', command: 'dock' },
    { icon: 'map-marker', label: 'Spot', command: 'spot' }
  ];

  function sendCommand(command: string) {
    if (isEditing || demo) return;
    service.sendCommand(widget.item.name, command);
  }
</script>

<div class="vacuum-card" class:editing={isEditing}>
  <div class="header">
    {#if showIcon}
      <div class="icon" style="color: {iconColor}">
        <i class="fas fa-robot"></i>
      </div>
    {/if}
    <div class="name">{title}</div>
    {#if showState}
      <div class="state">{status}</div>
    {/if}
    <div class="battery" style="--battery-level: {battery}%">
      <i class="fas fa-battery-{Math.ceil(battery/25)*25}"></i>
      {battery}%
    </div>
  </div>

  <div class="status">
    <i class="fas fa-robot status-icon"></i>
    <div class="info">
      <span class="status-text">{status}</span>
      {#if area !== '0'}
        <span class="area">{area}m² cleaned</span>
      {/if}
    </div>
  </div>

  <div class="controls">
    {#each actions as action}
      <button 
        class="action-button"
        on:click={() => sendCommand(action.command)}
        disabled={isEditing}
      >
        <i class="fas fa-{action.icon}"></i>
        <span>{action.label}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .vacuum-card {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    background: var(--surface-color);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .name {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .battery {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(120, calc(var(--battery-level) * 0.8%), 45%);
  }

  .status {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
  }

  .status-icon {
    font-size: 2rem;
    opacity: 0.8;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .status-text {
    font-size: 1.1rem;
    text-transform: capitalize;
  }

  .area {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    color: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-button:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }

  .action-button i {
    font-size: 1.2rem;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }
</style> 