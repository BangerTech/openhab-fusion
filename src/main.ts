import App from './App.svelte'
import { navigate } from 'svelte-routing'

const app = new App({
  target: document.getElementById('app'),
  props: {
    url: window.location.pathname
  }
})

// Handle browser navigation
window.addEventListener('popstate', () => {
  const currentPath = window.location.pathname;
  navigate(currentPath, { replace: true });
})

export default app 