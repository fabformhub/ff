import { getEmailSettings } from "$lib/services/emailSettingsService";

export async function load({ params }) {
	const emailSettings = await getEmailSettings(params.id);

	return {
		emailSettings
	};
}
