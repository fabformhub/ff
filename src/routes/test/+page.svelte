<script>
    import { registry } from '$lib/blocks/registry.js';
    import { loadBlock } from '$lib/blocks/loadBlock.js';

    let currentBlock = $state(registry[0].name);
    let CurrentComponent = $state(null);

    $effect(async () => {
        CurrentComponent = await loadBlock(currentBlock);
    });
</script>

<select bind:value={currentBlock}>
    {#each registry as block}
        <option value={block.name}>
            {block.label}
        </option>
    {/each}
</select>

{#if CurrentComponent}
    <CurrentComponent />
{/if}

