<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { DropdownButton } from '$lib/ui';
  import { blockRegistry } from '$lib/utils/blockRegistry.js';

  let {
    blocks = $bindable([]),
    blockNo = $bindable(null),
    changeBlock,
    deleteBlock,
    duplicateBlock,
    updateBlockPositions
  } = $props();

  const flipDurationMs = 300;
  const WELCOME_TYPE_ID = 1;
  const THANK_YOU_TYPE_ID = 99;

  // Welcome and Thank You are fixed-position blocks: always first/last,
  // never draggable. Everything else is a normal, reorderable block.
  function isFixedBlock(block) {
    return block.meta.blockTypeId === WELCOME_TYPE_ID || block.meta.blockTypeId === THANK_YOU_TYPE_ID;
  }

  let welcomeBlock = $derived(blocks.find(b => b.meta.blockTypeId === WELCOME_TYPE_ID));
  let thankYouBlock = $derived(blocks.find(b => b.meta.blockTypeId === THANK_YOU_TYPE_ID));
  let normalBlocks = $derived(blocks.filter(b => !isFixedBlock(b)));

  function selectBlock(block) {
    const i = blocks.findIndex(b => b.id === block.id);
    blockNo = i;
    changeBlock(i);
  }

  function getRegistry(block) {
    return blockRegistry.find(r => r.blockTypeId === block.meta.blockTypeId);
  }

  // Only normal blocks pass through the dndzone, so dragging can only
  // ever reorder them - Welcome/Thank You stay pinned at the ends.
  function handleDndConsider(e) {
    normalBlocks = e.detail.items;
  }

  function handleDndFinalize(e) {
    const reordered = [welcomeBlock, ...e.detail.items, thankYouBlock]
      .filter(Boolean)
      .map((block, index) => ({ ...block, position: index + 1 }));

    blocks = reordered;
    updateBlockPositions?.(reordered);
  }
</script>

{#snippet blockRow(block, label)}
  {@const registry = getRegistry(block)}
  {#if registry}
    {#if label}<p class="text-gray-500 font-semibold mt-2 mb-1">{label}</p>{/if}
    <div
      on:click={() => selectBlock(block)}
      class={`block-draggable w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group
              ${registry.bgColor ?? ''}
              ${blocks[blockNo]?.id === block.id ? 'border-2 shadow-lg scale-105' : 'border border-gray-300 shadow-sm my-2'}`}
    >
      <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
        <div class="shrink-0">
          {#if registry.icon}
            <svelte:component this={registry.icon} class="w-5 h-5 text-blue-600" />
          {/if}
        </div>
        <span class="truncate mx-2 block">
          {block.meta.title || block.meta.question}
        </span>
      </div>
      <div class="shrink-0 pointer-events-auto relative opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <DropdownButton
          dropdownItems={[
            { label: 'Duplicate', icon: 'Duplicate', onClick: () => duplicateBlock(block.id) },
            { label: 'Delete', icon: 'Delete', onClick: () => deleteBlock(block.id) }
          ]}
        />
      </div>
    </div>
  {/if}
{/snippet}

<section class="p-2 space-y-1 min-h-[100px] pb-20 overflow-hidden">
  {#if welcomeBlock}
    {@render blockRow(welcomeBlock, 'Welcome')}
  {/if}

  <div
    use:dndzone={{ items: normalBlocks, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each normalBlocks as block, i (block.id)}
      <div animate:flip={{ duration: flipDurationMs }}>
        {@render blockRow(block, i === 0 ? 'Blocks' : null)}
      </div>
    {/each}
  </div>

  {#if thankYouBlock}
    {@render blockRow(thankYouBlock, 'Thank You Page')}
  {/if}
</section>

<style>
  .block-draggable.svelte-dnd-dragged {
    opacity: 0.6;
    transform: scale(1.03);
  }
  .block-draggable.svelte-dnd-placeholder {
    border: 2px dashed #3b82f6;
    background-color: #f0f9ff;
  }
</style>
