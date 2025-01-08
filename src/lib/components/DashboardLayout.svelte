<script lang="ts">
  import { onMount } from 'svelte';
  import type { DashboardItem } from '../types/dashboard';
  
  export let sections: {
    title: string;
    items: DashboardItem[];
  }[] = [];
  export let isEditing = false;
  export let onEdit: () => void;
  export let onSave: () => void;
  export let onDisconnect: () => void;
  
  // Gradient-Hintergrund basierend auf der Tageszeit
  let gradientClass = '';
  
  let currentView = 'dashboard';
  
  onMount(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) gradientClass = 'morning';
    else if (hour >= 12 && hour < 18) gradientClass = 'day';
    else if (hour >= 18 && hour < 22) gradientClass = 'evening';
    else gradientClass = 'night';
  });
</script>

<div class="dashboard-layout {gradientClass}">
  <div class="sidebar">
    <div class="time-info">
      <h1>{new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</h1>
      <p>{new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    </div>
    
    <nav>
      <button 
        class="nav-button" 
        class:active={currentView === 'dashboard'}
        on:click={() => currentView = 'dashboard'}
      >
        Dashboard
      </button>
      <button 
        class="nav-button" 
        class:active={currentView === 'settings'}
        on:click={() => currentView = 'settings'}
      >
        Einstellungen
      </button>
    </nav>

    <div class="system-info">
      <div class="info-item">
        <span>CPU</span>
        <div class="progress-bar">
          <div class="progress" style="width: 15%"></div>
        </div>
      </div>
      <div class="info-item">
        <span>RAM</span>
        <div class="progress-bar">
          <div class="progress" style="width: 45%"></div>
        </div>
      </div>
    </div>

    <div class="actions">
      {#if isEditing}
        <button class="action-button save" on:click={onSave}>
          <i class="fas fa-save"></i>
          Save
        </button>
      {:else}
        <button class="action-button edit" on:click={onEdit}>
          <i class="fas fa-edit"></i>
          Edit
        </button>
      {/if}
      <button class="action-button disconnect" on:click={onDisconnect}>
        <i class="fas fa-power-off"></i>
        Disconnect
      </button>
    </div>
  </div>

  <main>
    <slot />
  </main>
</div>

<style>
  .dashboard-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: 100vh;
    background: var(--gradient-bg);
    color: white;
  }

  .sidebar {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .time-info h1 {
    font-size: 3rem;
    margin: 0;
  }

  .time-info p {
    margin: 0;
    opacity: 0.8;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-button {
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: none;
    border-radius: 8px;
    color: white;
    text-align: left;
    cursor: pointer;
    opacity: 0.8;
    transition: all 0.2s;
  }

  .nav-button.active,
  .nav-button:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }

  main {
    padding: 2rem;
    overflow-y: auto;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }

  .grid-item {
    min-height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s;
  }

  .grid-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .system-info {
    margin-top: auto;
  }

  .info-item {
    margin-bottom: 1rem;
  }

  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-top: 0.25rem;
  }

  .progress {
    height: 100%;
    background: white;
    border-radius: 2px;
  }

  /* Gradient backgrounds */
  .morning {
    --gradient-bg: linear-gradient(135deg, #ff6b6b, #feca57);
  }

  .day {
    --gradient-bg: linear-gradient(135deg, #4facfe, #00f2fe);
  }

  .evening {
    --gradient-bg: linear-gradient(135deg, #a18cd1, #fbc2eb);
  }

  .night {
    --gradient-bg: linear-gradient(135deg, #32325d, #2c3e50);
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 2rem;
  }

  .action-button {
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .action-button.edit {
    background: #0066cc;
  }

  .action-button.save {
    background: #28a745;
  }

  .action-button.disconnect {
    background: #dc3545;
  }

  .action-button:hover {
    filter: brightness(1.1);
  }
</style> 