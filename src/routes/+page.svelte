<script lang="ts">
  import EditToolbar from '$lib/components/EditToolbar.svelte';
  // ... andere Imports ...

  let isEditing = false;

  function handleToggleEdit() {
    isEditing = !isEditing;
  }

  function handleAddWidget() {
    // Implementiere Widget-Hinzufügen-Logik
  }
</script>

<div class="app">
  <EditToolbar 
    {isEditing}
    on:toggleEdit={handleToggleEdit}
    on:addWidget={handleAddWidget}
  />
  
  <!-- Rest der App -->
  <main class="dashboard" class:editing={isEditing}>
    <!-- Dashboard Content -->
  </main>
</div>

<style>
  .app {
    padding-top: 3rem; /* Platz für die Toolbar */
  }

  .dashboard {
    transition: padding-top 0.3s ease;
  }

  .dashboard.editing {
    padding-top: 4rem; /* Mehr Platz wenn Toolbar sichtbar */
  }
</style> 