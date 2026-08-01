class AnswersStore {
  items = $state([
    { key: 'myname', value: 'Geoffrey Callaghan' },
    { key: 'mymood', value: 'happy' }
  ]);

  #indexOf(key) {
    const target = key.trim().toLowerCase();
    return this.items.findIndex((a) => a.key.toLowerCase() === target);
  }

  get(key) {
    const i = this.#indexOf(key ?? '');
    return i !== -1 ? this.items[i].value : undefined;
  }

  // Upsert: creates the key if it doesn't exist, updates it if it does.
  set(key, value) {
    key = (key ?? '').trim();
    value = (value ?? '').trim();
    if (!key) throw new Error('A name is required.');
    if (!value) throw new Error('An answer is required.');

    const i = this.#indexOf(key);
    if (i !== -1) {
      this.items[i].value = value;
    } else {
      this.items.push({ key, value });
    }
  }

  remove(key) {
    const i = this.#indexOf(key ?? '');
    if (i !== -1) this.items.splice(i, 1);
  }

  resolve(text) {
    if (!text) return '';
    return text.replace(/@(\w+)/g, (match, key) => {
      const value = this.get(key);
      return value ?? match;
    });
  }
}

export const answersStore = new AnswersStore();
