<script lang="ts">
  import { getContext } from 'svelte';
  
  export let settings = {
    showTemp: true,
    showHumidity: true,
    fontSize: '1rem',
    unit: 'celsius'
  };
  
  export let isEditing = false;
  
  // Hier würden normalerweise die Wetterdaten von einer API kommen
  let weatherData = {
    temp: 2,
    humidity: 81
  };
  
  const { handleDragStart, handleDragEnd } = getContext('sidebarEditor');
  
  function handleEditClick() {
    const event = new CustomEvent('editWidget', {
      detail: {
        id: 'weather-1',
        type: 'weather'
      },
      bubbles: true
    });
    
    dispatchEvent(event);
  }
</script>

<div 
  class="widget weather-widget" 
  data-widget-id="weather-1"
  data-widget-type="weather"
  style="font-size: {settings.fontSize}"
  draggable={isEditing}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
>
  {#if settings.showTemp}
    <div class="temperature">
      {weatherData.temp}°{settings.unit === 'celsius' ? 'C' : 'F'}
    </div>
  {/if}
  
  {#if settings.showHumidity}
    <div class="humidity">
      {weatherData.humidity}%
    </div>
  {/if}
  
  {#if isEditing}
    <button class="edit-button" on:click={handleEditClick}>
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>

<style>
  .weather-widget {
    padding: 1rem;
    background: var(--surface-container-low);
    border-radius: 8px;
    position: relative;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .temperature {
    font-size: 1.5em;
    font-weight: 500;
  }
  
  .humidity {
    opacity: 0.8;
  }
  
  .edit-button {
    position: absolute;
    right: 8px;
    top: 8px;
    background: var(--surface);
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .weather-widget:hover .edit-button {
    opacity: 1;
  }
</style> 