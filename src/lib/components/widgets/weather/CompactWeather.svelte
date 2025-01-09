<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let temperature = parseFloat(widget.item?.temperature || '20');
  let humidity = parseInt(widget.item?.humidity || '50');
  let condition = widget.item?.condition || 'clear';

  const weatherIcons = {
    clear: 'sun',
    'partly-cloudy': 'cloud-sun',
    cloudy: 'cloud',
    rain: 'cloud-rain',
    storm: 'cloud-bolt',
    snow: 'snowflake',
    fog: 'smog'
  };

  $: icon = weatherIcons[condition] || 'sun';
  $: displayTemp = temperature.toFixed(1);
</script>

<div class="compact-weather" class:editing={isEditing}>
  <div class="weather-content">
    <i class="fas fa-{icon} weather-icon"></i>
    <div class="info">
      <span class="temperature">{displayTemp}°</span>
      <div class="details">
        <span class="condition">{condition}</span>
        <span class="humidity">
          <i class="fas fa-droplet"></i>
          {humidity}%
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .compact-weather {
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
  }

  .weather-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .weather-icon {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .temperature {
    font-size: 1.8rem;
    font-weight: bold;
  }

  .details {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .condition {
    text-transform: capitalize;
  }

  .humidity {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }
</style> 