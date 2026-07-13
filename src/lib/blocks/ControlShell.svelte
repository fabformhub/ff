<script>
  let { canAnswer = false, children } = $props();
</script>

<div class="relative w-full">

  <!-- CHILD CONTROL -->
  <div class="peer w-full">
    {@render children()}
  </div>

  <!-- UNDERLINE ANIMATION (Answer Mode Only) -->
  {#if canAnswer}
    <span
      class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500
             transition-all duration-300 peer-focus:w-full">
    </span>
  {/if}

</div>

