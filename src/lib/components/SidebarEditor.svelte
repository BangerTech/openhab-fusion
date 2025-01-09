<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import { widgetPositions } from '../stores/widgets';
  
  export let isEditing = false;
  export let editTarget: 'dashboard' | 'sidebar' = 'dashboard';
  
  const dispatch = createEventDispatcher();
  
  let draggedWidget: HTMLElement | null = null;
  
  $: isEditingSidebar = isEditing && editTarget === 'sidebar';
  
  function handleDragStart(event: DragEvent) {
    if (!isEditingSidebar) return;
    
    const widget = event.target as HTMLElement;
    draggedWidget = widget;
    widget.classList.add('dragging');
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', widget.dataset.widgetId || '');
    }
  }
  
  function handleDragOver(event: DragEvent) {
    if (!isEditingSidebar || !draggedWidget) return;
    event.preventDefault();
  }
  
  function handleDragEnd(event: DragEvent) {
    if (!isEditingSidebar) return;
    
    const widget = event.target as HTMLElement;
    widget.classList.remove('dragging');
    draggedWidget = null;
  }
  
  function handleEdit(widget: HTMLElement) {
    dispatch('editWidget', {
      id: widget.dataset.widgetId,
      type: widget.dataset.widgetType
    });
  }
  
  setContext('sidebarEditor', {
    handleDragStart,
    handleDragEnd
  });
</script>

<div 
  class="sidebar-editor" 
  class:editing={isEditingSidebar}
  on:dragover={handleDragOver}
>
  <div class="widgets-container">
    <slot />
  </div>
</div>

<style>
  .sidebar-editor {
    position: relative;
    height: 100%;
  }
  
  .widgets-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  :global(.sidebar-editor.editing .widget) {
    cursor: move;
    user-select: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  :global(.sidebar-editor.editing .widget.dragging) {
    opacity: 0.5;
    transform: scale(0.95);
  }
  
  :global(.sidebar-editor.editing .widget:hover) {
    transform: scale(1.02);
    box-shadow: 0 0 0 2px var(--primary);
  }
</style> 