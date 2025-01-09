<script lang="ts">
  import { onMount, getContext } from 'svelte';
  
  export let settings = {
    showDate: true,
    showTime: true,
    showSeconds: true,
    fontSize: '1rem',
    format: 'de-DE'
  };
  
  export let isEditing = false;
  
  let time: string;
  let date: string;
  
  const { handleDragStart, handleDragEnd } = getContext('sidebarEditor');
  
  function updateTime() {
    const now = new Date();
    time = now.toLocaleTimeString(settings.format);
    date = now.toLocaleDateString(settings.format, {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
  
  onMount(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
  
  $: timeDisplay = settings.showSeconds ? time : time?.replace(/:\d\d\s/, ' ');
  
  function handleEditClick() {
    const event = new CustomEvent('editWidget', {
      detail: {
        id: 'clock-1',
        type: 'clock'
      },
      bubbles: true
    });
    
    dispatchEvent(event);
  }
  
  $: {
    console.log('### Clock - State Change ###');
    console.log('isEditing:', isEditing);
  }
</script>

<div 
  class="widget clock-widget" 
  data-widget-id="clock-1"
  data-widget-type="clock"
  style="font-size: {settings.fontSize}"
  draggable={isEditing}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
>
  {#if settings.showTime}
    <div class="time">{timeDisplay}</div>
  {/if}
  
  {#if settings.showDate}
    <div class="date">{date}</div>
  {/if}
  
  {#if isEditing}
    <button class="edit-button" on:click={handleEditClick}>
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>

<style>
  .clock-widget {
    padding: 1rem;
    background: var(--surface-container-low);
    border-radius: 8px;
    position: relative;
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
  
  .clock-widget:hover .edit-button {
    opacity: 1;
  }
</style> 