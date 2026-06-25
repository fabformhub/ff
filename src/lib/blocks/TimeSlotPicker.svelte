<script>
  let selected = $state(null);
</script>

<div class="grid grid-cols-3 gap-2 text-sm">
  {#each ["09:00","10:00","11:00","14:00","15:00","16:00"] as t}
    <button
      class="border rounded p-1 hover:bg-blue-100"
      onclick={() => selected = t}
    >
      {t}
    </button>
  {/each}
</div>
