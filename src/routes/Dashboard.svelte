<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { openhabService, items } from '../lib/stores';
  import DashboardEditor from '../lib/components/DashboardEditor.svelte';
  import OpenHABItem from '../lib/components/OpenHABItem.svelte';

  let dashboard = loadDashboard();
  let isEditing = false;

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
</script>

<div class="dashboard">
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

  <div class="main-content">
    <div class="header">
      <div class="tabs">
        <button class="tab active">Hemma</button>
        <button class="tab">Entities</button>
      </div>
      <div class="actions">
        <button class="action-button" on:click={toggleEdit}>
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-button" on:click={disconnect}>
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <DashboardEditor
        items={$items}
        {dashboard}
        {isEditing}
        on:update={handleDashboardUpdate}
      >
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
</div>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #0288d1, #26c6da);
    color: white;
  }

  .sidebar {
    width: 300px;
    background: rgba(0, 40, 60, 0.2);
    backdrop-filter: blur(10px);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
    margin-top: auto;
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
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 40, 60, 0.1);
  }

  .tabs {
    display: flex;
    gap: 1rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    opacity: 0.7;
    transition: all 0.2s;
  }

  .tab:hover,
  .tab.active {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  .action-button {
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
    transition: background-color 0.2s;
  }

  .action-button:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .dashboard-content {
    flex: 1;
    overflow: auto;
    padding: 2rem;
  }
</style> 