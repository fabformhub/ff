import { getForm } from '$lib/services/formService.js';
import { getResponsesByFormId } from '$lib/services/responseService.js';

export async function load({ params }) {
  // 1. Fetch form by slug (e.g. "HCQRnJ")
  const formRes = await getForm(params.id);

  if (!formRes?.success || !formRes?.data?.form) {
    return {
      form: null,
      responses: [],
      error: formRes?.error ?? 'Form not found'
    };
  }

  const form = formRes.data.form;

  // 2. Fetch responses using the UUID from the form record
  const responsesRes = await getResponsesByFormId(form.id);

  return {
    form,
    responses: responsesRes?.success ? (responsesRes.data?.responses ?? []) : [],
    error: responsesRes?.error ?? null
  };
}
