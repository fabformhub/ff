// src/routes/(wherever)/[id]/+page.js

import { getForm, getBlocksByFormId } from "$lib/services/formService.js";

export async function load({ params }) {
	const formRes = await getForm(params.id);

	if (!formRes?.success || !formRes?.data?.form) {
		return {
			form: null,
			blocks: []
		};
	}

	const form = formRes.data.form;

	// Pass form.id (UUID) rather than params.id (slug) to prevent Postgres UUID 400 errors
	const blocksRes = await getBlocksByFormId(form.id);

	return {
		form,
		blocks: blocksRes?.data?.blocks ?? []
	};
}
