<script>
  import { registry } from '$lib/registry/blocks';

  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';

  import BlockWrapper from '$lib/blocks/BlockWrapper.svelte';
  import { fade, scale } from 'svelte/transition';

  let blocks = $state([]);
  let selectedId = $state(null);
  let draggingId = $state(null);

  let addOpen = $state(false);
  let deleteOpen = $state(false);
  let deleteTarget = $state(null);

  const map = Object.fromEntries(registry.map(r => [r.type, r.component]));
  const meta = Object.fromEntries(registry.map(r => [r.type, r]));

  const selectedBlock = $derived(
    blocks.find(b => b.id === selectedId)
  );

  function addBlock(type) {
    const def = registry.find(r => r.type === type);

    const block = {
      id: crypto.randomUUID(),
      type,
      title: def?.defaultTitle ?? '',
      description: def?.defaultDescription ?? ''
    };

    blocks = [...blocks, block];
    selectedId = block.id;
  }

  function selectBlock(id) {
    selectedId = id;
  }

  function moveBlock(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;

    const from = blocks.findIndex(b => b.id === fromId);
    const to = blocks.findIndex(b => b.id === toId);

    if (from === -1 || to === -1) return;

    const copy = [...blocks];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);

    blocks = copy;
  }

  function openDelete(id) {
    deleteTarget = id;
    deleteOpen = true;
  }

  function confirmDelete() {
    blocks = blocks.filter(b => b.id !== deleteTarget);
    if (selectedId === deleteTarget) selectedId = null;

    deleteOpen = false;
    deleteTarget = null;
  }
</script>

