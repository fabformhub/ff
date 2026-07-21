<script>
  let {
    canAnswer = false,
    value = $bindable(),

    start = 0,
    end = 10,
    leftLabel = "",
    rightLabel = ""
  } = $props();

  const min = $derived(Number(start));
  const max = $derived(Number(end));

  let selected = $state(value);

  $effect(() => {
    if (value !== selected) {
      selected = value;
    }
  });

  const numbers = $derived.by(() => {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
      return [];
    }

    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  });

  function selectValue(num) {
    if (!canAnswer) return;

    selected = num;
    value = num;
  }
</script>

<div class="w-full max-w-5xl mx-auto">

  <div
    class="flex justify-center gap-3 sm:gap-4 flex-wrap"
  >
    {#each numbers as num}
      <button
        type="button"
        onclick={() => selectValue(num)}
        disabled={!canAnswer}
        aria-pressed={selected === num}
        class={`
          group relative
          h-14 w-14
          sm:h-16 sm:w-16
          rounded-full
          text-base
          font-semibold
          transition-all
          duration-300
          ease-out
          select-none
          border

          ${
            selected === num
              ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-110"
              : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-1 hover:shadow-lg"
          }

          ${
            canAnswer
              ? "cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }
        `}
      >
        <span
          class={`transition-transform duration-300 ${
            selected === num ? "scale-110" : "group-hover:scale-110"
          }`}
        >
          {num}
        </span>

        {#if selected === num}
          <span
            class="absolute inset-0 rounded-full ring-4 ring-indigo-400/20 animate-pulse pointer-events-none"
          />
        {/if}
      </button>
    {/each}
  </div>

  <div
    class="mt-6 flex justify-between text-sm font-medium text-slate-500"
  >
    <span>{leftLabel}</span>
    <span>{rightLabel}</span>
  </div>

</div>
