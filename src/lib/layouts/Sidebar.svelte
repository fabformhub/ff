<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { DropdownButton } from '$lib/ui';
  import { blockRegistry } from '$lib/utils/blockRegistry.js';
  import { formState, selectBlock } from "$lib/state/form.svelte.js";

  let { onDeleteBlock, onDuplicateBlock } = $props();

  const flipDurationMs = 300;

  function isFixedBlock(block) {
    const type = block?.meta?.type;
    return type === 'welcome' || type === 'thank-you';
  }

  let welcomeBlock = $derived(
    formState.blocks.find(b => b?.meta?.type === 'welcome')
  );
  let thankYouBlock = $derived(
    formState.blocks.find(b => b?.meta?.type === 'thank-you')
  );

  // Local dnd-owned copy
  let localBlocks = $state([]);
  $effect(() => {
    localBlocks = formState.blocks.filter(b => !isFixedBlock(b));
  });

  function getRegistry(block) {
    return blockRegistry.find(r => r.type === block?.meta?.type);
  }

  function handleDndConsider(e) {
    localBlocks = e.detail.items;
  }

  async function handleDndFinalize(e) {
    localBlocks = e.detail.items;

    const reordered = [welcomeBlock, ...e.detail.items, thankYouBlock]
      .filter(Boolean)
      .map((block, index) => ({ ...block, position: index }));

    formState.blocks = reordered;
  }
</script>

{#snippet blockRow(block, label)}
  {@const registry = getRegistry(block)}
  {#if registry}
    {#if label}
      <p class="mt-2 mb-1 font-semibold text-gray-500">{label}</p>
    {/if}
    <div
      onclick={() => selectBlock(formState.blocks.findIndex(b => b.id === block.id))}
      class={`block-draggable group flex h-16 w-full sm:w-72 items-center justify-between gap-2 rounded-md p-2 transition-all
              ${registry.bgColor ?? ''}
              ${formState.blocks[formState.blockNo]?.id === block.id ? 'scale-105 border-2 shadow-lg' : 'my-2 border border-gray-300 shadow-sm'}`}
    >
      <div class="flex flex-1 items-center gap-1 text-sm text-gray-800">
        <div class="shrink-0">
          {#if registry.icon}
            <svelte:component this={registry.icon} class="h-5 w-5 text-blue-600" />
          {/if}
        </div>
        <span class="mx-2 block truncate">
          {block.meta?.title || block.meta?.question}
        </span>
      </div>
      <div class="pointer-events-auto relative shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <DropdownButton
          dropdownItems={[
            { label: 'Duplicate', icon: 'Duplicate', onClick: () => onDuplicateBlock(block.id) },
            { label: 'Delete', icon: 'Delete', onClick: () => onDeleteBlock(block.id) }
          ]}
        />
      </div>
    </div>
  {/if}
{/snippet}

<section class="min-h-[100px] overflow-hidden p-2 space-y-1 pb-20">
  {#if welcomeBlock}
    {@render blockRow(welcomeBlock, 'Welcome')}
  {/if}

  <div
    use:dndzone={{ items: localBlocks, flipDurationMs }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each localBlocks as block, i (block.id)}
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
