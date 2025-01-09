<script lang="ts">
  import { onMount } from 'svelte';
  
  export let variant = 'digital';
  
  let time = new Date();
  let interval: number;
  
  onMount(() => {
    interval = setInterval(() => {
      time = new Date();
    }, 1000);
    
    return () => clearInterval(interval);
  });
  
  $: hours = time.getHours();
  $: minutes = time.getMinutes();
  $: seconds = time.getSeconds();
</script>

{#if variant === 'digital'}
  <div class="digital-time">
    <span class="hours">{hours.toString().padStart(2, '0')}</span>
    <span class="separator">:</span>
    <span class="minutes">{minutes.toString().padStart(2, '0')}</span>
    <span class="seconds">{seconds.toString().padStart(2, '0')}</span>
  </div>
{:else}
  <div class="analog-time">
    <div class="clock-face">
      <div class="hand hour" style="transform: rotate({(hours % 12) * 30 + minutes / 2}deg)"></div>
      <div class="hand minute" style="transform: rotate({minutes * 6}deg)"></div>
      <div class="hand second" style="transform: rotate({seconds * 6}deg)"></div>
    </div>
  </div>
{/if}

<style>
  .digital-time {
    font-size: 2.5rem;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    font-variant-numeric: tabular-nums;
  }
  
  .separator {
    opacity: 0.7;
  }
  
  .seconds {
    font-size: 1.5rem;
    opacity: 0.5;
  }
  
  .analog-time {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .clock-face {
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    position: relative;
  }
  
  .hand {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform-origin: bottom;
    background: white;
  }
  
  .hour {
    width: 2px;
    height: 25%;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .minute {
    width: 1px;
    height: 35%;
    background: rgba(255, 255, 255, 0.7);
  }
  
  .second {
    width: 1px;
    height: 40%;
    background: rgba(255, 255, 255, 0.5);
  }
</style> 