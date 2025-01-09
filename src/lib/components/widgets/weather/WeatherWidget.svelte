<script lang="ts">
  export let widget: any;
  export let service: any;
  export let isEditing = false;
  export let demo = false;

  let temperature = parseFloat(widget.item?.temperature || '20');
  let humidity = parseInt(widget.item?.humidity || '50');
  let condition = widget.item?.condition || 'clear';
  let forecast = widget.item?.forecast || [];

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

<div class="weather-widget" class:editing={isEditing}>
  <div class="current-weather">
    <div class="main-info">
      <i class="fas fa-{icon} weather-icon"></i>
      <div class="temperature">
        <span class="temp-value">{displayTemp}°</span>
        <span class="condition">{condition}</span>
      </div>
    </div>
    
    <div class="details">
      <div class="detail-item">
        <i class="fas fa-droplet"></i>
        <span>{humidity}%</span>
      </div>
    </div>
  </div>

  <div class="forecast">
    {#each forecast as day}
      <div class="forecast-day">
        <span class="day-name">{day.day}</span>
        <i class="fas fa-{weatherIcons[day.condition]} forecast-icon"></i>
        <span class="forecast-temp">{day.temp}°</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .weather-widget {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    background: var(--surface-color);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .current-weather {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .main-info {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .weather-icon {
    font-size: 4rem;
    color: var(--primary-color);
  }

  .temperature {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .temp-value {
    font-size: 3rem;
    font-weight: bold;
  }

  .condition {
    font-size: 1.2rem;
    opacity: 0.8;
    text-transform: capitalize;
  }

  .details {
    display: flex;
    gap: 2rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
  }

  .detail-item i {
    opacity: 0.7;
  }

  .forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .forecast-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .day-name {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .forecast-icon {
    font-size: 1.5rem;
    color: var(--primary-color);
  }

  .forecast-temp {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }
</style> 