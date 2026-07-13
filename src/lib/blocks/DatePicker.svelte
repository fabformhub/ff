<script>
  import { fly, fade } from 'svelte/transition';
  import Calendar from '@lucide/svelte/icons/calendar';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  
  let {
    value = $bindable(),
    canAnswer = true,
    props = {}
  } = $props();


  let open = $state(false);
  let mode = $state('calendar');

  let selectedDate = $state(
    value ? new Date(value) : null
  );


  let viewDate = $state(
    selectedDate ?? new Date()
  );


  let yearStart = $state(
    new Date().getFullYear() - 6
  );


  const weekdays = [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ];


  let monthLabel = $derived(
    viewDate.toLocaleDateString(
      undefined,
      {
        month: 'long',
        year: 'numeric'
      }
    )
  );


  let selectedLabel = $derived(
    selectedDate
      ? selectedDate.toLocaleDateString(
          undefined,
          {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }
        )
      : 'Choose a date'
  );


  let days = $derived(
    generateCalendar(viewDate)
  );


  let years = $derived(
    Array.from(
      { length: 12 },
      (_, i) => yearStart + i
    )
  );


  function generateCalendar(date) {

    const year = date.getFullYear();
    const month = date.getMonth();

    const first =
      new Date(year, month, 1)
        .getDay();

    const total =
      new Date(year, month + 1, 0)
        .getDate();


    const result = [];


    for (let i = 0; i < first; i++) {
      result.push(null);
    }


    for (let i = 1; i <= total; i++) {

      result.push(
        new Date(year, month, i)
      );

    }


    return result;
  }


  function selectDate(date) {

    selectedDate = date;

    value =
      date.toISOString()
        .split('T')[0];

    open = false;
  }


  function previousMonth() {

    viewDate =
      new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() - 1,
        1
      );

  }


  function nextMonth() {

    viewDate =
      new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + 1,
        1
      );

  }


  function chooseYear(year) {

    viewDate =
      new Date(
        year,
        viewDate.getMonth(),
        1
      );

    mode = 'calendar';

  }


  function previousYears() {
    yearStart -= 12;
  }


  function nextYears() {
    yearStart += 12;
  }


  function isSelected(day) {

    return (
      day &&
      selectedDate &&
      day.toDateString() ===
      selectedDate.toDateString()
    );

  }


  function isToday(day) {

    return (
      day &&
      day.toDateString() ===
      new Date().toDateString()
    );

  }

</script>


<div class="relative w-[360px]">


  <!-- Main trigger -->

  <button
    type="button"

    disabled={!canAnswer}

    onclick={() => open = !open}

    class="
      group

      flex
      w-full

      items-center
      gap-5

      rounded-3xl

      bg-white

      px-6
      py-5

      shadow-[0_20px_60px_rgba(0,0,0,0.08)]

      ring-1
      ring-gray-100

      transition-all
      duration-300

      hover:-translate-y-1

      hover:shadow-xl

      disabled:opacity-50
    "
  >

    <div
      class="
        flex
        h-14
        w-14

        items-center
        justify-center

        rounded-2xl

        bg-indigo-50

        transition

        group-hover:scale-110
      "
    >
      <Calendar class="h-7 w-7 text-indigo-600" />
    </div>


    <div class="text-left">

      <div
        class="
          text-xs
          uppercase
          tracking-widest
          text-gray-400
        "
      >
        Date
      </div>


      <div
        class="
          text-lg
          font-semibold
          text-gray-900
        "
      >
        {selectedLabel}
      </div>

    </div>


  </button>



  {#if open}

    <div
      transition:fly={{ y: 12, duration: 200 }}

      class="
        absolute
        z-50

        mt-4

        w-full

        rounded-3xl

        bg-white

        p-6

        shadow-2xl

        ring-1
        ring-gray-100
      "
    >


      {#if mode === 'calendar'}

        <!-- Header -->

        <div
          class="
            mb-5

            flex
            items-center
            justify-between
          "
        >

          <button
            onclick={previousMonth}
            class="rounded-xl p-2 hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>


          <button
            onclick={() => {
              mode = 'years';
              yearStart = viewDate.getFullYear() - 5;
            }}

            class="
              rounded-xl
              px-4
              py-2

              font-semibold

              hover:bg-gray-100
            "
          >
            {monthLabel}
          </button>


          <button
            onclick={nextMonth}
            class="rounded-xl p-2 hover:bg-gray-100"
          >
            <ChevronRight />
          </button>

        </div>



        <div
          class="
            grid
            grid-cols-7
            mb-2
            text-center
            text-xs
            text-gray-400
          "
        >
          {#each weekdays as day}
            <div>{day}</div>
          {/each}
        </div>



        <div
          class="
            grid
            grid-cols-7
            gap-2
          "
        >

          {#each days as day}

            {#if day}

              <button
                onclick={() => selectDate(day)}

                class={`
                  h-10
                  rounded-xl

                  text-sm
                  transition

                  ${
                    isSelected(day)
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : isToday(day)
                        ? 'ring-2 ring-indigo-300'
                        : 'hover:bg-indigo-50'
                  }
                `}
              >
                {day.getDate()}
              </button>

            {:else}

              <div></div>

            {/if}

          {/each}

        </div>


      {:else}


        <!-- YEAR MODE -->


        <div
          class="
            mb-5
            flex
            items-center
            justify-between
          "
        >

          <button
            onclick={previousYears}
            class="rounded-xl p-2 hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>


          <div class="font-semibold">
            Choose year
          </div>


          <button
            onclick={nextYears}
            class="rounded-xl p-2 hover:bg-gray-100"
          >
            <ChevronRight />
          </button>

        </div>



        <div
          class="
            grid
            grid-cols-3
            gap-3
          "
        >

          {#each years as year}

            <button
              onclick={() => chooseYear(year)}

              class="
                rounded-2xl

                px-4
                py-3

                text-sm
                font-semibold

                transition

                hover:bg-indigo-50
              "
            >
              {year}
            </button>

          {/each}

        </div>


      {/if}


    </div>

  {/if}


</div>
