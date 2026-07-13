<script>
  import { scale } from 'svelte/transition';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Check from '@lucide/svelte/icons/check';
  let {
    value = $bindable(),
    choices = []
  } = $props();

  console.log('Dropdown choices:', JSON.stringify(choices, null, 2));

  let isOpen = $state(false);
  let selected = $state(value ?? null);

  let UIchoices = $derived(choices ?? []);


  function toggleDropdown() {
    isOpen = !isOpen;
  }


  function selectOption(option) {
    selected = option;
    value = option;
    isOpen = false;
  }
</script>


<div class="relative w-full max-w-md">

  <!-- Selected value -->
  <button
    type="button"
    onclick={toggleDropdown}
    class="
      group
      flex
      w-full
      items-center
      justify-between
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-6
      py-4
      text-left
      shadow-sm
      transition-all
      duration-200
      hover:border-gray-300
      hover:shadow-lg
      focus:outline-none
      focus:ring-4
      focus:ring-gray-100
    "
  >

    <span
      class="
        truncate
        text-base
        font-medium
        text-gray-800
      "
    >
      {selected ?? 'Choose an option'}
    </span>


    <ChevronDown
      class={`
        h-5
        w-5
        text-gray-400
        transition-transform
        duration-300
        ${isOpen ? 'rotate-180' : ''}
      `}
    />

  </button>


  {#if isOpen}

    <div
      transition:scale={{ duration: 150 }}
      class="
        absolute
        left-0
        right-0
        z-50
        mt-3
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-2
        shadow-xl
      "
    >

      {#if UIchoices.length === 0}

        <div
          class="
            px-5
            py-4
            text-sm
            text-gray-400
          "
        >
          No choices available
        </div>

      {:else}

        {#each UIchoices as option}

          <button
            type="button"
            onclick={() => selectOption(option)}
            class="
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              px-5
              py-3
              text-left
              text-gray-700
              transition-all
              duration-150
              hover:bg-gray-50
              hover:text-gray-900
            "
          >

            <span>
              {option}
            </span>


            {#if selected === option}

              <Check
                class="
                  h-5
                  w-5
                  text-gray-700
                "
              />

            {/if}

          </button>

        {/each}

      {/if}

    </div>

  {/if}

</div>
