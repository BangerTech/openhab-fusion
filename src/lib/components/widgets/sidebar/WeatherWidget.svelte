<script lang="ts">
  export let variant = 'current';
  export let data = {
    temperature: 21,
    humidity: 65,
    condition: 'sunny',
    forecast: [
      { day: 'Mon', temp: 22, condition: 'sunny' },
      { day: 'Tue', temp: 19, condition: 'cloudy' },
      { day: 'Wed', temp: 18, condition: 'rainy' }
    ]
  };

  const weatherIcons = {
    sunny: 'sun',
    cloudy: 'cloud',
    rainy: 'cloud-rain',
    snowy: 'snowflake'
  };
</script>

{#if variant === 'current'}
  <div class="current-weather">
    <div class="main-info">
      <i class="fas fa-{weatherIcons[data.condition]}"></i>
      <span class="temperature">{data.temperature}°C</span>
    </div>
    <div class="details">
      <span class="humidity">
        <i class="fas fa-tint"></i>
        {data.humidity}%
      </span>
    </div>
  </div>
{:else}
  <div class="forecast">
    {#each data.forecast as day}
      <div class="forecast-day">
        <span class="day">{day.day}</span>
        <i class="fas fa-{weatherIcons[day.condition]}"></i>
        <span class="temp">{day.temp}°</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .current-weather {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
  }

  .temperature {
    font-weight: 300;
  }

  .details {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .forecast {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
  }

  .forecast-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .day {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .temp {
    font-size: 0.9rem;
  }
</style> 