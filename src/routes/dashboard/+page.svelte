<script>
  import { registry } from '$lib/registry/blocks';

  import * as Dialog from '$lib/components/ui/dialog';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Badge } from '$lib/components/ui/badge';
  import { Label } from '$lib/components/ui/label';

  // Imported Lucide Icons for high-end actions panel
  import { MoreVertical, Copy, Trash2, LayoutGrid, Sparkles } from '@lucide/svelte';
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

  function duplicateBlock(block, e) {
    e.stopPropagation();
    const copy = {
      ...block,
      id: crypto.randomUUID(),
      title: block.title ? `${block.title} (Copy)` : ''
    };
    const index = blocks.findIndex(b => b.id === block.id);
    if (index !== -1) {
      const updated = [...blocks];
      updated.splice(index + 1, 0, copy);
      blocks = updated;
      selectedId = copy.id;
    }
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

  function openDelete(id, e) {
    if (e) e.stopPropagation();
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

<Tooltip.Provider delayDuration={200}>
  <div class="h-screen bg-[#FAF9F5] text-[#1A1A1A] flex flex-col font-sans antialiased selection:bg-[#1A1A1A]/10">
    <div class="flex-1 grid grid-cols-[320px_1fr_340px] overflow-hidden w-full h-full">

      <aside class="border-r border-black/[0.06] bg-[#FAF9F5] p-6 flex flex-col gap-6 overflow-hidden h-full">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-[#8A8880] tracking-[0.2em] uppercase">
            Form Structure
          </span>
          <Badge variant="secondary" class="bg-black/[0.04] text-[#1A1A1A] px-2.5 py-0.5 rounded-full text-[10px] font-bold border-0">
            {blocks.length} {blocks.length === 1 ? 'element' : 'elements'}
          </Badge>
        </div>

        <Button
          variant="outline"
          class="w-full justify-between p-4 h-auto bg-white border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:bg-[#FAF9F5] hover:border-black active:scale-[0.98] transition-all duration-200 group rounded-xl"
          onclick={() => addOpen = true}
        >
          <span class="text-xs font-bold text-[#1A1A1A] tracking-tight flex items-center gap-2">
            <LayoutGrid class="w-3.5 h-3.5 text-[#8A8880] group-hover:text-black transition-colors" />
            Add new question block
          </span>
          <div class="w-5 h-5 rounded-md bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-medium group-hover:rotate-90 transition-transform duration-300">
            +
          </div>
        </Button>

        <div class="flex-1 space-y-3 overflow-y-auto pr-1 -mr-2">
          {#if blocks.length === 0}
            <div class="text-xs text-[#706E67] bg-black/[0.01] border border-dashed border-black/[0.1] rounded-2xl p-5 text-center leading-relaxed font-medium mt-4">
              ✨ Your canvas is waiting. Click the button above to populate your form workflow template sequence!
            </div>
          {/if}

          {#each blocks as block (block.id)}
            {@const m = meta[block.type]}
            {@const isSelected = block.id === selectedId}
            {@const OutlineIcon = m.icon}

            <div
              class="group flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer border transition-all duration-200 relative focus-within:ring-2 focus-within:ring-black
                ${isSelected ? 'border-black shadow-[0_8px_24px_rgba(0,0,0,0.06)] bg-white scale-[1.01]' : 'border-black/[0.04] hover:border-black/20 bg-white/50 hover:bg-white'}"
              style={`opacity: ${draggingId === block.id ? '0.3' : '1'}`}
              draggable="true"
              ondragstart={() => draggingId = block.id}
              ondragend={() => draggingId = null}
              ondragover={(e) => e.preventDefault()}
              ondrop={() => {
                moveBlock(draggingId, block.id);
                draggingId = null;
              }}
              onclick={() => selectBlock(block.id)}
              role="button"
              tabindex="0"
              onkeydown={(e) => e.key === 'Enter' && selectBlock(block.id)}
            >
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs border border-black/[0.02] flex-shrink-0"
                style={`background: ${m.bg}; color: ${m.fg};`}
              >
                <OutlineIcon class="w-4 h-4" strokeWidth={2.5} />
              </div>

              <div class="flex-1 min-w-0 pr-6">
                <div class="text-xs font-bold text-[#1A1A1A] truncate tracking-tight">
                  {block.title || m.label}
                </div>
                <div class="text-[10px] text-[#8A8880] truncate mt-0.5 font-medium">
                  {block.description || m.defaultDescription}
                </div>
              </div>

              <div class="absolute right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-20">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    {#snippet child({ props })}
                      <Button
                        {...props}
                        variant="ghost"
                        size="icon"
                        class="w-7 h-7 hover:bg-black/5 rounded-md text-[#706E67] hover:text-black transition-colors"
                        onclick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical class="w-4 h-4" />
                      </Button>
                    {/snippet}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end" class="w-40 bg-white rounded-xl shadow-xl border border-black/[0.06] p-1 font-sans">
                    <DropdownMenu.Item 
                      class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#FAF9F5] transition-colors"
                      onclick={(e) => duplicateBlock(block, e)}
                    >
                      <Copy class="w-3.5 h-3.5 text-[#706E67]" />
                      Duplicate
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator class="h-px bg-black/[0.04] my-1" />
                    <DropdownMenu.Item 
                      class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#A63A3A] rounded-lg cursor-pointer hover:bg-red-50/60 transition-colors"
                      onclick={(e) => openDelete(block.id, e)}
                    >
                      <Trash2 class="w-3.5 h-3.5 text-[#A63A3A]" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          {/each}
        </div>
      </aside>

      <main class="relative p-12 flex justify-center items-center bg-[#F3F2EC] overflow-y-auto h-full border-r border-black/[0.06]">
        {#if blocks.length === 0}
          <div class="flex flex-col items-center text-center p-10 max-w-md bg-white border border-black/[0.06] rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.03)]" in:fade={{ duration: 200 }}>
            <div class="w-14 h-14 rounded-2xl bg-[#FFF0F3] text-[#9D174D] flex items-center justify-center mb-6 text-xl shadow-2xs font-bold animate-pulse">
              👋
            </div>
            <div class="text-base font-bold text-[#1A1A1A] tracking-tight">
              Let's build something awesome
            </div>
            <div class="text-xs text-[#706E67] leading-relaxed mt-2.5 mb-6 font-medium px-2">
              Create gorgeous, engaging visual flow experiences. Click the registry picker deck below to append your first interactive form layer item.
            </div>
            <Button 
              onclick={() => addOpen = true}
              class="bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-xl shadow-lg px-6 h-10 active:scale-[0.97] transition-all"
            >
              Add First Block
            </Button>
          </div>
        {:else if !selectedBlock}
          <div class="flex flex-col items-center text-center p-10 max-w-md bg-white border border-black/[0.06] rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.03)]" in:fade={{ duration: 200 }}>
            <div class="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center text-lg mb-5 shadow-2xs">
              <Sparkles class="w-5 h-5" />
            </div>
            <div class="text-sm font-bold text-[#1A1A1A] tracking-tight">
              Select an item to preview
            </div>
            <div class="text-xs text-[#706E67] leading-relaxed mt-2 font-medium">
              Click any element card row inside your left sidebar structure navigation tree to view and interact with its live responsive layout sandbox.
            </div>
          </div>
        {:else}
          {@const Component = map[selectedBlock.type]}
          {@const activeMeta = meta[selectedBlock.type]}
          {@const ActiveIcon = activeMeta.icon}
          
          <div class="w-full max-w-2xl h-fit py-8" transition:fade={{ duration: 150 }}>
            <div
              class="bg-white rounded-3xl shadow-[0_32px_96px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.01)] border border-black/[0.06] overflow-hidden"
              transition:scale={{ duration: 150, start: 0.98 }}
            >
              <div class="px-6 py-4.5 border-b border-black/[0.04] bg-[#FAF9F5] flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center shadow-3xs border border-black/[0.02] flex-shrink-0"
                    style={`background: ${activeMeta.bg}; color: ${activeMeta.fg};`}
                  >
                    <ActiveIcon class="w-4 h-4" strokeWidth={2.4} />
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-[#1A1A1A] truncate tracking-tight">
                      {selectedBlock.title || activeMeta.label}
                    </div>
                    <div class="text-[10px] text-[#8A8880] truncate mt-0.5 font-medium">
                      {selectedBlock.description || activeMeta.defaultDescription}
                    </div>
                  </div>
                </div>
                <Badge class="bg-white border-black/[0.06] text-[#706E67] hover:bg-white font-bold tracking-wider text-[9px] uppercase px-2.5 py-1 rounded-md shadow-3xs">
                  Live View
                </Badge>
              </div>

              <div class="p-8 bg-white">
                <div class="rounded-2xl border border-black/[0.03] bg-[#FAF9F5] p-6 shadow-inner">
                  <BlockWrapper block={selectedBlock}>
                    <Component />
                  </BlockWrapper>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if blocks.length > 0}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  size="icon"
                  onclick={() => addOpen = true}
                  class="fixed bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#1A1A1A] text-white shadow-[0_12px_32px_rgba(0,0,0,0.15)] hover:bg-black hover:scale-105 active:scale-95 transition-all duration-200 z-30 text-xl font-light"
                >
                  +
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content side="top" class="bg-[#1A1A1A] text-white font-sans text-[10px] font-bold tracking-wider uppercase rounded-md px-3 py-1.5 border-0 shadow-lg mb-2">
              Open Component Registry Deck
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </main>

      <aside class="border-l border-black/[0.06] bg-[#FAF9F5] p-6 space-y-6 overflow-auto h-full">
        <div class="flex items-center justify-between">
          <span class="font-bold text-[11px] text-[#8A8880] tracking-[0.2em] uppercase">
            Block Properties
          </span>
          {#if selectedBlock}
            <Badge 
              variant="outline" 
              class="text-[10px] font-bold px-2.5 py-0.5 rounded-md border-0 shadow-3xs"
              style={`background: ${meta[selectedBlock.type].bg}; color: ${meta[selectedBlock.type].fg};`}
            >
              {meta[selectedBlock.type].label}
            </Badge>
          {/if}
        </div>

        {#if selectedBlock}
          <div class="space-y-6" transition:fade={{ duration: 100 }}>
            <div class="space-y-2">
              <Label for="premium-block-title" class="text-[10px] font-bold text-[#706E67] uppercase tracking-wider">
                Question Title Label
              </Label>
              <Input
                id="premium-block-title"
                bind:value={selectedBlock.title}
                placeholder={meta[selectedBlock.type].label}
                class="bg-white border-black/[0.08] text-xs text-[#1A1A1A] font-medium placeholder:text-[#A1A09A] rounded-xl shadow-2xs focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 h-10 transition-all"
              />
            </div>

            <div class="space-y-2">
              <Label for="premium-block-desc" class="text-[10px] font-bold text-[#706E67] uppercase tracking-wider">
                Description / Help Text
              </Label>
              <Textarea
                id="premium-block-desc"
                bind:value={selectedBlock.description}
                placeholder="Add sub-text or context hints for users filling out this input field..."
                class="bg-white border-black/[0.08] text-xs text-[#1A1A1A] font-medium placeholder:text-[#A1A09A] rounded-xl shadow-2xs min-h-[120px] focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 transition-all resize-none leading-relaxed p-3.5"
              />
            </div>
          </div>
        {:else}
          <div class="text-[#706E67] text-xs bg-black/[0.01] border border-black/[0.04] rounded-2xl p-5 leading-relaxed font-medium text-center shadow-3xs pt-8 pb-8">
            <span class="text-xl block mb-2">👈</span>
            Select a component block from your outline layout to configure its input settings, options, and validations here.
          </div>
        {/if}
      </aside>
    </div>
  </div>

  <Dialog.Root bind:open={addOpen}>
    <Dialog.Content class="max-w-4xl p-8 bg-[#FAF9F5] rounded-3xl border border-black/[0.06] shadow-[0_32px_96px_rgba(0,0,0,0.15)] font-sans">
      <Dialog.Header>
        <Dialog.Title class="text-sm font-bold text-[#1A1A1A] tracking-wider uppercase">
          Component Registry Deck
        </Dialog.Title>
        <Dialog.Description class="text-xs text-[#706E67] mt-1 font-medium">
          Choose a dynamic visual module below to append a beautifully stylized row element inside your live canvas template tree.
        </Dialog.Description>
      </Dialog.Header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto pt-4 pb-2 pr-1">
        {#each registry as b}
          {@const DeckIcon = b.icon}
          <button
            type="button"
            class="p-4.5 rounded-2xl border transition-all duration-200 flex flex-col gap-4 text-left shadow-2xs hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black group"
            style={`background: ${b.bg}; border-color: ${b.fg}15; color: ${b.fg};`}
            onclick={() => {
              addBlock(b.type);
              addOpen = false;
            }}
          >
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-3xs flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
              <DeckIcon class="w-4.5 h-4.5" strokeWidth={2.5} />
            </div>
            
            <div class="space-y-1">
              <div class="font-bold text-xs tracking-tight text-neutral-900 group-hover:underline">
                {b.label}
              </div>
              {#if b.defaultDescription}
                <div class="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed font-medium opacity-90">
                  {b.defaultDescription}
                </div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root bind:open={deleteOpen}>
    <Dialog.Content class="max-w-md p-6 bg-white rounded-2xl border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.1)] font-sans">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#A63A3A] text-xs font-bold">
            ⚠️
          </div>
          <Dialog.Title class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            Delete Block Element?
          </Dialog.Title>
        </div>
        
        <Dialog.Description class="text-xs text-[#706E67] leading-relaxed font-medium">
          Are you sure? This will remove the selected field card and all its custom configurations permanently from your form outline.
        </Dialog.Description>
        
        <div class="flex justify-end gap-2.5 mt-3">
          <Button
            variant="outline"
            class="text-[10px] font-bold uppercase tracking-wider h-9 px-4 rounded-xl bg-transparent border border-black/[0.08] text-[#706E67] hover:bg-[#FAF9F5]"
            onclick={() => deleteOpen = false}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            class="text-[10px] font-bold uppercase tracking-wider h-9 px-4 rounded-xl bg-[#A63A3A] hover:bg-[#852E2E] text-white border-0 shadow-sm"
            onclick={confirmDelete}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</Tooltip.Provider>