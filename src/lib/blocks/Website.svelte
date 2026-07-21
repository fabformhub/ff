<script>
	import { BlockWrapper } from "$lib/blocks";
	import Globe from "@lucide/svelte/icons/globe";

	let {
		value = $bindable(),
		canAnswer = false,
		props
	} = $props();

	let {
		placeholder = "Enter website URL...",
		message = ""
	} = props ?? {};

	let inputValue = $state(value ?? "");
	let focused = $state(false);

	let showGlobe = $derived(inputValue.length > 0);

	let validUrl = $derived(() => {
		try {
			new URL(inputValue);
			return true;
		} catch {
			return false;
		}
	});

	$effect(() => {
		inputValue = value ?? "";
	});

	function handleInput(e) {
		inputValue = e.target.value;
		value = e.target.value;
	}
</script>


<BlockWrapper {canAnswer}>

	<div class="group w-full max-w-3xl pt-4">

		<div class="relative flex items-center">

			<div
				class={`
					mr-4
					flex
					items-center
					transition-all
					duration-300

					${showGlobe
						? "w-6 opacity-100 translate-x-0"
						: "w-0 opacity-0 -translate-x-2"}
				`}
			>
				<Globe
					class={`
						h-5
						w-5
						transition-colors
						duration-300

						${validUrl
							? "text-[#FF2E9A]"
							: "text-[#101112]/30"}
					`}
				/>
			</div>


			<input
				type="url"
				bind:value={inputValue}
				oninput={handleInput}
				onfocus={() => focused = true}
				onblur={() => focused = false}
				placeholder={placeholder}
				tabindex={canAnswer ? 0 : -1}
				readonly={!canAnswer}
				class="
					w-full
					bg-transparent
					border-0
					outline-none

					text-[1.75rem]
					font-light
					tracking-[-0.03em]

					text-[#101112]

					placeholder:text-[#101112]/35

					caret-[#FF2E9A]
				"
			/>

		</div>


		<div class="relative mt-4 h-px overflow-hidden rounded-full bg-[#101112]/15">

			<div
				class={`
					absolute
					inset-y-0
					left-0

					rounded-full

					bg-gradient-to-r
					from-[#FF2E9A]
					via-pink-500
					to-violet-500

					transition-all
					duration-300

					${canAnswer
						? inputValue
							? "w-full"
							: "w-0 group-focus-within:w-full"
						: "w-0"}
				`}
			/>

		</div>


		{#if message}
			<p class="mt-3 text-sm text-[#101112]/45">
				{message}
			</p>
		{/if}

	</div>

</BlockWrapper>
