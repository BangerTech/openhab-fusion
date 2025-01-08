<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardItem } from '../types/dashboard';
  import type { WidgetType } from '../types/widgets';
  import { onMount } from 'svelte';
  
  // Widget-Komponenten importieren
  import SwitchWidget from './widgets/SwitchWidget.svelte';

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

  // Definieren Sie zuerst einen Typ für die Widget-Templates
  type WidgetTemplate = {
    type: WidgetType;
    icon: string;
    label: string;
    minW: number;
    minH: number;
  };

  // Dann typisieren Sie das Array entsprechend
  const widgetTypes: WidgetTemplate[] = [
    { type: 'switch', icon: 'toggle-on', label: 'Switch', minW: 2, minH: 1 },
    { type: 'dimmer', icon: 'sliders-h', label: 'Dimmer', minW: 2, minH: 1 },
    { type: 'number', icon: 'thermometer-half', label: 'Sensor', minW: 2, minH: 1 },
    { type: 'chart', icon: 'chart-line', label: 'Chart', minW: 4, minH: 3 },
    { type: 'camera', icon: 'video', label: 'Camera', minW: 4, minH: 3 },
    { type: 'weather', icon: 'cloud-sun', label: 'Weather', minW: 4, minH: 2 }
  ];

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
    if (!interact) {
      console.error('Interact.js not initialized');
      return;
    }

    // Zuerst alle bestehenden Interaktionen entfernen
    interact('.grid-container').unset();
    interact('.widget-template').unset();

    if (isEditing) {
      // Dropzone konfigurieren
      interact('.grid-container').dropzone({
        accept: '.widget-template',
        overlap: 'pointer',
        ondropactivate: function (event) {
          console.log('Drop activate');
          event.target.classList.add('drop-possible');
        },
        ondropdeactivate: function (event) {
          console.log('Drop deactivate');
          event.target.classList.remove('drop-possible');
          event.target.classList.remove('drop-active');
        },
        ondragenter: function (event) {
          console.log('Drag enter');
          event.target.classList.add('drop-active');
        },
        ondragleave: function (event) {
          console.log('Drag leave');
          event.target.classList.remove('drop-active');
        },
        ondrop: function (event) {
          console.log('Drop happened!');
          const type = event.relatedTarget.getAttribute('data-type');
          if (!type) {
            console.error('No type found on dragged element');
            return;
          }

          const template = findTemplate(type);
          if (!template) {
            console.error('No template found for type:', type);
            return;
          }

          const rect = gridElement.getBoundingClientRect();
          const x = Math.floor((event.dragEvent.clientX - rect.left) / gridSize);
          const y = Math.floor((event.dragEvent.clientY - rect.top) / gridSize);

          currentNewWidget = {
            id: `widget-${Date.now()}`,
            type: type as WidgetType,
            x,
            y,
            w: template.minW,
            h: template.minH,
            item: null,
            options: {}
          };

          console.log('Creating widget:', { type, template, newWidget: currentNewWidget });
          showItemSelector(type as WidgetType);
        }
      });

      // Draggable konfigurieren
      interact('.widget-template').draggable({
        inertia: false,
        autoScroll: true,
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'body'
          })
        ],
        listeners: {
          start: function (event) {
            const type = event.target.getAttribute('data-type');
            const template = widgetTypes.find(w => w.type === type);
            if (!template) {
              console.error('No template found for type:', type);
              return;
            }

            console.log('Drag start:', { type, template });
            
            const ghost = document.createElement('div');
            ghost.className = 'widget-ghost';
            ghost.style.width = `${template.minW * gridSize}px`;
            ghost.style.height = `${template.minH * gridSize}px`;
            ghost.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
            ghost.style.border = '2px solid #007bff';
            ghost.style.position = 'fixed';
            ghost.style.pointerEvents = 'none';
            ghost.style.zIndex = '1000';
            document.body.appendChild(ghost);
            
            event.target.ghost = ghost;
          },
          move: function (event) {
            const { ghost } = event.target;
            if (ghost) {
              const { clientX, clientY } = event;
              ghost.style.transform = `translate(${clientX - ghost.offsetWidth/2}px, ${clientY - ghost.offsetHeight/2}px)`;
            }
          },
          end: function (event) {
            console.log('Drag end');
            if (event.target.ghost) {
              event.target.ghost.remove();
            }
          }
        }
      });
    }
  }

  function initializeWidget(element) {
    if (!isEditing) return;

    interact(element)
      .draggable({
        enabled: isEditing,
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
            restriction: gridElement,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            endOnly: true
          })
        ],
        listeners: {
          move: dragMoveListener,
          end: (event) => updateWidgetPosition(event.target)
        }
      })
      .resizable({
        enabled: isEditing,
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          interact.modifiers.snap({
            targets: [
              interact.snappers.grid({ x: gridSize, y: gridSize })
            ]
          }),
          interact.modifiers.restrict({
            restriction: gridElement
          })
        ],
        listeners: {
          move: resizeMoveListener,
          end: (event) => updateWidgetSize(event.target)
        }
      });
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

  function updateWidgetPosition(element) {
    const id = element.getAttribute('data-id');
    const widget = dashboard.find(w => w.id === id);
    if (!widget) return;

    const x = parseFloat(element.getAttribute('data-x')) || 0;
    const y = parseFloat(element.getAttribute('data-y')) || 0;

    widget.x = Math.round(x / gridSize);
    widget.y = Math.round(y / gridSize);
    
    dispatch('update', { dashboard: [...dashboard] });
  }

  function updateWidgetSize(element) {
    const id = element.getAttribute('data-id');
    const widget = dashboard.find(w => w.id === id);
    if (!widget) return;

    const width = parseFloat(element.style.width);
    const height = parseFloat(element.style.height);

    widget.w = Math.round(width / gridSize);
    widget.h = Math.round(height / gridSize);
    
    dispatch('update', { dashboard: [...dashboard] });
  }

  function addWidget(type: string, x: number, y: number) {
    const template = widgetTypes.find(w => w.type === type);
    const newWidget: DashboardItem = {
      id: crypto.randomUUID(),
      type,
      x: Math.round(x / gridSize),
      y: Math.round(y / gridSize),
      w: template.minW,
      h: template.minH,
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

  function selectItem(item: OpenHABItem) {
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
      state: item.state || null
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
</script>

<div class="editor-container" class:editing={isEditing}>
  {#if isEditing}
    <div class="widget-palette">
      <h3>Available Widgets</h3>
      <div class="widget-templates">
        {#each widgetTypes as widget}
          <div 
            class="widget-template"
            data-type={widget.type}
          >
            <i class="fas fa-{widget.icon}"></i>
            <span>{widget.label}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div 
    class="grid-container"
    class:editing={isEditing}
    bind:this={gridElement}
  >
    <div class="grid-background">
      {#each Array(50) as _, i}
        <div class="grid-line horizontal" style="top: {i * gridSize}px"></div>
        <div class="grid-line vertical" style="left: {i * gridSize}px"></div>
      {/each}
    </div>

    {#each dashboard as widget (widget.id)}
      <div 
        class="widget-item"
        class:editing={isEditing}
        data-id={widget.id}
        style="
          transform: translate({widget.x * gridSize}px, {widget.y * gridSize}px);
          width: {widget.w * gridSize}px;
          height: {widget.h * gridSize}px;
        "
        use:initializeWidget
      >
        {#if widget.type === 'switch'}
          <SwitchWidget 
            {widget} 
            {isEditing} 
            on:change={(event) => {
              dispatch('itemChange', event.detail);
            }}
          />
        {:else}
          <div>Unsupported widget type: {widget.type}</div>
        {/if}
        
        {#if isEditing}
          <div class="widget-controls">
            <button class="config-button" on:click={() => editingWidget = widget}>
              <i class="fas fa-cog"></i>
            </button>
            <button class="delete-button" on:click={() => {
              dashboard = dashboard.filter(w => w.id !== widget.id);
              dispatch('update', { dashboard });
            }}>
              <i class="fas fa-trash"></i>
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

<style>
  .editor-container {
    display: flex;
    height: 100%;
    gap: 1rem;
  }

  .widget-palette {
    width: 250px;
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  }

  .grid-line {
    display: none;
    background: rgba(0,0,0,0.03);
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
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s, width 0.2s, height 0.2s;
  }

  .widget-item.editing {
    cursor: move;
    user-select: none;
    touch-action: none;
  }

  .widget-controls {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
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
    -webkit-user-drag: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: none;
  }

  .widget-template:hover {
    background-color: #f0f8ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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
</style> 