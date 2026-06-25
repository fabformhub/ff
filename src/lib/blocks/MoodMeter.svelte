<script>
  let mood = $state(null);
</script>

<div class="flex gap-2 text-xl">
  {#each ["😡","😕","😐","🙂","😁"] as m}
    <button onclick={() => mood = m}>
      {m}
    </button>
  {/each}
</div>
