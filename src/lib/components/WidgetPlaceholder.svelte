<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let position = { x: 0, y: 0 };
  export let size = { w: 2, h: 2 };
  
  const dispatch = createEventDispatcher();
</script>

<button
  type="button"
  role="button"
  tabindex="0"
  class="widget-placeholder"
  style="
    transform: translate({position.x}px, {position.y}px);
    width: {size.w}px;
    height: {size.h}px;
  "
  on:click={() => dispatch('click')}
  on:keydown={e => e.key === 'Enter' && dispatch('click')}
>
  <div class="placeholder-content">
    <i class="fas fa-plus"></i>
    <span>Widget hinzufügen</span>
  </div>
</button>

<style>
  .widget-placeholder {
    position: absolute;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s;
  }

  .widget-placeholder:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .placeholder-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: white;
    opacity: 0.7;
  }

  .placeholder-content i {
    font-size: 1.5rem;
  }
</style> 