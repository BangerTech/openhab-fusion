<script lang="ts">
  import { onMount } from 'svelte';
  
  let time = new Date();
  let timer: number;
  
  onMount(() => {
    timer = window.setInterval(() => {
      time = new Date();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  $: hours = time.getHours().toString().padStart(2, '0');
  $: minutes = time.getMinutes().toString().padStart(2, '0');
  $: date = time.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
</script>

<div class="clock">
  <div class="time">{hours}:{minutes}</div>
  <div class="date">{date}</div>
</div>

<style>
  .clock {
    text-align: center;
  }

  .time {
    font-size: 3rem;
    font-weight: 300;
  }

  .date {
    font-size: 1rem;
    opacity: 0.8;
  }
</style> 