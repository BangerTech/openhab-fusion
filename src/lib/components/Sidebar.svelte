<script lang="ts">
  import Clock from './Clock.svelte';
  import Weather from './Weather.svelte';
  import ViewList from './ViewList.svelte';
</script>

<aside class="sidebar">
  <div class="sidebar-top">
    <Clock />
    <Weather />
  </div>

  <ViewList />

  <div class="sidebar-bottom">
    <!-- Weitere Sidebar-Elemente -->
  </div>
</aside>

<style>
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100vh;
    box-sizing: border-box;
  }

  .sidebar-top {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar-bottom {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }
</style> 