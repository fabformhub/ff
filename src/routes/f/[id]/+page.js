// src/routes/(wherever)/[id]/+page.js

import {
	getForm,
	getBlocksByFormId
} from "$lib/services/formService.js";

export async function load({ params }) {
	console.log('[load] params.id:', params.id);

	const formRes = await getForm(params.id);
	console.log('[load] formRes:', JSON.stringify(formRes, null, 2));

	const blocksRes = await getBlocksByFormId(params.id);
	console.log('[load] blocksRes:', JSON.stringify(blocksRes, null, 2));

	return {
		form: formRes?.data?.form ?? null,
		blocks: blocksRes?.data?.blocks ?? []
	};
}
