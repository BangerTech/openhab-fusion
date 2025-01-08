<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { openhabService, items } from '../lib/stores';
  import DashboardLayout from '../lib/components/DashboardLayout.svelte';
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

  // Compute sections based on dashboard items
  $: sections = [
    {
      title: 'Lighting',
      items: dashboard.filter(item => {
        const foundItem = $items.find(i => i.name === item.item);
        return foundItem?.type === 'Switch' || foundItem?.type === 'Dimmer';
      })
    },
    {
      title: 'Climate',
      items: dashboard.filter(item => {
        const foundItem = $items.find(i => i.name === item.item);
        return foundItem?.tags?.includes('Temperature');
      })
    },
    {
      title: 'Media',
      items: dashboard.filter(item => {
        const foundItem = $items.find(i => i.name === item.item);
        return foundItem?.tags?.includes('Media');
      })
    },
    {
      title: 'Other',
      items: dashboard.filter(item => {
        const foundItem = $items.find(i => i.name === item.item);
        return !foundItem?.tags?.some(tag => 
          ['Temperature', 'Media'].includes(tag)
        );
      })
    }
  ];

  function toggleEdit() {
    isEditing = !isEditing;
    if (!isEditing) {
      saveDashboard();
    }
  }
</script>

<div class="dashboard">
  <DashboardLayout 
    {sections}
    {isEditing}
    onEdit={toggleEdit}
    onSave={toggleEdit}
    {disconnect}
  >
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
  </DashboardLayout>
</div>

<style>
  .dashboard {
    height: 100vh;
    overflow: hidden;
  }

  .dashboard-content {
    height: 100%;
    overflow: auto;
    padding: 1rem;
  }
</style> 