<div class="h-screen bg-[#F5F3F0] text-[#1F2933] flex flex-col">
  <div class="flex-1 grid grid-cols-[320px_1fr_320px]">

    <!-- OUTLINE -->
    <aside class="border-r border-[#E0D7CA] bg-[#F5F3F0] p-5 space-y-4 overflow-auto">
      <div class="flex items-center justify-between mb-2">
        <div class="text-[11px] font-semibold text-[#8C7C68] tracking-[0.16em] uppercase">
          Outline
        </div>
        <div class="text-[11px] text-[#A0907A]">
          {blocks.length} blocks
        </div>
      </div>

      <!-- small circular add button -->
      <div class="flex items-center gap-2 mb-3">
        <button
          type="button"
          class="w-8 h-8 rounded-full bg-[#FDFBF7] border border-[#D6C9B5] text-[#2F2922] flex items-center justify-center text-sm shadow-sm hover:bg-[#F0E7D9] active:scale-[0.97] transition"
          title="Add block"
          onclick={() => addOpen = true}
        >
          +
        </button>
        <span class="text-[11px] text-[#8C7C68]">
          Add block
        </span>
      </div>

      <div class="space-y-2">
        {#if blocks.length === 0}
          <div class="mt-1 text-xs text-[#8C7C68] bg-[#F0E7D9] border border-dashed border-[#D6C9B5] rounded-2xl p-4">
            Start by adding your first block. Each step becomes a card in your form.
          </div>
        {/if}

        {#each blocks as block (block.id)}
          {@const m = meta[block.type]}

          <div
            class="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer border border-transparent transition"
            style={`background:${m.color};`}
            draggable="true"
            ondragstart={() => draggingId = block.id}
            ondragover={(e) => e.preventDefault()}
            ondrop={() => {
              moveBlock(draggingId, block.id);
              draggingId = null;
            }}
            onclick={() => selectBlock(block.id)}
          >
            <div class="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-base font-semibold text-[#1F2933] shadow-sm">
              {m.icon}
            </div>

            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-[#111827] truncate">
                {block.title || m.label}
              </div>
              <div class="text-[11px] text-[#374151] truncate">
                {m.defaultDescription}
              </div>
            </div>

            <button
              type="button"
              class="opacity-0 group-hover:opacity-100 text-[11px] px-2 py-1 rounded-full bg-white/70 text-[#6B7280] hover:bg-white hover:text-[#111827] transition"
              onclick={(e) => {
                e.stopPropagation();
                openDelete(block.id);
              }}
              aria-label="Delete"
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
    </aside>

    <!-- PREVIEW -->
    <main class="relative p-10 flex justify-center items-start bg-[#F2E9DC]">

      <!-- floating + button -->
      {#if blocks.length === 0}
        <button
          type="button"
          class="absolute inset-x-0 mx-auto top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#FDFBF7] border border-[#D6C9B5] text-[#2F2922] flex items-center justify-center text-xl shadow-[0_10px_30px_rgba(47,41,34,0.18)] hover:bg-[#F0E7D9] active:scale-[0.97] transition"
          title="Add block"
          onclick={() => addOpen = true}
        >
          +
        </button>
      {:else}
        <button
          type="button"
          class="absolute inset-x-0 mx-auto bottom-8 w-14 h-14 rounded-full bg-[#FDFBF7] border border-[#D6C9B5] text-[#2F2922] flex items-center justify-center text-xl shadow-[0_10px_30px_rgba(47,41,34,0.18)] hover:bg-[#F0E7D9] active:scale-[0.97] transition"
          title="Add block"
          onclick={() => addOpen = true}
        >
          +
        </button>
      {/if}

      {#if blocks.length === 0}
        <div
          class="flex flex-col items-center justify-center text-[#8C7C68] text-sm gap-5 bg-[#FDFBF7] border border-[#E0D7CA] rounded-3xl p-10 max-w-xl shadow-[0_18px_60px_rgba(47,41,34,0.08)]"
        >
          <div class="relative w-52 h-34">
            <svg viewBox="0 0 240 160" class="w-full h-full">
              <defs>
                <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F7F3EE" />
                  <stop offset="100%" stop-color="#E7E1D7" />
                </linearGradient>
              </defs>
              <rect x="30" y="40" rx="18" ry="18" width="180" height="90" fill="url(#cardBg)" stroke="#D6C9B5" stroke-width="1.2" />
              <rect x="46" y="54" rx="6" ry="6" width="70" height="10" fill="#D6C9B5" />
              <circle cx="54" cy="80" r="4" fill="#FCE7F3" />
              <rect x="64" y="76" rx="4" ry="4" width="50" height="8" fill="#E0D9CD" />
              <circle cx="54" cy="100" r="4" fill="#DBEAFE" />
              <rect x="64" y="96" rx="4" ry="4" width="65" height="8" fill="#E0D9CD" />
            </svg>
          </div>

          <div class="text-base font-semibold text-[#2F2922]">
            Create your first block
          </div>
          <div class="text-xs text-[#8C7C68] text-center max-w-xs">
            Design your flow step by step. Each block becomes a card in your form.
          </div>
        </div>
      {:else if !selectedBlock}
        <div
          class="flex flex-col items-center justify-center text-[#8C7C68] text-sm gap-4 bg-[#FDFBF7] border border-[#E0D7CA] rounded-3xl p-10 max-w-xl shadow-[0_18px_60px_rgba(47,41,34,0.06)]"
        >
          <div class="relative w-40 h-28">
            <svg viewBox="0 0 200 120" class="w-full h-full">
              <defs>
                <linearGradient id="cardBg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F7F3EE" />
                  <stop offset="100%" stop-color="#E7E1D7" />
                </linearGradient>
              </defs>
              <rect x="25" y="32" rx="16" ry="16" width="150" height="76" fill="url(#cardBg2)" stroke="#D6C9B5" stroke-width="1.2" />
              <rect x="40" y="50" rx="5" ry="5" width="80" height="8" fill="#E0D9CD" />
              <rect x="40" y="66" rx="5" ry="5" width="60" height="8" fill="#E5DED2" />
              <rect x="40" y="82" rx="5" ry="5" width="90" height="8" fill="#E0D9CD" />
            </svg>
          </div>

          <div class="text-base font-semibold text-[#2F2922]">
            No block selected
          </div>
          <div class="text-xs text-[#8C7C68] text-center max-w-xs">
            Choose a block from the outline to see its live preview here.
          </div>
        </div>
      {:else}
        {@const Component = map[selectedBlock.type]}
        <div transition:fade={{ duration: 150 }}>
          <div
            class="w-full max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-[0_18px_60px_rgba(47,41,34,0.12)] border border-[#E0D7CA] overflow-hidden"
            transition:scale={{ duration: 150, start: 0.98 }}
          >
            <div class="px-6 pt-5 pb-4 border-b border-[#E0D7CA] bg-[#F7F3EE]">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-base font-semibold text-[#111827] shadow-sm"
                  >
                    {meta[selectedBlock.type].icon}
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-[#111827] truncate">
                      {selectedBlock.title || meta[selectedBlock.type].label}
                    </div>
                    <div class="text-[11px] text-[#6B7280] truncate">
                      {selectedBlock.description || meta[selectedBlock.type].defaultDescription}
                    </div>
                  </div>
                </div>
                <span class="text-[11px] px-2.5 py-1 rounded-full bg-[#FDFBF7] border border-[#E0D7CA] text-[#8C7C68]">
                  Live preview
                </span>
              </div>
            </div>

            <div class="p-6 bg-[#FDFBF7]">
              <div class="rounded-2xl border border-[#E0D7CA] bg-[#F7F3EE] p-5">
                <BlockWrapper block={selectedBlock}>
                  <Component />
                </BlockWrapper>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </main>

    <!-- PROPERTIES -->
    <aside class="border-l border-[#E0D7CA] bg-[#F5F3F0] p-6 space-y-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold text-xs text-[#8C7C68] tracking-[0.16em] uppercase">
          Properties
        </h2>
        {#if selectedBlock}
          <span class="text-[11px] px-2.5 py-1 rounded-full bg-[#FDFBF7] border border-[#E0D7CA] text-[#8C7C68] flex items-center gap-1.5">
            {meta[selectedBlock.type].label}
          </span>
        {/if}
      </div>

      {#if selectedBlock}
        <div class="space-y-4">
          <div class="space-y-1">
            <label class="text-[11px] font-medium text-[#8C7C68] uppercase tracking-wide">
              Title
            </label>
            <Input
              bind:value={selectedBlock.title}
              placeholder="Block title"
              class="bg-[#FDFBF7] border-[#D6C9B5] text-xs text-[#111827] placeholder:text-[#A0907A] rounded-xl focus:border-[#111827] focus:ring-1 focus:ring-[#111827]/30"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-medium text-[#8C7C68] uppercase tracking-wide">
              Description
            </label>
            <Textarea
              bind:value={selectedBlock.description}
              placeholder="Describe this block so future-you knows what it does."
              class="bg-[#FDFBF7] border-[#D6C9B5] text-xs text-[#111827] placeholder:text-[#A0907A] rounded-xl min-h-[120px] focus:border-[#111827] focus:ring-1 focus:ring-[#111827]/30"
            ></Textarea>
          </div>
        </div>
      {:else}
        <div class="text-[#8C7C68] text-xs bg-[#F0E7D9] border border-[#E0D7CA] rounded-2xl p-4">
          Select a block from the outline to edit its title and description.
        </div>
      {/if}
    </aside>
  </div>
</div>

<!-- ADD DIALOG -->
<Dialog.Root bind:open={addOpen}>
  <Dialog.Content class="max-w-4xl p-6 bg-[#FDFBF7] rounded-3xl border border-[#E0D7CA] shadow-[0_18px_60px_rgba(47,41,34,0.12)]">
    <h2 class="text-lg font-semibold mb-1 text-[#111827]">
      Add a block
    </h2>
    <p class="text-xs text-[#6B7280] mb-4">
      Choose a block type to add to your flow. You can reorder and refine it later.
    </p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-auto pt-2">
      {#each registry as b}
        <button
          type="button"
          class="p-5 rounded-2xl border border-transparent text-left transition flex flex-col gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
          style={`background:${b.color};`}
          onclick={() => {
            addBlock(b.type);
            addOpen = false;
          }}
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-xl text-[#111827] shadow-sm">
              {b.icon}
            </div>
          </div>
          <div class="font-medium text-xs text-[#111827]">
            {b.label}
          </div>
          {#if b.defaultDescription}
            <div class="text-[11px] text-[#374151] line-clamp-2">
              {b.defaultDescription}
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>

<!-- DELETE DIALOG -->
<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Content class="max-w-md p-6 bg-[#FDFBF7] rounded-2xl border border-[#E0D7CA] shadow-[0_18px_60px_rgba(47,41,34,0.12)]">
    <div class="flex items-start gap-3">
      <div class="w-9 h-9 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-[#B91C1C] text-sm">
        !
      </div>
      <div class="flex-1">
        <h2 class="text-sm font-semibold text-[#111827]">
          Delete this block?
        </h2>
        <p class="text-xs text-[#6B7280] mt-2 mb-4">
          This can’t be undone. The block will be removed from your outline and preview.
        </p>
        <div class="flex justify-end gap-2 mt-2">
          <Button
            variant="secondary"
            class="text-xs px-3 py-1.5 rounded-full bg-[#FDFBF7] border border-[#D6C9B5] text-[#111827] hover:bg-[#F0E7D9]"
            onclick={() => deleteOpen = false}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            class="text-xs px-3 py-1.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-[#FDFBF7] shadow-sm"
            onclick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

