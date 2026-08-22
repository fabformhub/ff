// src/lib/state/form.svelte.js
import { debounce } from "$lib/utils/debounce.js";
import {
	updateForm,
	updateBlocks,
	createBlock,
	deleteBlockById
} from "$lib/services/formService.js";

export const formState = $state({
	form: null,
	blocks: [],
	blockNo: 0
});


let lastFormSnapshot = "";
let blockSnapshots = new Map(); // blockId -> last-saved JSON snapshot

export function setFormState(form, blocks) {
	formState.form = form;
	formState.blocks = blocks;
	formState.blockNo = 0;
	lastFormSnapshot = JSON.stringify(formState.form);
	blockSnapshots = new Map(blocks.map(b => [b.id, JSON.stringify(b)]));
}

export function selectBlock(index) {
	formState.blockNo = index;
}


export async function addBlock(block) {
	if (!formState.form?.id || !block) return;
	const template = {
		type: block.type,
		[block.question ? 'question' : 'title']: block.question || block.label,
		description: block.description,
		buttonText: block.buttonText,
		validation: block.validation,
		props: block.props,
		coverImageProps: block.coverImageProps
	};

	let insertAt = formState.blocks.findIndex(
		b => b.meta?.type === 'thank-you' || b.meta?.component === 'ThankYou'
	);
	if (insertAt === -1) insertAt = formState.blocks.length;

	try {
		const result = await createBlock(formState.form.id, template, insertAt);
		const createdBlock = result?.data?.block;
		if (!createdBlock?.id) throw new Error("Created block missing id");

		formState.blocks.splice(insertAt, 0, createdBlock);
		if (formState.blocks[insertAt + 1]) formState.blocks[insertAt + 1].position = insertAt + 1;

		blockSnapshots.set(createdBlock.id, JSON.stringify(createdBlock));
		formState.blockNo = insertAt;
	} catch (error) {
		console.error("Failed to create block:", error);
	}
}

export async function deleteBlock(blockId) {
	const previousBlocks = [...formState.blocks];
	// Optimistic remove
	formState.blocks = formState.blocks.filter(block => block.id !== blockId);
	if (formState.blockNo >= formState.blocks.length) {
		formState.blockNo = Math.max(0, formState.blocks.length - 1);
	}
	try {
		await deleteBlockById(blockId);
		blockSnapshots.delete(blockId);
	} catch (error) {
		console.error("Failed to delete block:", error);
		// Restore if delete failed
		formState.blocks = previousBlocks;
	}
}

const save = debounce(async () => {
	console.log("[autosave] save triggered");

	if (!formState.form) {
		console.log("[autosave] no form loaded, skipping");
		return;
	}

	const formSnapshot = JSON.stringify(formState.form);
	if (formSnapshot !== lastFormSnapshot) {
		console.log("[autosave] form changed, saving...", formState.form);
		const result = await updateForm(formState.form);
		if (result.success) {
			console.log("[autosave] form saved successfully");
			lastFormSnapshot = formSnapshot;
		} else {
			console.error("[autosave] failed to save form:", result.error);
		}
	} else {
		console.log("[autosave] form unchanged, skipping");
	}

	const changed = [];
	const changedSnapshots = [];
	for (const block of formState.blocks) {
		const snapshot = JSON.stringify(block);
		if (snapshot !== (blockSnapshots.get(block.id) ?? "")) {
			changed.push(block);
			changedSnapshots.push([block.id, snapshot]);
		}
	}

	if (changed.length) {
		console.log(
			`[autosave] ${changed.length} block(s) changed, saving...`,
			changed.map(b => b.id)
		);
		const result = await updateBlocks(changed);
		if (result.success) {
			console.log("[autosave] blocks saved successfully");
			for (const [id, snapshot] of changedSnapshots) {
				blockSnapshots.set(id, snapshot);
			}
		} else {
			console.error("[autosave] failed to save blocks:", result.error);
		}
	} else {
		console.log("[autosave] no blocks changed, skipping");
	}
}, 1500);

export function saveChanges() {
	console.log("[autosave] saveChanges() called, debounce (re)started");
	save();
}

// Autosave: fires whenever formState.form or formState.blocks changes.
// $effect.root is required here because this runs at module scope,
// outside any component's lifecycle.
$effect.root(() => {
	$effect(() => {
		JSON.stringify(formState.form);
		JSON.stringify(formState.blocks);
		saveChanges();
	});
});
