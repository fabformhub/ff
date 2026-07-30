class AnswersStore {
  items = $state([  
{ key: 'geoff', value: 'Geoffrey Callaghan' },
{ key: 'team', value: 'Fabform Team' }
]);

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
