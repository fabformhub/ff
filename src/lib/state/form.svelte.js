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

// Renumber blocks[start..] so `position` always matches array index.
// Returns the ids that were actually changed, so callers can decide
// whether they need to do anything extra (e.g. targeted saves).
function renumberPositions(start = 0) {
	const changedIds = [];
	for (let i = start; i < formState.blocks.length; i++) {
		if (formState.blocks[i].position !== i) {
			formState.blocks[i].position = i;
			changedIds.push(formState.blocks[i].id);
		}
	}
	return changedIds;
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

		// Recompute insertion point in case the array changed while the
		// request was in flight (e.g. a delete happened concurrently).
		let finalInsertAt = formState.blocks.findIndex(
			b => b.meta?.type === 'thank-you' || b.meta?.component === 'ThankYou'
		);
		if (finalInsertAt === -1) finalInsertAt = formState.blocks.length;

		formState.blocks.splice(finalInsertAt, 0, createdBlock);

		// Renumber everything from the insertion point on so no two blocks
		// share a position. Blocks whose position actually changes will be
		// picked up by the autosave diff automatically.
		renumberPositions(finalInsertAt);

		blockSnapshots.set(createdBlock.id, JSON.stringify(createdBlock));
		formState.blockNo = finalInsertAt;
	} catch (error) {
		console.error("Failed to create block:", error);
	}
}

export async function deleteBlock(blockId) {
	const previousBlocks = [...formState.blocks];
	const previousBlockNo = formState.blockNo;

	// Optimistic remove
	formState.blocks = formState.blocks.filter(block => block.id !== blockId);
	renumberPositions(0);

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
		formState.blockNo = previousBlockNo;
	}
}

let saveInFlight = false;
let saveRequestedAgain = false;

const save = debounce(async () => {
	if (saveInFlight) {
		// A save is already running; make sure we run again once it's done
		// so we don't lose whatever changed during this window.
		saveRequestedAgain = true;
		console.log("[autosave] save already in flight, queuing re-run");
		return;
	}
	saveInFlight = true;
	console.log("[autosave] save triggered");

	try {
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
	} finally {
		saveInFlight = false;
		if (saveRequestedAgain) {
			saveRequestedAgain = false;
			console.log("[autosave] re-running save for changes made during previous save");
			save();
		}
	}
}, 1500);

export function saveChanges() {
	console.log("[autosave] saveChanges() called, debounce (re)started");
	save();
}

// Autosave: fires whenever formState.form or formState.blocks changes.
// $effect.root is required here because this runs at module scope,
// outside any component's lifecycle.
//
// Guard against duplicate registration on HMR (Vite may re-execute this
// module without tearing down the previous effect root).
if (import.meta.hot) {
	if (import.meta.hot.data.disposeAutosave) {
		import.meta.hot.data.disposeAutosave();
	}
	const dispose = $effect.root(() => {
		$effect(() => {
			JSON.stringify(formState.form);
			JSON.stringify(formState.blocks);
			saveChanges();
		});
	});
	import.meta.hot.data.disposeAutosave = dispose;
} else {
	$effect.root(() => {
		$effect(() => {
			JSON.stringify(formState.form);
			JSON.stringify(formState.blocks);
			saveChanges();
		});
	});
}
