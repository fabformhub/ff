import { supabase } from "$lib/supabaseClient";

export async function getEmailSettings(formId) {
	const { data, error } = await supabase
		.from("form_email_settings")
		.select("*")
		.eq("form_id", formId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
}
export async function saveEmailSettings({
	formId,
	enabled,
	subject,
	message
}) {
	const { data, error } = await supabase
		.from("form_email_settings")
		.upsert({
			form_id: formId,
			enabled,
			subject,
			message
		})
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}
