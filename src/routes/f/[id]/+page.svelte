<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ArrowDown, ArrowUp } from '@lucide/svelte';
	import { FormView } from '$lib/form-builder';
	import { SplashScreen } from '$lib/ui';
	import { getForm, incrementFormViews, getBlocksByFormId } from '$lib/services/formService.js';
	import { createResponse } from '$lib/services/responseService.js';
 	import { validateBlock } from '$lib/utils/validation.js';
        import { page } from '$app/state';   
        const formId = $derived(page.params.id);
        import { supabase } from '$lib/supabaseClient'

	let showSplash = $state(true);
	let errorMessage = $state('');
	let blocks = $state([]);
	let blockNo = $state(0);
	let submitted = $state(false);
	let form = $state(null);

	let direction = $state('bottom');
	let flyParams = $state({});
	let firstBlockLoaded = $state(false);

	// -----------------------------
	// ANIMATION CONFIG
	// -----------------------------
	function updateFlyParams() {
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
		setTimeout(() => (showSplash = false), 3000);

		loadForm();
		updateFlyParams();

		window.addEventListener('resize', updateFlyParams);
		window.addEventListener('orientationchange', updateFlyParams);

		return () => {
			window.removeEventListener('resize', updateFlyParams);
			window.removeEventListener('orientationchange', updateFlyParams);
		};
	});

	// -----------------------------
	// LOAD FORM
	// -----------------------------
	async function loadForm() {
		const formRes = await getForm(formId);

		if (!formRes.success) {
			errorMessage = formRes.error;
			return;
		}

		form = formRes.data.form;

		incrementFormViews(form.id);

		const blocksRes = await getBlocksByFormId(form.id);

		if (!blocksRes.success) {
			errorMessage = blocksRes.error;
			return;
		}

		blocks = blocksRes.data.blocks
			.slice()
			.sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId);

		blockNo = 0;
		firstBlockLoaded = true;
	}

	// -----------------------------
	// RESPONSES
	// -----------------------------
	async function submitResponses() {
		const responses = blocks
			.filter((b) => b.value != null)
			.map((b) => ({
				blockId: b.id,
				blockTypeId: b.meta.blockTypeId,
				question: b.meta.question,
				answer: b.value
			}));

		await createResponse(formId, responses);
                const { data, error } = await 
                supabase.functions.invoke("send-submission-notification",{ body: { formId: form.id } });
		submitted = true;
	}

	// -----------------------------
	// NAVIGATION
	// -----------------------------
	async function nextBlock() {
		errorMessage = '';

		const block = blocks[blockNo];

		if (block.type !== 'thankyou') {
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

<!--
  🔥 CRITICAL FIX:
  Use 100dvh + flex column so scroll is stable across browsers/mobile
-->
<main class="h-[100dvh] w-full flex flex-col relative overflow-hidden">

	{#if showSplash}
		<div class="flex-1 flex items-center justify-center">
			<div transition:fade={{ duration: 600 }}>
				<SplashScreen />
			</div>
		</div>

	{:else if errorMessage && blocks.length === 0}
		<div class="flex-1 flex items-center justify-center text-center text-red-600 text-lg px-4">
			<div>
				<p>{errorMessage}</p>
				<p class="text-sm text-gray-500 mt-2">
					Please check the link or try again later.
				</p>
			</div>
		</div>

	{:else if firstBlockLoaded}

		<!-- FORM AREA (stable viewport container) -->

			{#key blockNo}

				<div in:fly={flyParams} class="w-full h-full flex items-center justify-center">
					<FormView
						form={form}
						canAnswer={true}
						bind:block={blocks[blockNo]}
						{errorMessage}
						{nextBlock}
					/>
				</div>
			{/key}

	{/if}

	<!-- NAVIGATION UI -->
	<div class="absolute bottom-10 right-10 z-10 flex gap-4 items-center">

		{#if !submitted}
			<div class="flex gap-2 items-center">

				{#if blockNo > 0}
					<button
						on:click={previousBlock}
						class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
					>
						<ArrowUp size={16} />
					</button>
				{/if}

				{#if blockNo < blocks.length - 2}
					<button
						on:click={nextBlock}
						class="w-8 h-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
					>
						<ArrowDown size={16} />
					</button>
				{/if}

			</div>
		{/if}

		<a
			href="https://fabform.io"
			target="_blank"
			class="bg-black text-white text-sm flex items-center gap-2 py-1 px-4 rounded-md hover:bg-gray-800"
		>
			<span class="text-gray-300">Powered by</span>
			<span class="text-white">FabForm</span>
		</a>

	</div>

</main>
