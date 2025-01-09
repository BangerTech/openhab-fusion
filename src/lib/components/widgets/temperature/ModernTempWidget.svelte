<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let temperature = parseFloat(widget.item?.state || '20');
  let trend = widget.item?.trend || 'stable';
  let history = widget.item?.history || [];

  $: displayTemp = temperature.toFixed(1);
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="header">
    <div class="icon">
      <i class="fas fa-thermometer-half"></i>
    </div>
    <div class="name">{widget.item?.name || 'Temperature'}</div>
  </div>
  
  <div class="content">
    <div class="temperature">
      <span class="value">{displayTemp}</span>
      <span class="unit">°C</span>
    </div>
    
    {#if history.length > 0}
      <div class="graph">
        <!-- Mini-Graph hier -->
      </div>
    {/if}
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
    color: var(--primary-text-color);
  }

  .content {
    padding: 1rem;
  }

  .temperature {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 400;
    color: var(--primary-text-color);
  }

  .unit {
    font-size: 1.5rem;
    opacity: 0.8;
    color: var(--secondary-text-color);
  }

  .graph {
    margin-top: 1rem;
    height: 40px;
    background: rgba(var(--rgb-primary-color), 0.1);
    border-radius: 4px;
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