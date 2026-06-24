import ShortText from '$lib/blocks/ShortText.svelte';
import LongText from  '$lib/blocks/LongText.svelte';
import Statement from '$lib/blocks/Statement.svelte';

export const registry = [
  {
    type: "ShortText",
    label: "Short text",
    component: ShortText
  },
  {
    type: "LongText",
    label: "Long text",
    component: LongText
  },
  {
    type: "Statement",
    label: "Statement",
    component: Statement
  }
];
