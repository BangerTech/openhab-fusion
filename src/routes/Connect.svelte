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

<style>
  .connect-page {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0288d1, #26c6da);
  }

  .connect-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .logo {
    width: 80px;
    height: 80px;
    background: #26c6da;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
    font-size: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #2c3e50;
  }

  .subtitle {
    color: #7f8c8d;
    margin-bottom: 2rem;
  }

  .input-group {
    margin-bottom: 1rem;
    padding: 0 1rem;
  }

  label {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    color: #34495e;
    font-weight: 500;
  }

  input {
    width: calc(100% - 2rem);
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #26c6da;
    box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);
  }

  .example {
    font-size: 0.9rem;
    color: #95a5a6;
    margin-top: 0.5rem;
    text-align: left;
    padding: 0 1rem;
  }

  button {
    width: 100%;
    padding: 1rem;
    background: #26c6da;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 1rem;
  }

  button:hover {
    background: #2dd3e7;
    transform: translateY(-2px);
  }

  button:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
</style> 