<script lang="ts">
  import { currentView } from '../stores/view';

  const views = [
    'Dashboard',
    'Erdgeschoss',
    'Obergeschoss',
    'Büro/Werkstatt',
    'Halle'
  ];

  function selectView(view: string) {
    currentView.set(view);
  }
</script>

<nav class="view-list">
  {#each views as view}
    <button 
      class="view-button" 
      class:active={$currentView === view}
      on:click={() => selectView(view)}
    >
      {view}
    </button>
  {/each}
</nav>

<style>
  .view-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .view-button {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .view-button.active {
    background: var(--primary);
  }
</style> 