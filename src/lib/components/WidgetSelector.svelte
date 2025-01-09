<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { WIDGET_TEMPLATES, type WidgetTemplate, WIDGET_ITEM_TYPES } from '../types/widgets';
  import SwitchWidget from './widgets/SwitchWidget.svelte';
  import DimmerWidget from './widgets/DimmerWidget.svelte';
  import SensorWidget from './widgets/SensorWidget.svelte';
  import ModernSwitch from './widgets/switch/ModernSwitch.svelte';
  import AppleSwitch from './widgets/switch/AppleSwitch.svelte';
  import HAFusionSwitch from './widgets/switch/HAFusionSwitch.svelte';
  
  export let items: any[] = [];
  export let selectedCategory = 'all';
  
  const dispatch = createEventDispatcher();

  const categories = [
    { id: 'all', name: 'All', icon: 'th' },
    { id: 'controls', name: 'Controls', icon: 'sliders-h' },
    { id: 'sensors', name: 'Sensors', icon: 'thermometer-half' },
    { id: 'other', name: 'Other', icon: 'ellipsis-h' }
  ];

  const widgetsByCategory = {
    controls: ['switch', 'dimmer', 'rgb', 'thermostat'],
    sensors: ['number', 'temperature', 'humidity'],
    media: ['media-player', 'camera'],
    other: ['weather', 'chart', 'clock']
  };

  $: availableWidgets = Object.entries(WIDGET_TEMPLATES).map(([key, widget]) => ({
    ...widget,
    id: key
  }));

  $: filteredWidgets = selectedCategory === 'all' 
    ? availableWidgets
    : availableWidgets.filter(widget => widget.category === selectedCategory);

  // Demo-Items für bessere Vorschauen
  const demoItems = {
    switch: { 
      state: 'ON', 
      name: 'Demo Switch' 
    },
    dimmer: { 
      state: '50', 
      name: 'Demo Dimmer' 
    },
    rgb: { 
      state: '255,100,50', 
      name: 'Demo RGB' 
    },
    thermostat: { 
      state: '21.5',
      name: 'Demo Thermostat',
      setpoint: '22',
      mode: 'heat'
    },
    vacuum: {
      state: 'cleaning',
      name: 'Demo Vacuum',
      battery: '80',
      area: '45'
    },
    weather: {
      temperature: '22.5',
      humidity: '65',
      condition: 'partly-cloudy',
      name: 'Demo Weather',
      forecast: [
        { day: 'Mon', temp: '23', condition: 'clear' },
        { day: 'Tue', temp: '21', condition: 'cloudy' },
        { day: 'Wed', temp: '19', condition: 'rain' }
      ]
    },
    sensor: {
      state: '42',
      name: 'Demo Sensor'
    },
    temperature: {
      state: '23.5',
      name: 'Demo Temperature',
      trend: 'up'
    }
  };

  const demoService = {
    sendCommand: () => {},
    getHistory: () => Promise.resolve([])
  };

  function handleWidgetSelect(widget, variant) {
    dispatch('select', {
      type: widget.type,
      variant: variant || widget.variants[0],
      defaultSize: widget.defaultSize,
      minSize: widget.minSize,
      maxSize: widget.maxSize
    });
  }

  // Verbesserte Vorschau-Logik
  function getPreviewComponent(widget: any, variant: string) {
    if (widget.variants && widget.component[variant]) {
      return widget.component[variant];
    }
    return widget.component.default || widget.component;
  }

  function getDemoItem(widget: any) {
    return demoItems[widget.type] || { name: 'Demo Item', state: 'OFF' };
  }

  function filterItemsForWidget(widgetType: string, items: any[]) {
    const allowedTypes = WIDGET_ITEM_TYPES[widgetType] || [];
    return items.filter(item => {
      const baseType = item.type.split(':')[0];
      return allowedTypes.includes(baseType);
    });
  }
</script>

<div class="widget-selector-overlay" transition:fade>
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

    <div class="widgets-container">
      {#each filteredWidgets as widget}
        <div class="widget-card">
          <h4>{widget.label}</h4>
          <div class="widget-header">
            <i class="fas fa-{widget.icon}"></i>
          </div>
          {#if widget.variants}
            <div class="variants-grid">
              {#each widget.variants as variant}
                <button 
                  class="variant-preview"
                  on:click={() => handleWidgetSelect(widget, variant)}
                >
                  <div 
                    class="preview-content"
                    data-widget-type={widget.type}
                  >
                    <svelte:component 
                      this={getPreviewComponent(widget, variant)}
                      widget={{
                        type: widget.type,
                        variant,
                        item: getDemoItem(widget),
                        options: {}
                      }}
                      isEditing={false}
                      demo={true}
                      service={demoService}
                    />
                  </div>
                  <span class="variant-label">{variant}</span>
                </button>
              {/each}
            </div>
          {:else}
            <button 
              class="variant-preview"
              on:click={() => handleWidgetSelect(widget)}
            >
              <div class="preview-content">
                <!-- Hier können Sie eine Vorschau des Widgets ohne Varianten anzeigen -->
              </div>
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .widget-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .widget-selector {
    position: relative;
    width: 90%;
    max-width: 900px;
    max-height: 80vh;
    background: var(--surface-color);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .categories {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 0.5rem 0;
  }

  .categories button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .categories button.active {
    background: var(--primary-color);
  }

  .widgets-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    overflow-y: auto;
    max-height: calc(80vh - 120px);
    padding: 1rem;
  }

  .widget-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .preview-content {
    aspect-ratio: 1;
    min-height: 120px;
    padding: 0.5rem;
    background: var(--ha-card-background, var(--card-background-color, rgb(32, 33, 36)));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  /* Skalierung für verschiedene Widget-Typen */
  .preview-content :global(.ha-card) {
    transform-origin: center;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
  }

  /* Spezifische Skalierungen für verschiedene Widget-Typen */
  .preview-content[data-widget-type="thermostat"] :global(.ha-card),
  .preview-content[data-widget-type="vacuum"] :global(.ha-card),
  .preview-content[data-widget-type="weather"] :global(.ha-card) {
    transform: scale(0.7);
  }

  .preview-content[data-widget-type="rgb"] :global(.ha-card) {
    transform: scale(0.8);
  }

  .variant-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
  }

  .variant-label {
    display: block;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .widgets-container {
      grid-template-columns: 1fr;
    }

    .variants-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .categories button span {
      display: none;
    }
    
    .categories button {
      padding: 0.5rem;
    }
  }
</style> 