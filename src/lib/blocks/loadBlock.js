// src/lib/blocks/loadBlock.js
const modules = import.meta.glob('$lib/blocks/*.svelte');

export async function loadBlock(name) {
    for (const path in modules) {
        const filename = path.split('/').at(-1).replace('.svelte', '');
        if (filename === name) {
            const mod = await modules[path]();
            return mod.default;
        }
    }
    throw new Error(`Block not found: ${name}`);
}
