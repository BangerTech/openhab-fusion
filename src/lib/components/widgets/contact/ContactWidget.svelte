<script lang="ts">
  export let widget: any;
  export let isEditing = false;
  export let demo = false;

  let state = widget.item?.state || 'CLOSED';
  let lastChange = widget.item?.lastChange || 'Unknown';

  $: isOpen = state === 'OPEN';
  $: icon = isOpen ? 'door-open' : 'door-closed';
  $: stateColor = isOpen ? 'var(--error-color)' : 'var(--success-color)';
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="header" role="banner">
    <div class="icon" style="background: {stateColor}">
      <i class="fas fa-{icon}" aria-hidden="true"></i>
    </div>
    <div class="name" role="heading" aria-level="2">{widget.item?.name || 'Contact'}</div>
  </div>

  <div class="content" role="main">
    <div class="state" style="color: {stateColor}">
      <span class="state-text" role="status" aria-live="polite">{state}</span>
      <span class="last-change">Last change: {lastChange}</span>
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
  }

  .content {
    padding: 1rem;
  }

  .state {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
  }

  .state-text {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .last-change {
    font-size: 0.9rem;
    opacity: 0.7;
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