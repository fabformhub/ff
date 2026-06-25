<script>
  let open = $state(false);
  let selected = $state(null);
</script>

<div class="space-y-2 relative">

  <button
    class="w-full border rounded-lg p-2 text-left"
    onclick={() => open = !open}
  >
    {selected ?? "Select an option"}
  </button>

  {#if open}
    <div class="absolute w-full mt-1 bg-white border rounded-lg shadow z-10">
      {#each ["Option A", "Option B", "Option C"] as opt}
        <button
          class="block w-full text-left p-2 hover:bg-slate-100"
          onclick={() => {
            selected = opt;
            open = false;
          }}
        >
          {opt}
        </button>
      {/each}
    </div>
  {/if}

</div>
