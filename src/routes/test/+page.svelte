<script>
  import { app } from '$lib/state/app.svelte.js';
  import { registry } from '$lib/registry/blocks.js';

  const map = Object.fromEntries(
    registry.map(r => [r.type, r.component])
  );

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

<!-- ADD BLOCK BAR -->
<div class="p-4 flex gap-2 border-b flex-wrap">
  {#each registry as blockType}
    <button
      class="px-3 py-1 bg-blue-600 text-white rounded"
      onclick={() => addBlock(blockType.type)}
    >
      + {blockType.label}
    </button>
  {/each}
</div>

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

      <!-- block preview -->
      {#if Component}
        <div class="pt-2 border-t">
          <Component {block} />
        </div>
      {/if}

    </div>
  {/each}
</div>
