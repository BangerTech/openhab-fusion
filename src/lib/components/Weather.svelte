<script lang="ts">
  // Hier später die Wetter-API-Integration
  let temperature = "1°C";
  let condition = "Snowy, rainy";
</script>

<div class="weather">
  <div class="current">
    <i class="fas fa-cloud-snow"></i>
    <span class="temp">{temperature}</span>
  </div>
  <div class="condition">{condition}</div>
</div>

<style>
  .weather {
    text-align: center;
    padding: 1rem;
  }

  .current {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.5rem;
  }

  .condition {
    font-size: 0.9rem;
    opacity: 0.8;
  }
</style> 