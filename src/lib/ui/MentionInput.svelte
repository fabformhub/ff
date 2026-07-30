<script>
  import { AtSign } from '@lucide/svelte';
  import { answersStore } from '$lib/state/answers.svelte.js';

  let { placeholder = 'Type @ to insert…', value = $bindable('') } = $props();
  const answers = answersStore.items;

  let inputEl = $state(null);
  let query = $state(null); // null = closed, string = open filter

  let tagPattern = $derived(
    new RegExp(`@(${answers.map((a) => a.key).sort((a, b) => b.length - a.length).join('|')})\\b`, 'g')
  );

  let filtered = $derived(
    query === null ? [] : answers.filter((a) => a.key.toLowerCase().includes(query.toLowerCase()))
  );

  let segments = $derived.by(() => {
    if (!answers.length) return [{ text: value, tag: false }];
    const parts = [];
    let last = 0;
    for (const m of value.matchAll(tagPattern)) {
      if (m.index > last) parts.push({ text: value.slice(last, m.index), tag: false });
      parts.push({ text: m[0], tag: true });
      last = m.index + m[0].length;
    }
    if (last < value.length) parts.push({ text: value.slice(last), tag: false });
    return parts;
  });

  function handleInput(e) {
    value = e.target.value;
    const before = value.slice(0, e.target.selectionStart);
    const match = /@(\S*)$/.exec(before);
    query = match ? match[1] : null;
  }

  function select(key) {
    const cursor = inputEl.selectionStart;
    const before = value.slice(0, cursor).replace(/@\S*$/, `@${key} `);
    value = before + value.slice(cursor);
    query = null;
    inputEl.focus();
  }
</script>

<div class="relative w-full">
  <div
    class="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre rounded-lg border border-transparent px-3 py-2 text-sm text-transparent"
    aria-hidden="true"
  >
    {#each segments as seg}
      {#if seg.tag}<mark class="rounded bg-gradient-to-r from-violet-200 to-fuchsia-200 text-transparent">{seg.text}</mark>{:else}{seg.text}{/if}
    {/each}
  </div>

  <input
    bind:this={inputEl}
    class="relative w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
    {placeholder}
    {value}
    oninput={handleInput}
  />

  {#if query !== null}
    <ul class="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
      {#each filtered as item (item.key)}
        <li
          class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-violet-50"
          onclick={() => select(item.key)}
        >
          <AtSign size={14} class="text-violet-500" />
          <span class="flex-1 font-semibold">{item.key}</span>
          <span class="text-xs text-gray-400">{item.value}</span>
        </li>
      {:else}
        <li class="px-2 py-1.5 text-gray-400">No matches</li>
      {/each}
    </ul>
  {/if}
</div>
