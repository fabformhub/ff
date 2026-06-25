<script>
  import { registry } from '$lib/registry/blocks';

  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';

  import BlockWrapper from '$lib/blocks/BlockWrapper.svelte';

  // ================= STATE =================
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

  // ================= ACTIONS =================
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

    const copy = [...blocks];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);

    blocks = copy;
  }

  function duplicateBlock(id) {
    const b = blocks.find(x => x.id === id);
    if (!b) return;

    const copy = {
      ...b,
      id: crypto.randomUUID(),
      title: `${b.title} (copy)`
    };

    const i = blocks.findIndex(x => x.id === id);
    const arr = [...blocks];
    arr.splice(i + 1, 0, copy);

    blocks = arr;
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

<!-- ================= LAYOUT ================= -->
<div class="h-screen grid grid-cols-[320px_1fr_320px] bg-slate-50">

  <!-- ================= OUTLINE ================= -->
  <aside class="border-r bg-white p-3 space-y-2 overflow-auto">

    <!-- ADD BUTTON -->
    <button
      type="button"
      class="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white text-3xl font-bold shadow hover:scale-[1.02] transition"
      onclick={() => addOpen = true}
    >
      +
    </button>

    {#each blocks as block (block.id)}
      {@const m = meta[block.type]}

      <div
        class="group flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 hover:shadow transition"
        draggable="true"
        ondragstart={() => draggingId = block.id}
        ondragover={(e) => e.preventDefault()}
        ondrop={() => {
          moveBlock(draggingId, block.id);
          draggingId = null;
        }}
      >

        <!-- drag -->
        <span class="opacity-0 group-hover:opacity-100 cursor-grab text-slate-400">
          ⋮⋮
        </span>

        <!-- icon -->
        <span class="w-6 text-center" style={`color:${m.color}`}>
          {m.icon}
        </span>

        <!-- select -->
        <button
          type="button"
          class="flex-1 text-left"
          onclick={() => selectBlock(block.id)}
        >
          <div class="text-sm font-medium text-slate-800">
            {block.title || 'Untitled'}
          </div>
        </button>

        <!-- actions -->
        <div class="opacity-0 group-hover:opacity-100 flex gap-2">

          <button
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            aria-label="Duplicate"
          >
            ⧉
          </button>

          <button
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              openDelete(block.id);
            }}
            aria-label="Delete"
          >
            🗑
          </button>

        </div>

      </div>
    {/each}

  </aside>

  <!-- ================= PREVIEW ================= -->
  <main class="p-10 flex justify-center">

    {#if selectedBlock}
      {@const Component = map[selectedBlock.type]}

      <div class="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-3">

        <div class="text-sm font-medium text-slate-600">
          {selectedBlock.title}
        </div>

        <div class="text-xs text-slate-400">
          {selectedBlock.description}
        </div>

        <div class="pt-4 border-t">
          <BlockWrapper block={selectedBlock}>
            <Component />
          </BlockWrapper>
        </div>

      </div>

    {:else}
      <div class="text-slate-400 text-sm">
        Select a block
      </div>
    {/if}

  </main>

  <!-- ================= PROPERTIES ================= -->
  <aside class="border-l bg-white p-4 space-y-4">

    {#if selectedBlock}

      <h2 class="font-semibold text-lg">Properties</h2>

      <Input bind:value={selectedBlock.title} placeholder="Title" />
      <Textarea bind:value={selectedBlock.description}></Textarea>

    {:else}

      <div class="text-slate-400 text-sm">
        No block selected
      </div>

    {/if}

  </aside>

</div>

<!-- ================= ADD DIALOG ================= -->
<Dialog.Root bind:open={addOpen}>
  <Dialog.Content class="max-w-4xl p-6 bg-white rounded-2xl">

    <h2 class="text-xl font-semibold mb-4">Add Block</h2>

    <div class="grid grid-cols-4 gap-4 max-h-[60vh] overflow-auto">

      {#each registry as b}
        <button
          type="button"
          class="p-4 rounded-xl border hover:shadow-md text-left"
          onclick={() => {
            addBlock(b.type);
            addOpen = false;
          }}
        >
          <div class="text-2xl">{b.icon}</div>
          <div class="font-medium">{b.label}</div>
        </button>
      {/each}

    </div>

  </Dialog.Content>
</Dialog.Root>

<!-- ================= DELETE DIALOG ================= -->
<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Content class="max-w-md p-6 bg-white rounded-2xl">

    <h2 class="text-lg font-semibold">Delete block?</h2>

    <p class="text-sm text-slate-500 mt-2 mb-6">
      This cannot be undone.
    </p>

    <div class="flex justify-end gap-2">

      <Button variant="secondary" onclick={() => deleteOpen = false}>
        Cancel
      </Button>

      <Button variant="destructive" onclick={confirmDelete}>
        Delete
      </Button>

    </div>

  </Dialog.Content>
</Dialog.Root>
