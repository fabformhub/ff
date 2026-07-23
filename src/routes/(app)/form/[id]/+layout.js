import {
	getForm,
	getBlocksByFormId
} from "$lib/services/formService.js";

export async function load({ params }) {
	const formRes = await getForm(params.id);
	const blocksRes = await getBlocksByFormId(params.id);

	return {
		form: formRes.data.form,
		blocks: blocksRes.data.blocks
	};
}
