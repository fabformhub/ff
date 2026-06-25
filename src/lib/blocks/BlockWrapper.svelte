<script>
  let { block, children } = $props();
</script>

<div class="space-y-3">

  <!-- SHARED HEADER -->
  <div class="space-y-1">
    <div class="text-lg font-semibold">
      {block.title || "Untitled"}
    </div>

    <div class="text-sm text-slate-500">
      {block.description || ""}
    </div>
  </div>

  <!-- CONTROL SLOT -->
  <div>
    {#if children}
      {@render children()}
    {/if}
  </div>

</div>
