<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { OpenHABService } from '../services/openhab';

  export let initialUrl = '';
  const dispatch = createEventDispatcher();
  
  let url = initialUrl || '';
  let connecting = false;
  let error = '';

  async function connect() {
    if (!url) {
      error = 'Please enter an OpenHAB URL';
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }
    
    url = url.replace(/\/$/, '');
    connecting = true;
    error = '';

    try {
      const service = new OpenHABService('/api');
      await service.testConnection();
      dispatch('connected', { service, url });
    } catch (err) {
      error = `Connection error: ${err.message}`;
      console.error('Connection error:', err);
    } finally {
      connecting = false;
    }
  }
</script>

<div class="connection-container">
  <div class="connection-card">
    <!-- Logo/Icon Section -->
    <div class="icon-section">
      <div class="icon-circle">
        <i class="fas fa-home"></i>
      </div>
      <h1>OpenHAB Fusion</h1>
      <p class="subtitle">Smart Home Dashboard</p>
    </div>

    <!-- Connection Form -->
    <div class="form-section">
      <div class="input-group">
        <label for="url">
          <i class="fas fa-server"></i>
          Server URL
        </label>
        <input 
          type="text" 
          id="url" 
          bind:value={url} 
          placeholder="192.168.1.100:8080"
          disabled={connecting}
          on:keydown={(e) => e.key === 'Enter' && connect()}
        />
        <small>Example: 192.168.1.100:8080 or http://openhab.local:8080</small>
      </div>

      {#if error}
        <div class="error-message" role="alert">
          <i class="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      {/if}

      <button 
        class="connect-button"
        on:click={connect} 
        disabled={connecting}
      >
        {#if connecting}
          <div class="loading-spinner"></div>
          <span>Connecting...</span>
        {:else}
          <i class="fas fa-plug"></i>
          <span>Connect</span>
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .connection-container {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: rgba(240, 240, 240, 0.95);
    padding: 1rem;
  }

  .connection-card {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(79, 172, 254, 0.1);
    overflow: hidden;
    transform: translateY(0);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .connection-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(79, 172, 254, 0.2);
  }

  .icon-section {
    padding: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
  }

  .icon-circle {
    width: 80px;
    height: 80px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: grid;
    place-items: center;
    backdrop-filter: blur(8px);
  }

  .icon-circle i {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
    margin: 0.5rem 0 0;
  }

  .form-section {
    padding: 2rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4a5568;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }

  small {
    display: block;
    color: #718096;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #fff5f5;
    color: #c53030;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .connect-button {
    width: 100%;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .connect-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.25);
  }

  .connect-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .connection-card {
      margin: 1rem;
    }
  }
</style> 