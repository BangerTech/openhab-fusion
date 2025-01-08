<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let widget: any;
  export let isEditing = false;

  $: item = widget?.item;
  $: state = item?.state || 'OFF';

  const dispatch = createEventDispatcher();

  async function toggleSwitch() {
    if (isEditing) return;
    // ... Toggle-Logik
  }
</script>

<button 
  class="ha-fusion-switch" 
  class:active={state === 'ON'}
  class:editing={isEditing}
  on:click={toggleSwitch}
  disabled={isEditing}
>
  <div class="content">
    <div class="icon">
      <i class="fas fa-lightbulb"></i>
    </div>
    <div class="info">
      <span class="label">{item?.label || 'Switch'}</span>
      <span class="state">{state}</span>
    </div>
  </div>
</button>

<style>
  .ha-fusion-switch {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.1);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    place-items: center;
    font-size: 1.2rem;
  }

  .info {
    text-align: left;
  }

  .label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
  }

  .state {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .active {
    background: rgba(38, 198, 218, 0.2);
  }

  .active .icon {
    background: #26c6da;
  }
</style> 