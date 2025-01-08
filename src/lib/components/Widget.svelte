<script lang="ts">
  import type { DashboardItem } from '../types/dashboard';
  import type { OpenHABService } from '../services/openhab';
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';

  export let widget: DashboardItem;
  export let item: any;
  export let openhabService: OpenHABService;
  export let isEditing = false;

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;
  let historicalData = [];

  onMount(async () => {
    if (widget.type === 'chart') {
      await loadHistoricalData();
      initChart();
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  async function loadHistoricalData() {
    const period = widget.options?.chartPeriod || '24h';
    historicalData = await openhabService.getItemHistory(item.name, period);
  }

  function initChart() {
    if (!chartCanvas) return;

    chart = new Chart(chartCanvas, {
      type: widget.options?.chartType || 'line',
      data: {
        labels: historicalData.map(d => new Date(d.time).toLocaleTimeString()),
        datasets: [{
          label: item.label,
          data: historicalData.map(d => d.state),
          borderColor: '#0066cc',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async function updateState(newState: string) {
    try {
      await openhabService.updateItemState(item.name, newState);
    } catch (error) {
      console.error('Failed to update state:', error);
    }
  }

  $: formattedState = widget.type === 'number' && widget.options?.decimals
    ? Number(item.state).toFixed(widget.options.decimals)
    : item.state;
</script>

<div class="widget" class:editing={isEditing}>
  {#if widget.options?.title || widget.options?.icon}
    <div class="widget-header">
      {#if widget.options?.icon}
        <i class={widget.options.icon}></i>
      {/if}
      {#if widget.options?.title}
        <span class="title">{widget.options.title}</span>
      {/if}
    </div>
  {/if}

  <div class="widget-content">
    {#if widget.type === 'switch'}
      <button
        class="switch"
        class:active={item.state === 'ON'}
        on:click={() => updateState(item.state === 'ON' ? 'OFF' : 'ON')}
      >
        <span class="switch-slider"></span>
      </button>
    {:else if widget.type === 'dimmer'}
      <input
        type="range"
        min="0"
        max="100"
        bind:value={item.state}
        on:change={(e) => updateState(e.target.value)}
      />
    {:else if widget.type === 'chart'}
      <canvas bind:this={chartCanvas}></canvas>
    {:else}
      <div class="state">
        {formattedState}
        {#if widget.options?.unit}
          <span class="unit">{widget.options.unit}</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .widget {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .widget.editing {
    border: 2px dashed #0066cc;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .title {
    font-weight: 500;
    color: #333;
  }

  .widget-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch {
    position: relative;
    width: 60px;
    height: 34px;
    background: #ccc;
    border-radius: 34px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .switch.active {
    background: #2196F3;
  }

  .switch-slider {
    position: absolute;
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  .switch.active .switch-slider {
    transform: translateX(26px);
  }

  input[type="range"] {
    width: 100%;
  }

  .state {
    font-size: 1.2rem;
    color: #333;
  }

  .unit {
    font-size: 0.8em;
    color: #666;
    margin-left: 0.25rem;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style> 