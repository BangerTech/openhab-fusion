<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { openhabService } from '../stores';
  import type { DashboardItem } from '../types/dashboard';
  import { WidgetType, WIDGET_TEMPLATES, WIDGET_TYPES } from '../types/widgets';
  import { onMount } from 'svelte';
  import WidgetSetup from './WidgetSetup.svelte';
  import WidgetConfig from './WidgetConfig.svelte';
  
  // Widget-Komponenten importieren
  import SwitchWidget from './widgets/SwitchWidget.svelte';
  import AppleSwitch from './widgets/switch/AppleSwitch.svelte';
  import HAFusionSwitch from './widgets/switch/HAFusionSwitch.svelte';
  import SensorWidget from './widgets/SensorWidget.svelte';
  import DimmerWidget from './widgets/DimmerWidget.svelte';

  declare global {
    interface Window {
      interact: any;
    }
  }

  let interact: any;

  onMount(() => {
    interact = window.interact;
    if (!gridElement) return;

    console.log('Initializing editor, isEditing:', isEditing);

    if (isEditing) {
      initializeWidgets();
    }
  });

  interface OpenHABItem {
    name: string;
    label?: string;
    type: string;
    state?: string;
    link?: string;
    metadata?: any;
    editable?: boolean;
  }

  export let items: OpenHABItem[] = [];
  export let dashboard: DashboardItem[] = [];
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  let editingWidget: DashboardItem | null = null;
  let gridElement: HTMLElement;
  let gridSize = 20;
  let currentNewWidget: DashboardItem | null = null;
  let editingWidgetConfig: DashboardItem | null = null;

  // Stellen Sie sicher, dass die Template-Suche typsicher ist
  function findTemplate(type: string): WidgetTemplate | undefined {
    return widgetTypes.find(w => w.type === type);
  }

  let widgetTemplates: NodeListOf<Element>;

  $: if (isEditing && gridElement) {
    console.log('Edit mode changed, reinitializing widgets');
    setTimeout(() => {
      initializeWidgets();
    }, 100);
  }

  function initializeWidgets() {
    if (!interact) return;

    interact('.widget-template').draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: gridSize, y: gridSize })
          ],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }]
        }),
        interact.modifiers.restrict({
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        })
      ],
      listeners: {
        start(event) {
          const type = event.target.getAttribute('data-type');
          const template = WIDGET_TEMPLATES[type];
          
          if (template) {
            currentNewWidget = {
              id: crypto.randomUUID(),
              type: template.type,
              variant: template.variants[0],
              x: 0,
              y: 0,
              w: template.defaultSize.w,
              h: template.defaultSize.h,
              item: null,
              options: {}
            };
          }
        },
        // ... rest of the listeners
      }
    });
  }

  function initializeWidget(element) {
    if (!isEditing || !interact) return;

    const interactable = interact(element)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.snap({
            targets: [
              interact.snappers.grid({ x: gridSize, y: gridSize })
            ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          }),
          interact.modifiers.restrict({
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          })
        ],
        listeners: {
          move: dragMoveListener,
          end: (event) => updateWidgetPosition(event.target)
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          interact.modifiers.snap({
            targets: [
              interact.snappers.grid({ x: gridSize, y: gridSize })
            ]
          })
        ],
        listeners: {
          move: resizeMoveListener,
          end: (event) => updateWidgetSize(event.target)
        }
      });

    return {
      destroy() {
        if (interactable) {
          interactable.unset();
        }
      }
    };
  }

  function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  function resizeMoveListener(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0);
    let y = (parseFloat(target.getAttribute('data-y')) || 0);

    target.style.width = `${event.rect.width}px`;
    target.style.height = `${event.rect.height}px`;

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  function updateWidgetPosition(target) {
    const index = parseInt(target.getAttribute('data-index'));
    if (isNaN(index) || !dashboard[index]) return;
    
    const x = parseFloat(target.getAttribute('data-x')) || 0;
    const y = parseFloat(target.getAttribute('data-y')) || 0;
    
    dashboard[index].x = Math.round(x / gridSize);
    dashboard[index].y = Math.round(y / gridSize);
    dispatch('update', { dashboard: [...dashboard] });
  }

  function updateWidgetSize(target) {
    const index = parseInt(target.getAttribute('data-index'));
    if (isNaN(index) || !dashboard[index]) return;
    
    const width = parseFloat(target.style.width);
    const height = parseFloat(target.style.height);
    
    dashboard[index].w = Math.max(1, Math.round(width / gridSize));
    dashboard[index].h = Math.max(1, Math.round(height / gridSize));
    dispatch('update', { dashboard: [...dashboard] });
  }

  function addWidget(type: string, x: number, y: number) {
    const template = WIDGET_TYPES.find(w => w.type === type);
    const newWidget: DashboardItem = {
      id: crypto.randomUUID(),
      type,
      x: Math.round(x / gridSize),
      y: Math.round(y / gridSize),
      w: template.defaultW || template.minW,
      h: template.defaultH || template.minH,
      item: null,
      options: {}
    };
    
    dashboard = [...dashboard, newWidget];
    editingWidget = newWidget;
    dispatch('update', { dashboard });
  }

  let showingItemSelector = false;
  let selectedWidgetType = '';

  function mapOpenHABTypeToWidgetType(openhabType: string): string {
    // OpenHAB-Typen in Kleinbuchstaben konvertieren und normalisieren
    const type = openhabType.toLowerCase();
    
    // Mapping der OpenHAB-Typen zu Widget-Typen
    const typeMapping: { [key: string]: string } = {
      'switch': 'switch',
      'dimmer': 'dimmer',
      'number': 'number',
      'number:temperature': 'number',
      'number:dimensionless': 'number',
      'number:energy': 'number',
      'number:power': 'number',
      'string': 'string'
    };

    return typeMapping[type] || type;
  }

  function showItemSelector(widgetType: WidgetType) {
    console.log('Showing item selector for widget type:', widgetType);
    selectedWidgetType = widgetType;
    showingItemSelector = true;
  }

  function selectItem(item) {
    if (!item) {
      console.error('No item selected');
      return;
    }
    if (!currentNewWidget) {
      console.error('No widget being created');
      return;
    }

    console.log('Selected item:', item);
    
    // Sicherstellen dass alle erforderlichen Eigenschaften vorhanden sind
    const itemData: DashboardItemData = {
      name: item.name,
      label: item.label || item.name,
      type: item.type,
      state: item.state || 'OFF'
    };
    
    const newWidget: DashboardItem = {
      ...currentNewWidget,
      item: itemData
    };

    console.log('Creating new widget:', newWidget);
    
    // Aktualisieren Sie das Dashboard in einem try-catch Block
    try {
      dashboard = [...dashboard, newWidget];
      showingItemSelector = false;
      currentNewWidget = null;
      dispatch('update', { dashboard });
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  }

  let showingWidgetSetup = false;

  function showWidgetSetup(type: string) {
    selectedWidgetType = type;
    showingWidgetSetup = true;
  }

  function handleWidgetSetup(event) {
    const { widget } = event.detail;
    dashboard = [...dashboard, widget];
    showingWidgetSetup = false;
    dispatch('update', { dashboard });
  }

  // Widget-Komponenten-Map
  const widgetComponents = {
    'switch': WIDGET_TEMPLATES.switch.component,
    'dimmer': WIDGET_TEMPLATES.dimmer.component,
    'rgb': WIDGET_TEMPLATES.rgb.component,
    'thermostat': WIDGET_TEMPLATES.thermostat.component,
    'vacuum': WIDGET_TEMPLATES.vacuum.component,
    'weather': WIDGET_TEMPLATES.weather.component,
    'sensor': WIDGET_TEMPLATES.sensor.component,
    'temperature': WIDGET_TEMPLATES.temperature.component
  };

  // Zugriff auf den OpenHAB-Service aus dem Store
  $: service = $openhabService;

  $: if (!isEditing) {
    // Alle interaktiven Elemente zurücksetzen
    const widgets = document.querySelectorAll('.widget-item');
    widgets.forEach(widget => {
      const interactable = interact(widget);
      if (interactable) {
        interactable.unset();
      }
    });
  }

  function initializeGridStack() {
    grid = GridStack.init({
      column: 12,
      row: 12,
      cellHeight: 100,
      minRow: 1,
      float: true,
      animate: true,
      resizable: {
        handles: 'all'
      },
      disableDrag: !isEditing,
      disableResize: !isEditing
    });

    grid.on('change', (event) => {
      if (!isEditing) return;
      
      const updatedDashboard = event.map(item => ({
        ...dashboard.find(w => w.id === item.id),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }));
      
      dispatch('update', { dashboard: updatedDashboard });
    });
  }

  function deleteWidget(widgetId: string) {
    dashboard = dashboard.filter(w => w.id !== widgetId);
    dispatch('update', { dashboard });
  }

  function handleConfigUpdate(event) {
    const updatedWidget = event.detail;
    console.log('Handling config update:', updatedWidget);
    const widgetIndex = dashboard.findIndex(w => w.id === updatedWidget.id);
    if (widgetIndex !== -1) {
      // Erstelle ein komplett neues Widget-Objekt
      const updatedDashboard = dashboard.map(w => w.id === updatedWidget.id ? {
        ...w,
        ...updatedWidget,
        options: updatedWidget.options,
        _updateKey: Date.now()
      } : w);
      dashboard = updatedDashboard;
      console.log('Updated dashboard:', dashboard);
      
      dispatch('update', { dashboard });
    }
    editingWidgetConfig = null;
  }
</script>

<div class="editor-container" class:editing={isEditing}>
  <div class="grid-container" class:editing={isEditing} bind:this={gridElement}>
    <slot></slot>

    <div class="grid-background">
      {#each Array(50) as _, i}
        <div class="grid-line horizontal" style="top: {i * 20}px"></div>
        <div class="grid-line vertical" style="left: {i * 20}px"></div>
      {/each}
    </div>

    {#each dashboard as widget, i (widget.id)}
      <div 
        class="widget-item"
        class:editing={isEditing}
        data-id={widget.id}
        data-index={i}
        style="
          transform: translate({widget.x * gridSize}px, {widget.y * gridSize}px);
          width: {widget.w * gridSize}px;
          height: {widget.h * gridSize}px;
        "
        use:initializeWidget
      >
        {#if widgetComponents[widget.type]}
          {@const Component = typeof widgetComponents[widget.type] === 'object' 
            ? widgetComponents[widget.type][widget.variant || 'default']
            : widgetComponents[widget.type]}
          <svelte:component 
            this={Component}
            {widget}
            {isEditing}
            service={$openhabService}
            key={widget._updateKey || undefined}
          />
        {/if}

        {#if isEditing}
          <div class="widget-controls">
            <button 
              class="edit-button" 
              title="Edit Widget"
              on:click={() => editingWidgetConfig = widget}
            >
              <i class="fas fa-cog"></i>
            </button>
            <button 
              class="delete-button" 
              title="Delete Widget"
              on:click={() => deleteWidget(widget.id)}
            >
              <i class="fas fa-trash"></i>
            </button>
            <button class="resize-handle" title="Resize">
              <i class="fas fa-arrows-alt"></i>
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if showingItemSelector}
  <div class="item-selector-modal">
    <div class="modal-content" role="dialog" aria-modal="true">
      <h3>Select Item for {selectedWidgetType}</h3>
      <div class="items-list">
        {#each items.filter(item => {
          if (!item?.type) return false;
          const mappedType = mapOpenHABTypeToWidgetType(item.type);
          return mappedType === selectedWidgetType.toLowerCase();
        }).sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name)) as item (item.name)}
          <button 
            class="item-option"
            on:click={() => selectItem(item)}
          >
            <div class="item-info">
              <span class="item-name">{item.label || item.name}</span>
              {#if item.state !== undefined}
                <span class="item-state">{item.state}</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
      <button class="close-button" on:click={() => showingItemSelector = false}>
        Cancel
      </button>
    </div>
  </div>
{/if}

{#if editingWidgetConfig}
  <div class="widget-config-modal" transition:fade>
    <div class="modal-content">
      <WidgetConfig 
        widget={editingWidgetConfig}
        on:update={handleConfigUpdate}
        on:close={() => editingWidgetConfig = null}
      />
    </div>
  </div>
{/if}

<style>
  .editor-container {
    display: flex;
    height: 100%;
    gap: 1rem;
  }

  .widget-palette {
    position: fixed;
    left: 0;
    top: 80px;
    width: 250px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    margin: 1rem;
  }

  .widget-templates {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .widget-template {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .widget-template:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  .widget-template i {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }

  .grid-container {
    position: relative;
    flex: 1;
    overflow: auto;
    background: transparent;
    min-height: 1000px;
    border: none;
    touch-action: none;
  }

  .grid-container.editing {
    background: rgba(240, 240, 240, 0.95);
    border: 2px dashed #007bff;
  }

  .grid-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .editing .grid-background {
    opacity: 0.1;
  }

  .grid-line {
    position: absolute;
    background: white;
  }

  .grid-line.horizontal {
    left: 0;
    right: 0;
    height: 1px;
  }

  .grid-line.vertical {
    top: 0;
    bottom: 0;
    width: 1px;
  }

  .widget-item {
    position: absolute;
    background: transparent;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    touch-action: none;
    overflow: hidden;
  }

  .widget-item.editing {
    cursor: move;
    border: 2px solid rgba(38, 198, 218, 0.5);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 2px 8px rgba(38, 198, 218, 0.2);
  }

  .widget-item.editing:hover {
    border-color: rgba(38, 198, 218, 0.8);
    box-shadow: 0 4px 12px rgba(38, 198, 218, 0.3);
  }

  .widget-controls {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 8px 0 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .widget-item:hover .widget-controls {
    opacity: 1;
  }

  .widget-controls button {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .widget-controls button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .edit-button:hover {
    background: var(--primary-color) !important;
  }

  .delete-button:hover {
    background: var(--error-color) !important;
  }

  .widget-ghost {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
    background: rgba(255,255,255,0.8);
    border: 2px dashed #666;
    border-radius: 8px;
  }

  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: rgba(255,255,255,0.9);
    color: #666;
  }

  button:hover {
    background: white;
    color: #333;
  }

  .delete-button:hover {
    color: #dc3545;
  }

  .item-selector-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .modal-content {
    position: relative;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .item-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .item-option:hover {
    background: #e5e5e5;
    transform: translateY(-2px);
  }

  .item-state {
    color: #666;
    font-size: 0.9rem;
  }

  .grid-container {
    background: transparent;
  }

  .grid-container.editing {
    background: rgba(255,255,255,0.1);
  }

  .widget-template {
    cursor: move;
    padding: 12px;
    margin: 8px;
    background-color: #ffffff;
    border: 2px solid #007bff;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    opacity: 1;
  }

  .widget-template:hover {
    background-color: #f0f8ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .widget-template i {
    color: #007bff;
    font-size: 1.2em;
  }

  .widget-template span {
    color: #2c3e50;
    font-weight: 500;
  }

  .grid-container.editing {
    border: 2px dashed #007bff;
    background: rgba(240, 240, 240, 0.95);
  }

  .widget-ghost {
    background-color: rgba(0, 123, 255, 0.5) !important;
    border: 2px solid #007bff !important;
    border-radius: 6px !important;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.3) !important;
  }

  .grid-line {
    display: block;
    background: rgba(0, 123, 255, 0.1);
  }

  .widget-item.editing {
    border: 2px solid #007bff;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  }

  .widget-item.editing:hover {
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  .grid-container.drop-target {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  .widget-ghost {
    background-color: rgba(0, 123, 255, 0.5) !important;
    border: 2px solid #007bff !important;
    border-radius: 6px !important;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.3) !important;
    pointer-events: none;
    z-index: 1000;
  }

  .grid-container.drop-active {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .item-name {
    font-weight: 500;
    color: #2c3e50;
  }

  .item-state {
    font-size: 0.9em;
    color: #666;
  }

  .item-option {
    width: 100%;
    padding: 1rem;
    background: #f8f9fa;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item-option:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .widget-setup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .widget-config-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 1.5rem;
    min-width: 300px;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
</style> 