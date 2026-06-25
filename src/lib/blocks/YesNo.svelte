<script>
  let value = $state(null);
</script>

<div class="flex gap-2">
  <button
    class="px-3 py-1 border rounded"
    onclick={() => value = true}
  >
    Yes
  </button>

  <button
    class="px-3 py-1 border rounded"
    onclick={() => value = false}
  >
    No
  </button>
</div>
