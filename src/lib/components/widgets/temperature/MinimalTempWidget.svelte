<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let temperature = parseFloat(widget.item?.state || '20');
  let trend = widget.item?.trend || 'stable';

  $: displayTemp = temperature.toFixed(1);
  $: trendIcon = {
    up: 'arrow-up',
    down: 'arrow-down',
    stable: 'minus'
  }[trend];
  $: trendColor = {
    up: 'var(--error-color)',
    down: 'var(--info-color)',
    stable: 'var(--primary-text-color)'
  }[trend];
</script>

<div class="ha-card minimal" class:editing={isEditing}>
  <div class="content">
    <div class="icon">
      <i class="fas fa-thermometer-half"></i>
    </div>
    <div class="info">
      <div class="temperature">
        <span class="value">{displayTemp}°</span>
        <i class="fas fa-{trendIcon}" style="color: {trendColor}"></i>
      </div>
      <span class="name">{widget.item?.name || 'Temperature'}</span>
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
    padding: 1rem;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon i {
    color: white;
    font-size: 1.2rem;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .temperature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .name {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }

  /* HA-Fusion spezifische Hover-Effekte */
  .ha-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow-hover,
      0 3px 3px 0 rgba(0, 0, 0, 0.14),
      0 1px 7px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -1px rgba(0, 0, 0, 0.2)
    );
  }
</style> 