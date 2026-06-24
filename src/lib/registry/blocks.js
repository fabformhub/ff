import ShortText from '$lib/blocks/ShortText.svelte';
import LongText from '$lib/blocks/LongText.svelte';
import Statement from '$lib/blocks/Statement.svelte';

export const registry = [
  {
    type: "ShortText",
    label: "Short text",
    color: "#2563eb", // blue
    component: ShortText
  },
  {
    type: "LongText",
    label: "Long text",
    color: "#10b981", // green
    component: LongText
  },
  {
    type: "Statement",
    label: "Statement",
    color: "#f59e0b", // amber
    component: Statement
  }
];
