
function parseKey(raw) {
  return (raw ?? '').replace(/^:=\s*/, '').trim();
}

class AnswersStore {
  items = $state([
  ]);

  add(question, answer) {
    const key = parseKey(question);
    if (!key) throw new Error('A question is required.');
    if (!answer) throw new Error('An answer is required.');
    if (this.items.some((v) => v.key.toLowerCase() === key.toLowerCase())) {
      throw new Error(`"${key}" already exists.`);
    }
    this.items.push({ key, value: answer });
  }

  remove(key) {
    const i = this.items.findIndex((v) => v.key === key);
    if (i !== -1) this.items.splice(i, 1);
  }
}

export const answersStore = new AnswersStore();
