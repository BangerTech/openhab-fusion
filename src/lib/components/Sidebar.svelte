<script lang="ts">
  import SidebarEditor from './SidebarEditor.svelte';
  import Clock from './Clock.svelte';
  import Weather from './Weather.svelte';
  import ViewList from './ViewList.svelte';
  import WidgetSettingsModal from './WidgetSettingsModal.svelte';
  import { editorStore } from '../stores/editor';
  
  $: isEditing = $editorStore.isEditing;
  $: editTarget = $editorStore.editTarget;
  $: isSidebarEditing = isEditing && editTarget === 'sidebar';
  
  let showSettingsModal = false;
  let currentWidget = null;
  
  let widgets = {
    clock: {
      id: 'clock-1',
      type: 'clock',
      settings: {
        showDate: true,
        showTime: true,
        showSeconds: true,
        fontSize: '1.2rem',
        format: 'de-DE'
      }
    },
    weather: {
      id: 'weather-1',
      type: 'weather',
      settings: {
        showTemp: true,
        showHumidity: true
      }
    }
  };
  
  function handleEditWidget(event) {
    const { id, type } = event.detail;
    currentWidget = widgets[type];
    showSettingsModal = true;
  }
  
  function handleSaveSettings(event) {
    const { id, settings } = event.detail;
    const widgetType = currentWidget.type;
    widgets[widgetType].settings = settings;
  }
  
  $: {
    console.log('### Sidebar - State Change ###');
    console.log('isEditing:', isEditing);
    console.log('editTarget:', editTarget);
  }
</script>

<div class="sidebar">
  <SidebarEditor 
    {isEditing} 
    {editTarget}
    on:editWidget={handleEditWidget}
  >
    <div class="sidebar-top">
      <Clock 
        settings={widgets.clock.settings} 
        isEditing={isSidebarEditing}
      />
      <Weather 
        settings={widgets.weather.settings}
        isEditing={isSidebarEditing}
      />
    </div>

    <ViewList isEditing={isSidebarEditing} />

    <div class="sidebar-bottom">
      <!-- Weitere Sidebar-Elemente -->
    </div>
  </SidebarEditor>
</div>

<WidgetSettingsModal
  bind:show={showSettingsModal}
  widget={currentWidget}
  on:save={handleSaveSettings}
/>

<style>
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background: var(--surface-container);
    z-index: 1001;
    overflow-y: auto;
  }

  .sidebar-top {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .sidebar-bottom {
    margin-top: auto;
    padding: 1rem;
    border-top: 1px solid var(--border-color);
  }
</style> 