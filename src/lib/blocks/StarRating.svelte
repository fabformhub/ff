<script>
  import Star from '@lucide/svelte/icons/star';
  let {
    canAnswer = true,
    value = $bindable(),
    props = {}
  } = $props();

  let selected = $state(value || 0);
  let hover = $state(0);

  let maxRating = $derived(Number(props?.maxRating ?? 5));

  const labels = {
    1: 'Needs improvement',
    2: 'Could be better',
    3: 'Good',
    4: 'Very good',
    5: 'Excellent'
  };

  let activeRating = $derived(hover || selected);


  $effect(() => {
    selected = value || 0;
  });


  function setRating(rating) {
    if (!canAnswer) return;

    selected = rating;
    value = rating;
  }


  function handleMouseEnter(rating) {
    if (!canAnswer) return;

    hover = rating;
  }


  function handleMouseLeave() {
    hover = 0;
  }


  function handleKeydown(event, rating) {
    if (!canAnswer) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setRating(rating);
    }
  }
</script>


<div class="flex flex-col items-center gap-4">


  <!-- Stars -->
  <div class="flex items-center gap-3">

    {#each Array(maxRating) as _, i}

      {@const rating = i + 1}
      {@const active = rating <= activeRating}

      <button
        type="button"
        disabled={!canAnswer}

        onclick={() => setRating(rating)}

        onmouseenter={() => handleMouseEnter(rating)}
        onmouseleave={handleMouseLeave}

        onfocus={() => handleMouseEnter(rating)}
        onblur={handleMouseLeave}

        onkeydown={(event) => handleKeydown(event, rating)}

        class="
          group
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-xl

          focus:outline-none
          focus:ring-4
          focus:ring-yellow-200

          disabled:cursor-not-allowed
        "
      >

        <span
          class="
            transition-transform
            duration-200
            ease-out

            ${active ? 'scale-110' : 'scale-100'}
            group-hover:scale-110
          "
        >

          <Star
            class={`
              h-10
              w-10

              transition-all
              duration-200

              ${
                active
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_4px_12px_rgba(250,180,0,0.35)]'
                  : 'fill-transparent text-gray-300'
              }
            `}
          />

        </span>

      </button>

    {/each}

  </div>


  <!-- Permanent feedback area -->
  <div
    class="
      h-7
      flex
      items-center
      justify-center

      transition-all
      duration-200
    "
  >

    <span
      class="
        whitespace-nowrap

        text-sm
        font-semibold

        transition-opacity
        duration-200

        ${activeRating ? 'opacity-100 text-gray-800' : 'opacity-0'}
      "
    >
      {labels[activeRating] ?? 'placeholder'}
      {#if activeRating}
        <span class="ml-2 text-gray-400 font-normal">
          {activeRating}/{maxRating}
        </span>
      {/if}
    </span>

  </div>


</div>
