<script lang="ts">
  export let widget: any;
  export let item: any;
  export let isEditing = false;

  $: value = item?.state || '0';
  $: unit = widget?.options?.unit || '';

  function getIcon(type: string): string {
    const typeMap = {
      'Number:Temperature': 'thermometer-half',
      'Number:Humidity': 'tint',
      'Number:Pressure': 'tachometer-alt',
      'Number:Power': 'bolt',
      'Number': 'hashtag'
    };
    return typeMap[type] || 'chart-line';
  }
</script>

<div class="sensor-widget" class:editing={isEditing}>
  <div class="widget-content">
    <div class="widget-icon">
      <i class="fas fa-{getIcon(item?.type)}"></i>
    </div>
    <div class="widget-info">
      <span class="widget-label">{item?.label || 'Sensor'}</span>
      <div class="value-container">
        <span class="value">{value}</span>
        {#if unit}
          <span class="unit">{unit}</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .sensor-widget {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border-radius: 1.2rem;
    background: rgba(38, 198, 218, 0.15);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .widget-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .widget-info {
    text-align: center;
  }

  .widget-label {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
    display: block;
    margin-bottom: 0.5rem;
  }

  .value-container {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.5rem;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 300;
  }

  .unit {
    font-size: 1rem;
    opacity: 0.8;
  }

  .sensor-widget.editing {
    border: 2px dashed rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }

  .widget-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
</style> 