<script lang="ts">
  import type { DashboardItem, DashboardItemData } from '../../types/dashboard';
  
  export let widget: DashboardItem;
  
  $: item = widget?.item;
  $: label = item ? (item.label || item.name) : 'Unnamed Switch';
  $: state = item?.state || 'OFF';
</script>

<div class="switch-widget">
  <div class="widget-header">
    <span class="widget-label">{label}</span>
  </div>
  <div class="widget-content">
    <div class="switch-state" class:active={state === 'ON'}>
      {state}
    </div>
  </div>
</div>

<style>
  .switch-widget {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .widget-header {
    margin-bottom: 0.5rem;
  }

  .widget-label {
    font-weight: 500;
    color: #2c3e50;
  }

  .widget-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch-state {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: #f0f0f0;
    color: #666;
  }

  .switch-state.active {
    background: #4CAF50;
    color: white;
  }
</style> 