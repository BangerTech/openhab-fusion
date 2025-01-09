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
    return saved ? JSON.parse(saved) : [];
  }

  function saveDashboard() {
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
  }

  function handleDashboardUpdate(event) {
    dashboard = event.detail.dashboard;
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
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'Hemma' }
    ];
  }

  function loadSidebarItems() {
    const saved = localStorage.getItem('sidebarItems');
    return saved ? JSON.parse(saved) : [];
  }

  function handleTabUpdate(event) {
    tabs = event.detail.tabs;
    localStorage.setItem('tabs', JSON.stringify(tabs));
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
    const occupied = new Set(
      dashboard.map(w => `${w.x},${w.y}`)
    );
    
    let x = 0;
    let y = 0;
    
    while (occupied.has(`${x},${y}`)) {
      x += 2;
      if (x > 10) {
        x = 0;
        y += 2;
      }
    }
    
    return { x: x * gridSize, y: y * gridSize };
  }

  function handleWidgetSelect(event) {
    console.log('Widget selected:', event.detail);
    const widget = event.detail;
    const newWidget = {
      id: generateUUID(),
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
    
    dashboard = [...dashboard, selectedWidget];
    saveDashboard();
    
    showItemSelector = false;
    selectedWidget = null;
    showPlaceholder = false;
  }

  function addNewTab() {
    tabs = [...tabs, { id: generateUUID(), name: 'New Room' }];
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }

  function removeTab(id: string) {
    tabs = tabs.filter(tab => tab.id !== id);
    if (tabs.length === 0) {
      tabs = [{ id: 'default', name: 'Home' }];
    }
    if (activeTab === id) {
      activeTab = tabs[0].id;
    }
    localStorage.setItem('tabs', JSON.stringify(tabs));
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
      <div class="header-nav">
        <div class="tab-name">
          {activeTab}
          {#if isEditing}
            <button 
              class="edit-rooms-button" 
              on:click={() => showTabEditor = true}
            >
              <i class="fas fa-pencil"></i>
              <span>Edit Rooms</span>
            </button>
          {/if}
        </div>

        <div class="nav-controls">
          {#if isEditing}
            <div class="nav-items">
              <button 
                class:active={editTarget === 'dashboard'}
                on:click={() => editTarget = 'dashboard'}
                style="
                  background: {editTarget === 'dashboard' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
                  opacity: {editTarget === 'dashboard' ? '1' : '0.7'};
                "
              >
                <i class="fas fa-th-large"></i>
                <span>Dashboard</span>
              </button>
              
              <button 
                class:active={editTarget === 'sidebar'}
                on:click={() => editTarget = 'sidebar'}
                style="
                  background: {editTarget === 'sidebar' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
                  opacity: {editTarget === 'sidebar' ? '1' : '0.7'};
                "
              >
                <i class="fas fa-columns"></i>
                <span>Sidebar</span>
              </button>
            </div>

            <button 
              class="add-button"
              on:click={handleAddClick}
            >
              <i class="fas fa-plus"></i>
              <span>Add</span>
            </button>
          {/if}

          <button 
            class="edit-button"
            on:click={handleEditModeChange}
          >
            <i class="fas fa-{isEditing ? 'check' : 'edit'}"></i>
          </button>

          <button 
            class="disconnect-button"
            on:click={disconnect}
          >
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <DashboardEditor
        items={$items}
        {dashboard}
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
    <div class="tab-editor-modal">
      <div class="modal-content">
        <h3>Edit Rooms</h3>
        <div class="rooms-list">
          {#each tabs as tab}
            <div class="room-item">
              <input 
                type="text" 
                bind:value={tab.name}
                placeholder="Room name"
              />
              <button class="delete-room" on:click={() => removeTab(tab.id)}>
                <i class="fas fa-trash"></i>
              </button>
            </div>
          {/each}
          <button class="add-room" on:click={addNewTab}>
            <i class="fas fa-plus"></i>
            Add Room
          </button>
        </div>
        <div class="modal-actions">
          <button on:click={() => showTabEditor = false}>Close</button>
        </div>
      </div>
    </div>
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
    display: flex;
    align-items: center;
    background: rgba(0, 40, 60, 0.1);
  }

  .header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
</style> 