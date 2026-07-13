<script>
  import AlignLeft  from "@lucide/svelte/icons/align-left";
  import AlignCenter from "@lucide/svelte/icons/align-center";

  let { textAlign = $bindable() } = $props();

  const setAlign = (value) => {
    textAlign = value;
  };

  const isActive = (value) => textAlign === value;
</script>

<div class="flex items-center gap-2 p-1 w-fit bg-gray-100 rounded-lg border">

  <!-- LEFT -->
  <button
    type="button"
    onclick={() => setAlign('left')}
    aria-pressed={isActive('left')}
    class={`
      flex items-center justify-center w-10 h-10 rounded-md border
      transition-all duration-150
      ${isActive('left')
        ? 'bg-gray-300 shadow-inner'
        : 'bg-white hover:bg-gray-50 shadow-sm'
      }
    `}
  >
    <AlignLeft class="w-4 h-4 text-gray-800" />
  </button>

  <!-- CENTER -->
  <button
    type="button"
    onclick={() => setAlign('center')}
    aria-pressed={isActive('center')}
    class={`
      flex items-center justify-center w-10 h-10 rounded-md border
      transition-all duration-150
      ${isActive('center')
        ? 'bg-gray-300 shadow-inner'
        : 'bg-white hover:bg-gray-50 shadow-sm'
      }
    `}
  >
    <AlignCenter class="w-4 h-4 text-gray-800" />
  </button>
</div>
