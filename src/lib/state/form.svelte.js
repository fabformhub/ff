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
	const result = await createBlock(
		formState.form.id,
		block
	);

	const newBlock = result?.data?.block ?? block;

	formState.blocks.push(newBlock);

	formState.blockNo = formState.blocks.length - 1;
}


export async function deleteBlock(blockId) {
	formState.blocks = formState.blocks.filter(
		block => block.id !== blockId
	);

	if (formState.blockNo >= formState.blocks.length) {
		formState.blockNo = Math.max(
			0,
			formState.blocks.length - 1
		);
	}

	await deleteBlockById(blockId);
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
