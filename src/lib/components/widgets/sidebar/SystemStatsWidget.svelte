<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  export let widget: any;
  export let service: any;
  export let type: 'cpu' | 'ram' = 'cpu';
  
  let value = 0;
  let interval: NodeJS.Timer;
  
  async function updateStats() {
    if (!widget.item?.name) return;
    
    try {
      const response = await service.getItemState(widget.item.name);
      // OpenHAB gibt den Wert als String zurück, also parsen wir ihn
      value = parseFloat(response);
    } catch (error) {
      console.error(`Failed to fetch ${type} stats:`, error);
    }
  }
  
  onMount(() => {
    updateStats();
    // Alle 5 Sekunden aktualisieren
    interval = setInterval(updateStats, 5000);
  });
  
  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="system-stats">
  <div class="stats-header">
    <i class="fas fa-{type === 'cpu' ? 'microchip' : 'memory'}"></i>
    <span>{type.toUpperCase()}</span>
  </div>
  
  <div class="stats-value">
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width: {value}%"
        class:high={value > 80}
        class:medium={value > 60 && value <= 80}
      ></div>
    </div>
    <span class="value-text">{value.toFixed(1)}%</span>
  </div>
</div>

<style>
  .system-stats {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
  }

  .stats-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;
  }

  .stats-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #26c6da;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .progress-fill.medium {
    background: #ffd700;
  }

  .progress-fill.high {
    background: #ff4444;
  }

  .value-text {
    min-width: 3.5rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style> 