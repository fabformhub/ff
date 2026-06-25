<script>
  let {} = $props();
  let rating = $state(0);
</script>

<div class="flex gap-1 text-2xl cursor-pointer">
  {#each [1,2,3,4,5] as i}
    <span
      onclick={() => rating = i}
      class={i <= rating ? "text-yellow-400" : "text-slate-300"}
    >
      ★
    </span>
  {/each}
</div>
