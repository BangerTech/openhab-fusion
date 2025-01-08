<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { WIDGET_TEMPLATES } from '../types/widgets';
  import SwitchWidget from './widgets/SwitchWidget.svelte';
  import DimmerWidget from './widgets/DimmerWidget.svelte';
  import SensorWidget from './widgets/SensorWidget.svelte';
  
  export let items: any[];
  export let selectedCategory = 'all';
  
  const dispatch = createEventDispatcher();

  const categories = [
    { id: 'all', name: 'All', icon: 'th' },
    { id: 'controls', name: 'Controls', icon: 'sliders-h' },
    { id: 'sensors', name: 'Sensors', icon: 'thermometer-half' },
    { id: 'media', name: 'Media', icon: 'play-circle' },
    { id: 'other', name: 'Other', icon: 'ellipsis-h' }
  ];

  const widgetsByCategory = {
    controls: ['switch', 'dimmer', 'cover'],
    sensors: ['number', 'temperature', 'humidity'],
    media: ['media-player', 'camera'],
    other: ['weather', 'chart', 'clock']
  };

  $: filteredWidgets = selectedCategory === 'all' 
    ? Object.values(WIDGET_TEMPLATES)
    : Object.values(WIDGET_TEMPLATES).filter(w => 
        widgetsByCategory[selectedCategory]?.includes(w.type)
      );

  // Beispiel-Items für die Vorschau
  const demoItems = {
    switch: {
      name: 'DemoSwitch',
      label: 'Light',
      type: 'Switch',
      state: 'ON'
    },
    dimmer: {
      name: 'DemoDimmer',
      label: 'Dimmer',
      type: 'Dimmer',
      state: '75'
    },
    number: {
      name: 'DemoNumber',
      label: 'Value',
      type: 'Number',
      state: '42'
    },
    temperature: {
      name: 'DemoTemp',
      label: 'Temperature',
      type: 'Number:Temperature',
      state: '21.5'
    },
    humidity: {
      name: 'DemoHumidity',
      label: 'Humidity',
      type: 'Number:Dimensionless',
      state: '65'
    },
    chart: {
      name: 'DemoChart',
      label: 'Chart',
      type: 'Number',
      state: '50'
    }
  };
</script>

<div class="widget-selector" transition:fade>
  <div class="selector-header">
    <h3>Select Widget Type</h3>
    <button class="close-button" on:click={() => dispatch('close')}>
      <i class="fas fa-times"></i>
    </button>
  </div>

  <div class="categories">
    {#each categories as category}
      <button 
        class:active={selectedCategory === category.id}
        on:click={() => selectedCategory = category.id}
      >
        <i class="fas fa-{category.icon}"></i>
        <span>{category.name}</span>
      </button>
    {/each}
  </div>

  <div class="widgets-grid">
    {#each filteredWidgets as widget}
      <button 
        class="widget-preview"
        on:click={() => dispatch('select', widget)}
      >
        <div class="preview-content">
          {#if widget.type === 'switch'}
            <SwitchWidget
              widget={{
                type: 'switch',
                variant: 'default',
                item: demoItems.switch,
                options: {}
              }}
              isEditing={false}
              demo={true}
            />
          {:else if widget.type === 'dimmer'}
            <DimmerWidget
              widget={{
                type: 'dimmer',
                variant: 'default',
                item: demoItems.dimmer,
                options: {}
              }}
              isEditing={false}
              demo={true}
            />
          {:else if widget.type === 'number'}
            <SensorWidget
              widget={{
                type: 'number',
                variant: 'default',
                options: {}
              }}
              item={demoItems.number}
              isEditing={false}
            />
          {:else if widget.type === 'temperature'}
            <SensorWidget
              widget={{
                type: 'temperature',
                variant: 'default',
                options: { unit: '°C' }
              }}
              item={demoItems.temperature}
              isEditing={false}
            />
          {:else if widget.type === 'humidity'}
            <SensorWidget
              widget={{
                type: 'humidity',
                variant: 'default',
                options: { unit: '%' }
              }}
              item={demoItems.humidity}
              isEditing={false}
            />
          {:else if widget.type === 'chart'}
            <div class="preview-chart">
              <svg viewBox="0 0 100 50">
                <path d="M0,25 L20,15 L40,35 L60,5 L80,45 L100,25" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          {:else if widget.type === 'camera'}
            <div class="preview-camera">
              <i class="fas fa-video"></i>
            </div>
          {:else if widget.type === 'weather'}
            <div class="preview-weather">
              <i class="fas fa-cloud-sun"></i>
              <span>21°C</span>
            </div>
          {/if}
        </div>
        <div class="widget-info">
          <span class="widget-name">{widget.type}</span>
          <span class="widget-desc">
            {#if widget.type === 'switch'}
              Toggle switch control
            {:else if widget.type === 'dimmer'}
              Dimmer control with slider
            {:else if widget.type === 'number'}
              Numeric value display
            {:else if widget.type === 'temperature'}
              Temperature sensor
            {:else if widget.type === 'humidity'}
              Humidity sensor
            {:else if widget.type === 'chart'}
              Data visualization
            {:else if widget.type === 'camera'}
              Camera stream
            {:else if widget.type === 'weather'}
              Weather information
            {/if}
          </span>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .widget-selector {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    max-height: 70vh;
    background: rgba(44, 62, 80, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .categories {
    display: flex;
    gap: 0.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .widgets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .widget-preview {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    color: white;
  }

  .widget-preview:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .preview-content {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .widget-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .widget-name {
    font-weight: 500;
  }

  .widget-desc {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .preview-switch,
  .preview-dimmer,
  .preview-sensor,
  .preview-chart,
  .preview-camera,
  .preview-weather {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
</style> 