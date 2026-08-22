import { getFormWithBlocks } from "$lib/services/formService.js";

export async function load({ params }) {
	const res = await getFormWithBlocks(params.id);

	if (!res?.success || !res?.data?.form) {
		return {
			form: null,
			blocks: []
		};
	}

	return {
		form: res.data.form,
		blocks: res.data.blocks
	};
}
