// src/lib/state/form.svelte.js

import { debounce } from "$lib/utils/debounce.js";
import {
	updateForm,
	updateBlock,
	createBlock,
	deleteBlockById
} from "$lib/services/formService.js";


export const formState = $state({
	form: null,
	blocks: [],
	blockNo: 0
});


let lastFormSnapshot = "";
let lastBlockSnapshot = "";


export function setFormState(form, blocks) {
	formState.form = form;
	formState.blocks = blocks;
	formState.blockNo = 0;

	lastFormSnapshot = JSON.stringify(formState.form);

	lastBlockSnapshot = formState.blocks[0]
		? JSON.stringify(formState.blocks[0])
		: "";
}


export function selectBlock(index) {
	formState.blockNo = index;
}


export async function addBlock(block) {
	if (!formState.form?.id || !block) return;

	const template = {
		blockTypeId: block.blockTypeId,
		title: block.label,
		question: block.question,
		description: block.description,
		buttonText: block.buttonText,
		validation: block.validation ?? {},
		props: block.props ?? {},
		coverImageProps: block.coverImageProps ?? {}
	};

	try {
		const result = await createBlock(
			formState.form.id,
			template
		);

		const createdBlock = result?.data?.block;

		if (!createdBlock?.id) {
			throw new Error("Created block missing id");
		}

		formState.blocks.push(createdBlock);

		formState.blockNo = formState.blocks.length - 1;

	} catch (error) {
		console.error("Failed to create block:", error);
	}
}

export async function deleteBlock(blockId) {
	const previousBlocks = [...formState.blocks];

	// Optimistic remove
	formState.blocks = formState.blocks.filter(
		block => block.id !== blockId
	);

	if (formState.blockNo >= formState.blocks.length) {
		formState.blockNo = Math.max(
			0,
			formState.blocks.length - 1
		);
	}

	try {
		await deleteBlockById(blockId);

	} catch (error) {
		console.error("Failed to delete block:", error);

		// Restore if delete failed
		formState.blocks = previousBlocks;
	}
}


export function updateCurrentBlock(data) {
	const block = formState.blocks[formState.blockNo];

	if (!block) return;

	Object.assign(block, data);
}


const save = debounce(async () => {

	if (!formState.form) return;


	const formSnapshot = JSON.stringify(formState.form);

	if (formSnapshot !== lastFormSnapshot) {
		await updateForm(formState.form);
		lastFormSnapshot = formSnapshot;
	}


	const block = formState.blocks[formState.blockNo];

	if (!block) return;


	const blockSnapshot = JSON.stringify(block);

	if (blockSnapshot !== lastBlockSnapshot) {
		await updateBlock(block);
		lastBlockSnapshot = blockSnapshot;
	}

}, 1500);


export function saveChanges() {
	save();
}
