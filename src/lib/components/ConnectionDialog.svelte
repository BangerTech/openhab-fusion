<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let initialUrl: string | null = null;
  
  const dispatch = createEventDispatcher();
  let url = initialUrl || '';
  
  function handleSubmit() {
    if (url) {
      dispatch('connected', { url });
    }
  }
</script>

<div class="connect-page">
  <div class="connect-card">
    <div class="logo">
      <i class="fas fa-home"></i>
    </div>
    <h1>OpenHAB Fusion</h1>
    <p class="subtitle">Smart Home Dashboard</p>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="input-group">
        <label for="server-url">
          <i class="fas fa-server"></i>
          Server URL
        </label>
        <input
          id="server-url"
          type="text"
          bind:value={url}
          placeholder="192.168.1.100:8080"
        />
        <div class="example">
          Example: 192.168.1.100:8080 or http://openhab.local:8080
        </div>
      </div>
      
      <button type="submit" disabled={!url}>
        <i class="fas fa-plug"></i>
        Connect
      </button>
    </form>
  </div>
</div>

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
    width: 90%;
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

  form {
    width: 100%;
  }

  .input-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #34495e;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  label i {
    color: #7f8c8d;
  }

  input {
    width: 100%;
    box-sizing: border-box;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  button:hover:not(:disabled) {
    background: #2dd3e7;
    transform: translateY(-2px);
  }

  button:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
</style> 