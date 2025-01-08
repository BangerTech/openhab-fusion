<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { openhabService, items } from '../lib/stores';
  import ConnectionDialog from '../lib/components/ConnectionDialog.svelte';
  import { OpenHABService } from '../lib/services/openhab';

  async function handleConnection(event) {
    const { url } = event.detail;
    try {
      console.log('Connecting to OpenHAB at:', url);
      const service = new OpenHABService('/api');
      await service.testConnection();
      
      console.log('Connection successful');
      openhabService.set(service);
      
      console.log('Fetching items...');
      const fetchedItems = await service.getItems();
      items.set(fetchedItems);
      
      localStorage.setItem('lastOpenHABUrl', url);
      console.log('Navigating to dashboard...');
      
      // Verwenden Sie einen setTimeout, um sicherzustellen, dass die Stores aktualisiert sind
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Connection error:', err);
    }
  }
</script>

<ConnectionDialog 
  on:connected={handleConnection}
  initialUrl={localStorage.getItem('lastOpenHABUrl')}
/> 