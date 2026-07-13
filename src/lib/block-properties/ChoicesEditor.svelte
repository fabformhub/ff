<script>
  import { flip } from 'svelte/animate';
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';

  import Plus from '@lucide/svelte/icons/plus';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import GripVertical from '@lucide/svelte/icons/grip-vertical';

  let { choices = $bindable([]) } = $props();

  let nextId = 1;

  let items = $state(
    choices.map((value) => ({
      id: nextId++,
      value
    }))
  );

  let editingId = $state(null);
  let hoveredId = $state(null);
  let dragging = $state(false);

  let inputRefs = {};


  function choiceLetter(index) {
    let result = '';
    index++;

    while (index > 0) {
      index--;

      result =
        String.fromCharCode(65 + (index % 26)) + result;

      index = Math.floor(index / 26);
    }

    return result;
  }


  function syncChoices() {
    choices = items
      .filter(item => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME])
      .map(item => item.value);
  }


  function focusInput(id) {
    requestAnimationFrame(() => {
      inputRefs[id]?.focus();
    });
  }


  function addChoice(index = items.length) {

    const newItem = {
      id: nextId++,
      value: ''
    };

    items = [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index)
    ];

    editingId = newItem.id;

    syncChoices();

    focusInput(newItem.id);
  }


  function updateChoice(id, value) {

    items = items.map(item =>
      item.id === id
        ? { ...item, value }
        : item
    );

    syncChoices();
  }


  function deleteChoice(id) {

    items = items.filter(
      item => item.id !== id
    );

    editingId = null;

    syncChoices();
  }


  function handleKeydown(event, item, index) {

    if (event.key === 'Enter') {
      event.preventDefault();
      addChoice(index + 1);
    }


    if (
      event.key === 'Backspace' &&
      item.value === ''
    ) {
      event.preventDefault();
      deleteChoice(item.id);
    }


    if (event.key === 'Escape') {
      editingId = null;
    }
  }


  function handleConsider(event) {
    dragging = true;
    items = event.detail.items;
  }


  function handleFinalize(event) {
    dragging = false;
    items = event.detail.items;
    syncChoices();
  }

</script>


<div class="w-full max-w-xl space-y-4">


  <!-- Header -->

  <div class="flex items-center justify-between">

    <h3
      class="
        text-sm
        font-semibold
        tracking-tight
        text-zinc-700
      "
    >
      Choices
    </h3>


    <button
      onclick={() => addChoice()}
      title="Add choice"

      class="
        flex
        items-center
        justify-center
        w-8
        h-8
        rounded-xl
        text-zinc-400
        hover:text-indigo-600
        hover:bg-indigo-50
        transition-all
      "
    >
      <Plus
        size={18}
        strokeWidth={2}
      />
    </button>

  </div>



  {#if items.length === 0}


    <button
      onclick={() => addChoice()}

      class="
        w-full
        h-28
        rounded-2xl
        border
        border-dashed
        border-zinc-200
        text-zinc-400
        hover:border-indigo-300
        hover:bg-indigo-50/50
        hover:text-indigo-600
        transition
      "
    >
      <Plus
        size={22}
        class="mx-auto mb-2"
      />

      Add your first choice

    </button>


  {:else}



    <ul
      use:dndzone={{
        items,
        flipDurationMs:250,
        dragHandleSelector:'.drag-handle'
      }}

      onconsider={handleConsider}
      onfinalize={handleFinalize}

      class="space-y-3"
    >


      {#each items as item,index (item.id)}


        <li
          animate:flip={{ duration:250 }}
          class="h-16"
        >


          {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}


            <div
              class="
                h-full
                rounded-xl
                border
                border-dashed
                border-indigo-300
                bg-indigo-50
              "
            />


          {:else}


            <div

              onmouseenter={() => hoveredId=item.id}
              onmouseleave={() => hoveredId=null}

              class="
                group
                flex
                items-center
                gap-3
                h-full
                px-4
                rounded-xl
                bg-white
                border
                border-zinc-200
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                transition-all
                duration-200
              "

              class:hover:shadow-lg={hoveredId === item.id}
              class:hover:-translate-y-0.5={hoveredId === item.id}
              class:border-indigo-300={editingId === item.id}
              class:bg-indigo-50={editingId === item.id}
              class:opacity-70={dragging}
            >



              <!-- Drag -->

              <div
                class="
                  drag-handle
                  flex
                  items-center
                  opacity-0
                  group-hover:opacity-100
                  cursor-grab
                  text-zinc-300
                  hover:text-zinc-600
                  transition
                "
              >
                <GripVertical
                  size={17}
                  strokeWidth={1.8}
                />
              </div>




              <!-- Letter -->

              <div
                class="
                  flex
                  items-center
                  justify-center
                  w-8
                  h-8
                  rounded-lg
                  bg-zinc-100
                  text-zinc-500
                  text-xs
                  font-bold
                  group-hover:bg-indigo-100
                  group-hover:text-indigo-600
                  transition
                "
              >
                {choiceLetter(index)}
              </div>




              <!-- Value -->

              {#if editingId === item.id}

<input
  bind:this={inputRefs[item.id]}

  value={item.value}

  oninput={(e) =>
    updateChoice(
      item.id,
      e.target.value
    )
  }

  onkeydown={(e) =>
    handleKeydown(
      e,
      item,
      index
    )
  }

  onblur={() =>
    editingId=null
  }

  placeholder="Choice"

  class="
    flex-1
    bg-transparent
    outline-none
    text-[15px]
    font-medium
    text-zinc-800
    placeholder:text-zinc-300
    placeholder:font-normal
  "
/>
                
              {:else}


                <button
                  onclick={() => {
                    editingId=item.id;
                    focusInput(item.id);
                  }}

                  class="
                    flex-1
                    text-left
                    text-[15px]
                    font-medium
                    tracking-tight
                    text-zinc-800
                  "
                >
                  {item.value || "Untitled choice"}
                </button>


              {/if}





              {#if hoveredId === item.id}

                <button
                  onclick={() => deleteChoice(item.id)}

                  title="Delete"

                  class="
                    p-2
                    rounded-lg
                    text-zinc-300
                    hover:text-red-500
                    hover:bg-red-50
                    transition
                  "
                >
                  <Trash2 size={16}/>
                </button>

              {/if}



            </div>


          {/if}


        </li>


      {/each}


    </ul>



    <button
      onclick={() => addChoice()}

      class="
        flex
        items-center
        justify-center
        gap-1
        w-full
        h-12
        rounded-xl
        border
        border-dashed
        border-zinc-200
        text-sm
        text-zinc-400
        hover:text-indigo-600
        hover:border-indigo-300
        hover:bg-indigo-50/50
        transition
      "
    >

      <Plus size={15}/>

      Add option

    </button>


  {/if}


</div>


<style>
  .drag-handle {
    touch-action: none;
    user-select: none;
  }
</style>
