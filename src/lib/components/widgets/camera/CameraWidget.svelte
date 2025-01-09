<script lang="ts">
  export let widget: any;
  export let isEditing = false;
  export let demo = false;

  $: title = widget.options?.title || widget.item?.label || 'Camera';
  $: showIcon = widget.options?.showIcon ?? true;
  $: showState = widget.options?.showState ?? true;
  $: iconColor = widget.options?.color || '#ffffff';

  let imageUrl = widget.item?.url || 'demo-camera.jpg';
  let isStreaming = false;
  let lastMotion = widget.item?.lastMotion || 'No motion';

  function toggleStream() {
    if (isEditing || demo) return;
    isStreaming = !isStreaming;
  }
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="header" role="banner">
    <div class="icon" style="color: {iconColor}">
      <i class="fas fa-video" aria-hidden="true"></i>
    </div>
    <div class="name" role="heading" aria-level="2">{title}</div>
    <button 
      class="stream-toggle" 
      on:click={toggleStream}
      aria-label={isStreaming ? 'Pause stream' : 'Start stream'}
    >
      <i class="fas fa-{isStreaming ? 'pause' : 'play'}" aria-hidden="true"></i>
    </button>
  </div>

  <div class="content">
    <div class="camera-feed" class:streaming={isStreaming}>
      {#if demo}
        <div class="demo-feed">Demo Camera Feed</div>
      {:else}
        <img src={imageUrl} alt="Camera Feed" />
      {/if}
    </div>
    <div class="info">
      <span class="motion">
        <i class="fas fa-running"></i>
        {lastMotion}
      </span>
    </div>
  </div>
</div>

<style>
  .ha-card {
    width: 100%;
    height: 100%;
    background: var(--ha-card-background, var(--card-background-color, rgb(32, 33, 36)));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2)
    );
    color: var(--primary-text-color);
    transition: all 0.3s ease-in-out;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
  }

  .icon i {
    color: white;
    font-size: 1.2rem;
  }

  .name {
    font-size: 1.1rem;
    font-weight: 500;
    flex: 1;
  }

  .stream-toggle {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: none;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .stream-toggle:hover {
    transform: scale(1.1);
  }

  .content {
    padding: 1rem;
  }

  .camera-feed {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .demo-feed {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.5);
    font-size: 1.2rem;
  }

  .info {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .motion i {
    margin-right: 0.5rem;
  }

  .editing {
    pointer-events: none;
    opacity: 0.7;
  }

  .ha-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow-hover,
      0 3px 3px 0 rgba(0, 0, 0, 0.14),
      0 1px 7px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -1px rgba(0, 0, 0, 0.2)
    );
  }
</style> 