<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  $: state = widget.item?.state || 'OFF';
  $: isOn = state === 'ON';

  function toggle() {
    if (isEditing || demo) return;
    const newState = isOn ? 'OFF' : 'ON';
    service.sendCommand(widget.item.name, newState);
  }
</script>

<button 
  class="minimal-switch" 
  class:on={isOn}
  on:click={toggle}
  disabled={isEditing}
>
  <div class="switch-dot" />
  <span class="label">{widget.item?.name || 'Switch'}</span>
</button>

<style>
  .minimal-switch {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .minimal-switch:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .minimal-switch.on {
    background: var(--primary-color);
  }

  .switch-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  .on .switch-dot {
    opacity: 1;
    transform: scale(1.2);
  }

  .label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
</style> 