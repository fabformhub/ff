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

  function selectItem(id, i) {
    blockNo = i;
    changeBlock(i);
  }

  // Only the "normal" blocks are draggable. Welcome/Thank You stay pinned
  // at the start/end and never enter the dndzone, so they can't be reordered.
  let welcomeBlock = $derived(blocks.find(b => b.meta.blockTypeId === WELCOME_TYPE_ID));
  let thankYouBlock = $derived(blocks.find(b => b.meta.blockTypeId === THANK_YOU_TYPE_ID));
  let normalBlocks = $derived(
    blocks.filter(
      b => b.meta.blockTypeId !== WELCOME_TYPE_ID && b.meta.blockTypeId !== THANK_YOU_TYPE_ID
    )
  );

  function handleDndConsider(e) {
    normalBlocks = e.detail.items;
  }

  function handleDndFinalize(e) {
    normalBlocks = e.detail.items;

    // Rebuild the full list in fixed order: Welcome, reordered normals, Thank You.
    const rebuilt = [
      ...(welcomeBlock ? [welcomeBlock] : []),
      ...normalBlocks,
      ...(thankYouBlock ? [thankYouBlock] : [])
    ].map((block, index) => ({ ...block, position: index + 1 }));

    blocks = rebuilt;
    updateBlockPositions?.(rebuilt);
  }

  function getRegistry(block) {
    return blockRegistry.find(r => r.blockTypeId === block.meta.blockTypeId);
  }

  function indexOfBlock(block) {
    return blocks.findIndex(b => b.id === block.id);
  }
</script>

{#snippet blockRow(block)}
  {#if getRegistry(block)}
    <div
      on:click={() => selectItem(block.id, indexOfBlock(block))}
      class={`block-draggable w-full sm:w-72 flex items-center justify-between gap-2 p-2 rounded-md transition-all h-16 group
              ${getRegistry(block)?.bgColor ?? ''}
              ${blockNo === indexOfBlock(block) ? 'border-2 shadow-lg scale-105' : 'border border-gray-300 shadow-sm my-2'}`}
    >
      <div class="flex items-center gap-1 flex-1 text-sm text-gray-800">
        <div class="shrink-0">
          {#if getRegistry(block)?.icon}
            <svelte:component this={getRegistry(block).icon} class="w-5 h-5 text-blue-600" />
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
    <p class="text-gray-500 font-semibold mt-2 mb-1">Welcome</p>
    <div>{@render blockRow(welcomeBlock)}</div>
  {/if}

  {#if normalBlocks.length}
    <p class="text-gray-500 font-semibold mt-2 mb-1">Blocks</p>
  {/if}

  <div
    use:dndzone={{ items: normalBlocks, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each normalBlocks as block (block.id)}
      <div animate:flip={{ duration: flipDurationMs }}>
        {@render blockRow(block)}
      </div>
    {/each}
  </div>

  {#if thankYouBlock}
    <p class="text-gray-500 font-semibold mt-2 mb-1">Thank You Page</p>
    <div>{@render blockRow(thankYouBlock)}</div>
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
