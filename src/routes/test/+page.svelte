<script>
  import { app } from '$lib/state/app.svelte.js';
  import { registry } from '$lib/registry/blocks.js';

  import * as Dialog from "$lib/components/ui/dialog";
  import * as Command from "$lib/components/ui/command";

  const map = Object.fromEntries(
    registry.map(r => [r.type, r.component])
  );

  let open = $state(false);

  function addBlock(type) {
    app.blocks.push({
      id: crypto.randomUUID(),
      type,
      title: "",
      description: "",
      styles: {}
    });
  }

  function deleteBlock(id) {
    app.blocks = app.blocks.filter(b => b.id !== id);
  }

  function moveUp(i) {
    if (i === 0) return;
    const blocks = [...app.blocks];
    [blocks[i - 1], blocks[i]] = [blocks[i], blocks[i - 1]];
    app.blocks = blocks;
  }

  function moveDown(i) {
    if (i === app.blocks.length - 1) return;
    const blocks = [...app.blocks];
    [blocks[i], blocks[i + 1]] = [blocks[i + 1], blocks[i]];
    app.blocks = blocks;
  }
</script>

<!-- HEADER -->
<div class="p-4 border-b">
  <h1 class="text-xl font-bold">{app.form.title}</h1>
</div>

<!-- ADD BLOCK BUTTON -->
<div class="p-4 border-b">
  <button
    class="px-3 py-2 bg-black text-white rounded"
    onclick={() => open = true}
  >
    + Add block
  </button>
</div>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-2xl p-6">

    <h2 class="text-lg font-semibold mb-4">
      Add a block
    </h2>

    <div class="grid grid-cols-3 gap-3">
      {#each registry as blockType}
        <button
          class="p-4 rounded-lg text-white text-left shadow hover:scale-[1.02] transition"
          style={`background-color: ${blockType.color}`}
          onclick={() => {
            addBlock(blockType.type);
            open = false;
          }}
        >
          <div class="text-sm opacity-80">
            {blockType.type}
          </div>

          <div class="text-base font-bold">
            {blockType.label}
          </div>
        </button>
      {/each}
    </div>

  </Dialog.Content>
</Dialog.Root>


<!-- CANVAS -->
<div class="p-6 space-y-6">
  {#each app.blocks as block, i}
    {@const Component = map[block.type]}

    <div class="border rounded p-4 bg-white shadow-sm space-y-3">

      <!-- controls -->
      <div class="flex gap-2 justify-end text-sm">
        <button onclick={() => moveUp(i)}>↑</button>
        <button onclick={() => moveDown(i)}>↓</button>
        <button onclick={() => deleteBlock(block.id)}>✕</button>
      </div>

      <!-- live editor -->
      <input
        class="w-full font-bold text-lg border p-2"
        bind:value={block.title}
        placeholder="Title"
      />

      <textarea
        class="w-full border p-2"
        bind:value={block.description}
        placeholder="Description"
      ></textarea>

      <!-- preview -->
      {#if Component}
        <div class="pt-2 border-t">
          <Component {block} />
        </div>
      {/if}

    </div>
  {/each}
</div>
