// answers.svelte.js
//
// Shared reactive state: a simple list of previous answers you can insert
// again later. `key` is what you type after "@" to find it; `value` is the
// answer itself. Starts empty.

class AnswersStore {
  items = $state([]);

  add(key, value) {
    key = (key ?? '').trim();
    value = (value ?? '').trim();
    if (!key) throw new Error('A name is required.');
    if (!value) throw new Error('An answer is required.');
    if (this.items.some((a) => a.key.toLowerCase() === key.toLowerCase())) {
      throw new Error(`"${key}" already exists.`);
    }
    this.items.push({ key, value });
  }

  remove(key) {
    const i = this.items.findIndex((a) => a.key === key);
    if (i !== -1) this.items.splice(i, 1);
  }
}

// Singleton — every importer shares the same reactive instance.
export const answersStore = new AnswersStore();
