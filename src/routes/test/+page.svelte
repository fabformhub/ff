<script>

import { supabase } from "$lib/supabaseClient";

async function testEmailNotification() {
	const { data, error } = await supabase.functions.invoke(
		"send-submission-notification",
		{
			body: {
				formId: "d9e4f7cf-91eb-4e22-aa2c-25d98c2dde4e"
			}
		}
	);

	if (error) {
		console.error("Email error:", error);
		return;
	}

	console.log("Email sent:", data);

}
</script>

<button onclick={testEmailNotification}>
	Send Test Email
</button>
