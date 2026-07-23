<script>
	import { goto } from "$app/navigation";
	import { toast } from "svelte-sonner";
	import { saveEmailSettings } from "$lib/services/emailSettingsService";
	import { Mail, Eye, EyeOff, Loader2, Pause } from "@lucide/svelte";

	let { params, data } = $props();

	const formId = params.id;
	const MESSAGE_LIMIT = 500;

        let enabled = $state(data.emailSettings?.enabled ?? false);
	let subject = $state(data.emailSettings?.subject ?? "");
	let message = $state(data.emailSettings?.message ?? "");
	let saving = $state(false);
	let showPreview = $state(false);
	let activeField = $state("message");

	let subjectEl = $state();
	let messageEl = $state();

	function insertToken(field) {
		const token = `{{${field}}}`;
		const el = activeField === "subject" ? subjectEl : messageEl;
		const current = activeField === "subject" ? subject : message;
		const start = el?.selectionStart ?? current.length;
		const end = el?.selectionEnd ?? current.length;
		const next = current.slice(0, start) + token + current.slice(end);

		if (activeField === "subject") {
			subject = next;
		} else {
			message = next;
		}

		requestAnimationFrame(() => {
			el?.focus();
			const pos = start + token.length;
			el?.setSelectionRange(pos, pos);
		});
	}


	async function save() {
		saving = true;

		try {
			await saveEmailSettings({ formId, enabled, subject, message });
			toast.success("Email settings saved");
			await goto("/dashboard");
		} catch {
			toast.error("Couldn't save email settings. Try again.");
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[#F5FAFF] p-4 sm:p-6 font-sans selection:bg-[#FFE4A8]">
	<div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
	<div class="absolute -top-[35%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/20 to-[#FFC94D]/20 blur-[120px]"></div>
		<div class="absolute -bottom-[35%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/15 to-[#22B573]/10 blur-[120px]"></div>
	</div>

	<div class="relative w-full max-w-[560px] bg-white border border-[#E3ECFA] shadow-[0_8px_30px_rgb(27,33,64,0.06)] rounded-2xl p-8 sm:p-10 transition-all duration-300">
		<span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>


		<!-- Header -->
		<div class="flex items-center gap-4 mb-8">
			<div class="h-11 w-11 shrink-0 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)]">
				<Mail size={20} strokeWidth={2} />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
					Email notification
				</h1>
				<p class="text-sm text-[#5C6685] mt-1">Send yourself an email on every new submission</p>
			</div>
		</div>

		<!-- Toggle -->
		<div class="flex items-center justify-between border-b border-[#E3ECFA] pb-6 mb-6">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-[#1B2140]">Enable notifications</span>
				{#if !enabled}
					<span class="inline-flex items-center gap-1 rounded-full border border-[#E3ECFA] bg-[#F5FAFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#97A0BC]">
						<Pause size={9} strokeWidth={3} />
						Paused
					</span>
				{/if}
			</div>

			<button
				type="button"
				role="switch"
				aria-checked={enabled}
				aria-label="Enable email notifications"
				onclick={() => (enabled = !enabled)}
				class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF] {enabled ? 'bg-[#6C63FF]' : 'bg-[#E3ECFA]'}"
			>
				<span class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 {enabled ? 'translate-x-6' : 'translate-x-1'}"></span>
			</button>
		</div>

		<!-- Fields -->
		<div class="space-y-4 transition-opacity duration-200 {enabled ? '' : 'opacity-50 pointer-events-none'}">
			<div class="relative group">
				<input
					type="text"
					id="subject"
					bind:value={subject}
					bind:this={subjectEl}
					onfocus={() => (activeField = "subject")}
					placeholder=" "
					maxlength="120"
					class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-5 pb-1.5 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
				/>
				<label
					for="subject"
					class="absolute left-4 top-3.5 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
						peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
				>
					Subject line
				</label>
			</div>

			<div class="relative group">
				<textarea
					id="message"
					bind:value={message}
					bind:this={messageEl}
					onfocus={() => (activeField = "message")}
					placeholder=" "
					rows="7"
					maxlength={MESSAGE_LIMIT}
					class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-6 pb-2 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200 resize-none"
				></textarea>
				<label
					for="message"
					class="absolute left-4 top-4 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
						peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
				>
					Message
				</label>
				<span class="absolute right-3.5 bottom-3 text-[11px] font-medium text-[#97A0BC] tabular-nums">
					{message.length}/{MESSAGE_LIMIT}
				</span>
			</div>

			
		<!-- Save -->
		<button
			onclick={save}
			disabled={saving}
			class="w-full rounded-xl bg-[#FF6B4A] text-white py-3 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
		>
			{#if saving}
				<div class="flex items-center justify-center gap-2">
					<Loader2 size={16} class="animate-spin" />
					<span>Saving...</span>
				</div>
			{:else}
				Save changes
			{/if}
		</button>
	</div>
</div>
</div>
