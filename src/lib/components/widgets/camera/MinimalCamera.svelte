<script lang="ts">
  export let widget: any;
  export let isEditing = false;
  export let demo = false;

  let imageUrl = widget.item?.url || 'demo-camera.jpg';
  let lastMotion = widget.item?.lastMotion || 'No motion';
</script>

<div class="ha-card" class:editing={isEditing}>
  <div class="content">
    <div class="icon">
      <i class="fas fa-video"></i>
    </div>
    <div class="info">
      <span class="name">{widget.item?.name || 'Camera'}</span>
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
    padding: 1rem;
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
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon i {
    color: white;
    font-size: 1.2rem;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .name {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .motion {
    font-size: 0.9rem;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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