<script>
	import { BlockWrapper } from "$lib/blocks";
	import Mail from "@lucide/svelte/icons/mail";

	let {
		value = $bindable(),
		canAnswer = false,
		props
	} = $props();

	let {
		placeholder = "Enter your email...",
		message = ""
	} = props ?? {};

	let inputValue = $state(value ?? "");
	let focused = $state(false);

	let showIcon = $derived(inputValue.length > 0);

	let isValid = $derived(
		inputValue === "" ||
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)
	);

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

					${showIcon
						? "w-6 opacity-100 translate-x-0"
						: "w-0 opacity-0 -translate-x-2"}
				`}
			>
				<Mail
					class={`
						h-5
						w-5
						transition-colors
						duration-300

						${!isValid
							? "text-red-400"
							: inputValue
								? "text-[#FF2E9A]"
								: "text-[#101112]/30"}
					`}
				/>
			</div>


			<input
				type="email"
				bind:value={inputValue}
				oninput={handleInput}
				onfocus={() => focused = true}
				onblur={() => focused = false}
				placeholder={placeholder}
				tabindex={canAnswer ? 0 : -1}
				readonly={!canAnswer}
				aria-invalid={!isValid}
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

					transition-all
					duration-300

					${!isValid && inputValue
						? "bg-red-400 w-full"
						: "bg-gradient-to-r from-[#FF2E9A] via-pink-500 to-violet-500"}

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


		{#if !isValid && inputValue}
			<p class="mt-3 text-sm text-red-400">
				Please enter a valid email address.
			</p>
		{/if}

	</div>

</BlockWrapper>
