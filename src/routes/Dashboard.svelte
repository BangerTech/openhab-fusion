<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { openhabService, items } from '../lib/stores';
  import DashboardEditor from '../lib/components/DashboardEditor.svelte';
  import OpenHABItem from '../lib/components/OpenHABItem.svelte';
  import TabEditor from '../lib/components/TabEditor.svelte';
  import SidebarEditor from '../lib/components/SidebarEditor.svelte';
  import WidgetSelector from '../lib/components/WidgetSelector.svelte';
  import WidgetPlaceholder from '../lib/components/WidgetPlaceholder.svelte';
  import ItemSelector from '../lib/components/ItemSelector.svelte';
  import { generateUUID } from '../lib/utils/uuid';
  import RoomEditor from '../lib/components/RoomEditor.svelte';
  import { slide } from 'svelte/transition';

  let dashboard = loadDashboard();
  let isEditing = false;
  let editTarget: 'dashboard' | 'sidebar' | 'tabs' = 'dashboard';
  let showWidgetSelector = false;
  let placeholderPosition = { x: 0, y: 0 };
  let selectedCategory = 'all';
  let tabs = loadTabs();
  let activeTab = tabs[0]?.id || '';
  let sidebarItems = loadSidebarItems();
  let showSidebarWidgetSelector = false;
  let showTabEditor = false;
  let showItemSelector = false;
  let selectedWidget = null;
  let showPlaceholder = false;

  onMount(() => {
    if (!$openhabService) {
      navigate('/connect');
    }
  });

  function loadDashboard() {
    const saved = localStorage.getItem('dashboard');
    const defaultDashboard = { default: [] };
    if (!saved) return defaultDashboard;
    
    try {
      const parsed = JSON.parse(saved);
      // Wenn es ein Array ist (altes Format), konvertiere es
      if (Array.isArray(parsed)) {
        return { default: parsed };
      }
      return parsed;
    } catch (e) {
      console.error('Error loading dashboard:', e);
      return defaultDashboard;
    }
  }

  function saveDashboard() {
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
  }

  function handleDashboardUpdate(event) {
    const updatedWidgets = event.detail.dashboard;
    dashboard = {
      ...dashboard,
      [activeTab]: updatedWidgets
    };
    saveDashboard();
  }

  function disconnect() {
    openhabService.set(null);
    items.set([]);
    localStorage.removeItem('lastOpenHABUrl');
    navigate('/connect');
  }

  function toggleEdit() {
    isEditing = !isEditing;
    if (!isEditing) {
      saveDashboard();
    }
  }

  function loadTabs() {
    const saved = localStorage.getItem('tabs');
    const defaultTabs = [{ id: 'default', name: 'Hemma' }];
    if (!saved) return defaultTabs;
    
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tabs:', e);
      return defaultTabs;
    }
  }

  function loadSidebarItems() {
    const saved = localStorage.getItem('sidebarItems');
    return saved ? JSON.parse(saved) : [];
  }

  function handleTabUpdate(event) {
    const updatedTabs = event.detail.tabs;
    tabs = updatedTabs;
    
    // Initialisiere leere Dashboards für neue Räume
    const newDashboard = { ...dashboard };
    updatedTabs.forEach(tab => {
      if (!newDashboard[tab.id]) {
        newDashboard[tab.id] = [];
      }
    });
    
    // Entferne Dashboards von gelöschten Räumen
    Object.keys(newDashboard).forEach(roomId => {
      if (!updatedTabs.find(tab => tab.id === roomId)) {
        delete newDashboard[roomId];
      }
    });
    
    dashboard = newDashboard;
    saveDashboard();
    localStorage.setItem('tabs', JSON.stringify(tabs));
    
    // Wenn der aktive Tab gelöscht wurde, wähle den ersten verfügbaren
    if (!tabs.find(tab => tab.id === activeTab)) {
      activeTab = tabs[0]?.id || '';
    }
  }

  function handleSidebarUpdate(event) {
    sidebarItems = event.detail.items;
    localStorage.setItem('sidebarItems', JSON.stringify(sidebarItems));
  }

  function handleEditModeChange(event) {
    isEditing = !isEditing;
    if (!isEditing) {
      saveDashboard();
    }
  }

  function handleTargetChange(event) {
    editTarget = event.detail || event.target.dataset.target;
    
    // Reset states when changing target
    showWidgetSelector = false;
    showSidebarWidgetSelector = false;
    showTabEditor = false;
  }

  function handleAddClick() {
    switch(editTarget) {
      case 'dashboard':
        placeholderPosition = calculateNextWidgetPosition();
        showPlaceholder = true;
        showWidgetSelector = false;
        showItemSelector = false;
        showTabEditor = false;
        break;
      case 'sidebar':
        showSidebarWidgetSelector = true;
        break;
      case 'tabs':
        showTabEditor = true;
        break;
    }
  }

  function calculateNextWidgetPosition() {
    const gridSize = 20;
    const dashboardHeight = document.querySelector('.dashboard-content')?.clientHeight || 800;
    const rows = Math.floor(dashboardHeight / gridSize);
    
    // Erstelle ein Grid-Besetzungs-Array für den aktiven Raum
    const occupied = new Set(
      (dashboard[activeTab] || []).map(w => {
        const positions = [];
        for (let x = w.x; x < w.x + w.w; x++) {
          for (let y = w.y; y < w.y + w.h; y++) {
            positions.push(`${x},${y}`);
          }
        }
        return positions;
      }).flat()
    );
    
    // Suche eine freie Position, beginnend von der Mitte
    const startRow = Math.floor(rows / 3); // Beginne im oberen Drittel
    let x = 0;
    let y = startRow;
    
    while (occupied.has(`${x},${y}`)) {
      x += 2;
      if (x > 10) {
        x = 0;
        y += 2;
        
        // Wenn wir am Ende sind, gehe zurück zum Anfang
        if (y > rows) {
          y = 0;
        }
      }
    }
    
    return { x: x * gridSize, y: y * gridSize };
  }

  function handleWidgetSelect(event) {
    console.log('Widget selected:', event.detail);
    const widget = event.detail;
    const newWidget = {
      id: generateUUID(),
      roomId: activeTab,
      type: widget.type,
      variant: widget.variant || widget.variants[0],
      x: Math.round(placeholderPosition.x / 20),
      y: Math.round(placeholderPosition.y / 20),
      w: widget.defaultSize.w,
      h: widget.defaultSize.h,
      options: {}
    };
    
    showItemSelector = true;
    selectedWidget = newWidget;
    showWidgetSelector = false;
  }

  function handleItemSelect(item) {
    if (!selectedWidget) return;
    
    selectedWidget.item = {
      name: item.name,
      label: item.label || item.name,
      type: item.type,
      state: item.state
    };
    
    dashboard = {
      ...dashboard,
      [activeTab]: [...(dashboard[activeTab] || []), selectedWidget]
    };
    saveDashboard();
    
    showItemSelector = false;
    selectedWidget = null;
    showPlaceholder = false;
  }

  function handlePlaceholderClick() {
    showWidgetSelector = true;
    console.log('Opening widget selector');
  }

  function handleEditRooms() {
    showTabEditor = true;
  }
