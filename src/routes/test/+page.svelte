<script>
  import { MentionInput } from '$lib/ui';
  import { answersStore } from '$lib/state/answers.svelte.js';

  let newKey = $state('');
  let newValue = $state('');
  let resolvedText = $state('');

  function handleAdd(e) {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    answersStore.add(newKey, newValue);
    newKey = '';
    newValue = '';
  }

  function handleUpdate(result) {
    resolvedText = result.resolvedText;
  }
</script>

<div class="max-w-xl mx-auto my-10 font-sans">
  <MentionInput
    answers={answersStore.items}
    placeholder="Type @ to insert an answer…"
    onupdate={handleUpdate}
  />

  <form class="flex gap-2 mt-4" onsubmit={handleAdd}>
    <input
      class="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
      placeholder="Name"
      bind:value={newKey}
    />
    <input
      class="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
      placeholder="Answer"
      bind:value={newValue}
    />
    <button class="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-semibold" type="submit">
      Add
    </button>
  </form>

  <p class="mt-4 text-sm text-gray-600">{resolvedText}</p>
</div>
