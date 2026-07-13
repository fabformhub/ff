<script>
  import Minus from '@lucide/svelte/icons/minus';
  import Plus from '@lucide/svelte/icons/plus';
  let {
    value = $bindable(),
    canAnswer = true,
    min = 0,
    max = 999999,
    step = 1,
    prefix = '',
    suffix = '',
    label = 'Number'
  } = $props();


  let number = $state(String(value ?? ''));
  let focused = $state(false);
  let pressed = $state(null);


  $effect(() => {
    if (!focused) {
      number = String(value ?? '');
    }
  });


  function updateNumber(next) {

    let parsed = Number(next);

    if (Number.isNaN(parsed)) {
      number = '';
      value = '';
      return;
    }


    parsed = Math.min(
      max,
      Math.max(min, parsed)
    );


    number = String(parsed);
    value = parsed;
  }



  function change(amount) {

    if (!canAnswer) return;

    updateNumber(
      Number(number || 0) + amount
    );
  }



  function handleBeforeInput(e) {

    if (!e.data) return;

    if (!/^\d+$/.test(e.data)) {
      e.preventDefault();
    }
  }



  function handlePaste(e) {

    const text =
      e.clipboardData.getData('text');

    if (!/^\d+$/.test(text)) {
      e.preventDefault();
    }
  }



  function handleInput(e) {

    const clean =
      e.target.value.replace(/\D/g,'');

    number = clean;

    value =
      clean === ''
        ? ''
        : Number(clean);
  }


  function handleBlur() {

    focused = false;

    if (number !== '') {
      updateNumber(number);
    }
  }
</script>


<div
  class="
    flex
    flex-col
    items-center
    gap-4
  "
>


  <div
    class="
      text-xs
      font-semibold
      uppercase
      tracking-[0.28em]
      text-gray-400
    "
  >
    {label}
  </div>


  <div
    class="
      relative

      flex
      items-center

      rounded-[26px]

      bg-white

      px-3
      py-3

      shadow-[0_18px_50px_rgba(0,0,0,0.07)]

      ring-1
      ring-gray-100

      transition-all
      duration-300

      ${focused
        ? 'shadow-[0_25px_70px_rgba(99,102,241,0.18)] ring-indigo-200'
        : ''}
    "
  >


    <!-- Minus -->

    <button
      type="button"

      onclick={() => change(-step)}

      onmousedown={() => pressed='minus'}
      onmouseup={() => pressed=null}
      onmouseleave={() => pressed=null}

      disabled={!canAnswer}

      class="
        group

        flex
        h-9
        w-9

        items-center
        justify-center

        rounded-full

        bg-gray-50

        text-gray-500

        transition-all
        duration-200

        hover:bg-gray-100
        hover:text-gray-900

        active:scale-90

        disabled:opacity-40
      "
    >

      <Minus
        class="
          h-4
          w-4

          transition-transform
          duration-200

          group-hover:scale-125
        "
      />

    </button>



    <!-- Value -->

    <div
      class="
        mx-5

        flex
        items-center
        justify-center
      "
    >

      {#if prefix}
        <span class="text-lg font-medium text-gray-400">
          {prefix}
        </span>
      {/if}


      <input
        value={number}

        onbeforeinput={handleBeforeInput}

        onpaste={handlePaste}

        oninput={handleInput}

        onfocus={() => focused=true}

        onblur={handleBlur}

        inputmode="numeric"

        pattern="[0-9]*"

        class="
          w-20

          bg-transparent

          text-center

          text-3xl

          font-bold

          tracking-tight

          text-gray-900

          outline-none
        "
      />


      {#if suffix}
        <span class="text-lg font-medium text-gray-400">
          {suffix}
        </span>
      {/if}

    </div>



    <!-- Plus -->

    <button
      type="button"

      onclick={() => change(step)}

      onmousedown={() => pressed='plus'}
      onmouseup={() => pressed=null}
      onmouseleave={() => pressed=null}

      disabled={!canAnswer}

      class="
        group

        flex
        h-9
        w-9

        items-center
        justify-center

        rounded-full

        bg-gray-50

        text-gray-500

        transition-all
        duration-200

        hover:bg-gray-100
        hover:text-gray-900

        active:scale-90

        disabled:opacity-40
      "
    >

      <Plus
        class="
          h-4
          w-4

          transition-transform
          duration-200

          group-hover:scale-125
        "
      />

    </button>


  </div>


</div>
