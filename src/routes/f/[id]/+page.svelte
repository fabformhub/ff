<!-- src/routes/(wherever)/[id]/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ArrowDown, ArrowUp } from '@lucide/svelte';
	import { FormView } from '$lib/form-builder';
	import { SplashScreen } from '$lib/ui';
	import { incrementFormViews } from '$lib/services/formService.js';
	import { createResponse } from '$lib/services/responseService.js';
	import { validateBlock } from '$lib/utils/validation.js';
	import { page } from '$app/state';
	import { supabase } from '$lib/supabaseClient';

	// 1. Receive data pre-loaded by +page.js
	let { data } = $props();

	// 2. Read-only form metadata
	let form = $derived(data.form);

	// 3. Mutable reactive state for blocks using $derived for immediate sync
	let blocks = $derived(data.blocks ? [...data.blocks] : []);
	let blockNo = $state(0);
	let showSplash = $state(true);
	let errorMessage = $state('');
	let submitted = $state(false);

	let direction = $state('bottom');
	let flyParams = $state({});

	// -----------------------------
	// ANIMATION CONFIG
	// -----------------------------
	function updateFlyParams() {
		if (typeof window === 'undefined') return;
		const vh = window.innerHeight;
		const offsetMultiplier = 1.5;

		flyParams = {
			y: direction === 'top' ? -vh * offsetMultiplier : vh * offsetMultiplier,
			duration: 900,
			opacity: 0.7,
			easing: (t) => 1 - Math.pow(1 - t, 3)
		};
	}

	onMount(() => {
		const splashTimer = setTimeout(() => (showSplash = false), 3000);

		if (form?.id) {
			incrementFormViews(form.id).catch(() => {});
		}

		updateFlyParams();

		window.addEventListener('resize', updateFlyParams);
		window.addEventListener('orientationchange', updateFlyParams);

		return () => {
			clearTimeout(splashTimer);
			window.removeEventListener('resize', updateFlyParams);
			window.removeEventListener('orientationchange', updateFlyParams);
		};
	});

	// -----------------------------
	// RESPONSES
	// -----------------------------


// -----------------------------
// RESPONSES
// -----------------------------
async function submitResponses() {
    const formId = form?.id;

    if (!formId) {
        console.error("Cannot submit: form.id is missing or undefined.");
        errorMessage = "Form configuration error. Please refresh and try again.";
        return;
    }

    const responses = blocks
        .filter((b) => b.value != null)
        .map((b) => ({
            blockId: b.id,
            type: b.meta?.type,
            question: b.meta?.question || b.meta?.title,
            answer: b.value
        }));

    const res = await createResponse(formId, responses);

    if (!res.success) {
        console.error("Failed to save response:", res.error);
        errorMessage = "Failed to save your response. Please try again.";
        return; // Stop execution here so user can retry!
    }

    supabase.functions.invoke('send-submission-notification', {
        body: { formId, responses }
    }).catch((err) => console.error("Notification function failed:", err));


    submitted = true;
}
	// -----------------------------
	// NAVIGATION
	// -----------------------------
	async function nextBlock() {
		errorMessage = '';

		const block = blocks[blockNo];
		if (!block) return;

		// Check against string type 'thank-you'
		if (block.meta?.component !== 'ThankYou' && block.meta?.type !== 'thank-you') {

			const err = validateBlock(block);
			if (err) {
				errorMessage = err;
				return;
			}
		}

		if (blockNo === blocks.length - 2) {
			await submitResponses();
		}

		if (blockNo < blocks.length - 1) {
			direction = 'bottom';
			updateFlyParams();
			blockNo += 1;
		}
	}

	function previousBlock() {
		if (blockNo > 0) {
			direction = 'top';
			updateFlyParams();
			blockNo -= 1;
		}
	}
</script>

<main class="h-[100dvh] w-full flex flex-col relative overflow-hidden">

	{#if showSplash}
		<div class="flex-1 flex items-center justify-center">
			<div transition:fade={{ duration: 600 }}>
				<SplashScreen />
			</div>
		</div>

	{:else if !form || blocks.length === 0}
		<div class="flex-1 flex items-center justify-center text-center text-red-600 text-lg px-4">
			<div>
				<p>{errorMessage || 'Unable to load form or this form has no questions.'}</p>
				<p class="text-sm text-gray-500 mt-2">
					Please check the link or try again later.
				</p>
			</div>
		</div>

	{:else}

		<!-- FORM VIEWPORT AREA -->
		{#key blockNo}
			<div in:fly={flyParams} class="w-full h-full flex items-center justify-center">
				{#if blocks[blockNo]}
					<FormView
						form={data.form}
						bind:block={blocks[blockNo]}
						canAnswer={true}
						{errorMessage}
						{nextBlock}
					/>
				{/if}
			</div>
		{/key}

	{/if}

	<!-- NAVIGATION CONTROLS -->
	<div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">

		{#if !submitted && blocks.length > 0}
			<div class="flex gap-2 items-center">

				{#if blockNo > 0}
					<button
						onclick={previousBlock}
						class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
						aria-label="Previous question"
					>
						<ArrowUp size={16} />
					</button>
				{/if}

				{#if blockNo < blocks.length - 2}
					<button
						onclick={nextBlock}
						class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
						aria-label="Next question"
					>
						<ArrowDown size={16} />
					</button>
				{/if}

			</div>
		{/if}

		<a
			href="https://fabform.io"
			target="_blank"
			rel="noreferrer"
			class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800"
		>
			<span class="text-gray-300">Powered by</span>
			<span class="text-white">FabForm</span>
		</a>

	</div>

</main>
