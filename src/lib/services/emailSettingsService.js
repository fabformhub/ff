import { supabase } from "$lib/supabaseClient";

export async function getEmailSettings(formId) {
	let { data, error } = await supabase
		.from("form_email_settings")
		.select("*")
		.eq("form_id", formId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	// Create default settings if none exist
	if (!data) {
		const { data: newSettings, error: insertError } = await supabase
			.from("form_email_settings")
			.insert({
				form_id: formId,
				enabled: false,
				subject: "You received a new submission in FabForm",
				message: "Your form just received a new submission."
			})
			.select()
			.single();

		if (insertError) {
			throw insertError;
		}

		data = newSettings;
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