</script>

<div class="dashboard">
  <SidebarEditor 
    items={sidebarItems}
    {isEditing}
    {editTarget}
    on:update={handleSidebarUpdate}
  >
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="time">{new Date().toLocaleTimeString()}</div>
        <div class="date">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div class="weather">
          2°C
          <span class="humidity">81%</span>
        </div>
      </div>
      
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <button class="nav-item active">
            <i class="fas fa-home"></i>
            Hemma
          </button>
          <button class="nav-item">
            <i class="fas fa-shapes"></i>
            Entities
          </button>
        </nav>
      </div>

      <div class="system-info">
        <div class="info-item">
          <span>CPU</span>
          <div class="progress-bar">
            <div class="progress" style="width: 15%"></div>
          </div>
          <span>15%</span>
        </div>
        <div class="info-item">
          <span>RAM</span>
          <div class="progress-bar">
            <div class="progress" style="width: 22%"></div>
          </div>
          <span>22%</span>
        </div>
      </div>
    </div>
  </SidebarEditor>

  <div class="main-content">
    <div class="header">
      <div class="header-content">
        <div class="header-nav">
          <div class="tab-name">
            <nav class="room-nav">
              {#each tabs as tab}
                <button 
                  class="room-button" 
                  class:active={activeTab === tab.id}
                  on:click={() => activeTab = tab.id}
                >
                  <i class="fas fa-home"></i>
                  {tab.name}
                </button>
              {/each}
            </nav>
          </div>

          <button 
            class="toggle-edit-menu"
            on:click={handleEditModeChange}
            class:active={isEditing}
          >
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        {#if isEditing}
          <div 
            class="edit-toolbar"
            transition:slide|local={{ duration: 300 }}
          >
            <div class="toolbar-content">
              <div class="nav-items">
                <button 
                  class:active={editTarget === 'dashboard'}
                  on:click={() => editTarget = 'dashboard'}
                >
                  <i class="fas fa-th-large"></i>
                  <span>Dashboard</span>
                </button>
                
                <button 
                  class:active={editTarget === 'sidebar'}
                  on:click={() => editTarget = 'sidebar'}
                >
                  <i class="fas fa-columns"></i>
                  <span>Sidebar</span>
                </button>
              </div>

              <div class="toolbar-actions">
                <button 
                  class="add-button"
                  on:click={handleAddClick}
                >
                  <i class="fas fa-plus"></i>
                  <span>Add</span>
                </button>

                <button 
                  class="done-button"
                  on:click={handleEditModeChange}
                >
                  <i class="fas fa-check"></i>
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="dashboard-content">
      <DashboardEditor
        items={$items}
        dashboard={dashboard[activeTab] || []}
        {isEditing}
        on:update={handleDashboardUpdate}
      >
        {#if isEditing && editTarget === 'dashboard' && showPlaceholder}
          <WidgetPlaceholder
            position={placeholderPosition}
            size={{ w: 200, h: 100 }}
            on:click={handlePlaceholderClick}
          />
        {/if}
        
        <svelte:fragment slot="widget" let:widget>
          <OpenHABItem 
            item={$items.find(i => i.name === widget.item)}
            service={$openhabService}
            {isEditing}
          />
        </svelte:fragment>
      </DashboardEditor>
    </div>
  </div>

  {#if showWidgetSelector}
    <WidgetSelector
      items={$items}
      selectedCategory={selectedCategory}
      on:select={handleWidgetSelect}
      on:close={() => showWidgetSelector = false}
    />
  {/if}

  {#if showItemSelector && selectedWidget}
    <ItemSelector
      items={$items}
      widgetType={selectedWidget.type}
      on:select={e => handleItemSelect(e.detail)}
      on:close={() => {
        showItemSelector = false;
        selectedWidget = null;
      }}
    />
  {/if}

  {#if showTabEditor}
    <RoomEditor
      tabs={tabs}
      onClose={() => showTabEditor = false}
      onUpdate={(updatedTabs) => {
        tabs = updatedTabs;
        localStorage.setItem('tabs', JSON.stringify(tabs));
        if (tabs.length === 0) {
          tabs = [{ id: 'default', name: 'Home' }];
        }
        if (!tabs.find(tab => tab.id === activeTab)) {
          activeTab = tabs[0].id;
        }
      }}
    />
  {/if}
</div>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #0288d1, #26c6da);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .sidebar {
    width: 300px;
    min-width: 300px;
    background: rgba(0, 40, 60, 0.2);
    backdrop-filter: blur(10px);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    box-sizing: border-box;
  }

  .sidebar > * {
    margin-bottom: 2rem;
  }

  .sidebar > :last-child {
    margin-bottom: 0;
  }

  .sidebar-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .time {
    font-size: 3rem;
    font-weight: 300;
  }

  .date {
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .weather {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }

  .humidity {
    opacity: 0.8;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s;
  }

  .nav-item:hover,
  .nav-item.active {
    background: rgba(255, 255, 255, 0.1);
  }

  .system-info {
    margin-top: auto !important;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  .progress {
    height: 100%;
    background: white;
    border-radius: 2px;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    padding: 1rem 2rem;
    background: rgba(0, 40, 60, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
  }

  .edit-rooms-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-rooms-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .edit-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  .nav-items {
    display: flex;
    gap: 0.5rem;
  }

  .nav-items button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .nav-items button i {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }

  .nav-items button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-items button.active {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }

  .control-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .edit-button,
  .disconnect-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .edit-button:hover,
  .disconnect-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }

  .add-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .add-button:hover {
    background: #45a049;
    transform: translateY(-1px);
  }

  .dashboard-content {
    flex: 1;
    overflow: auto;
    padding: 2rem;
  }

  .room-nav {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem;
    max-width: 100%;
    scrollbar-width: none;
  }

  .room-nav::-webkit-scrollbar {
    display: none;
  }

  .room-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .room-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .room-button.active {
    background: rgba(255, 255, 255, 0.25);
    font-weight: 500;
  }

  .toggle-edit-menu {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .toggle-edit-menu:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .toggle-edit-menu.active {
    transform: rotate(180deg);
    background: rgba(255, 255, 255, 0.2);
  }

  .edit-toolbar {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    overflow: hidden;
  }

  .toolbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
  }

  .toolbar-actions {
    display: flex;
    gap: 0.5rem;
  }

  .done-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .done-button:hover {
    background: #45a049;
    transform: translateY(-1px);
  }
</style> 