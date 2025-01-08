<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import { Connect, Dashboard } from './routes';
  import { onMount } from 'svelte';
  import { openhabService } from './lib/stores';

  export let url = '';

  onMount(() => {
    // Überprüfen Sie, ob bereits eine Verbindung besteht
    const lastUrl = localStorage.getItem('lastOpenHABUrl');
    if (lastUrl && window.location.pathname === '/') {
      window.location.href = '/dashboard';
    }
  });
</script>

<Router {url}>
  <main>
    <Route path="/connect" component={Connect} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/" component={Connect} />
  </main>
</Router>

<style>
  main {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 