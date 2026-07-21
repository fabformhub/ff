<script>
	import { BlockWrapper } from "$lib/blocks";

	let {
		value = $bindable(),
		canAnswer = false,
		size = "Medium",
		...restProps
	} = $props();

	const sizeClasses = {
		Small: "min-h-32",
		Medium: "min-h-44",
		Large: "min-h-56",
		"Extra Large": "min-h-72"
	};

	let textarea;

	function autoResize() {
		if (!textarea) return;
		textarea.style.height = "0px";
		textarea.style.height = `${Math.max(textarea.scrollHeight, 128)}px`;
	}

	$effect(() => {
		value;
		autoResize();
	});
</script>

<BlockWrapper {canAnswer}>
	<div class="group w-full max-w-3xl pt-4">
		<textarea
			bind:this={textarea}
			{...restProps}
			bind:value
			readonly={!canAnswer}
			tabindex={canAnswer ? undefined : -1}
			aria-readonly={!canAnswer}
			oninput={autoResize}
			class={`w-full resize-none overflow-hidden bg-transparent
				border-0 outline-none shadow-none
				text-[1.5rem] leading-relaxed font-light tracking-[-0.02em]
				text-[#101112]
				placeholder:text-[#101112]/35
				selection:bg-fuchsia-500/20
				transition-colors duration-200
				${sizeClasses[size] ?? sizeClasses.Medium}
				${canAnswer
					? "caret-fuchsia-500"
					: "text-[#101112]/40 cursor-not-allowed"}`}
		></textarea>

		<div class="relative mt-3 h-px overflow-hidden rounded-full bg-[#101112]/15">
			<div
				class={`absolute inset-y-0 left-0 rounded-full
					bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500
					transition-all duration-300 ease-out
					${canAnswer
						? value
							? "w-full"
							: "w-0 group-focus-within:w-full"
						: "w-0"}`}
			/>
		</div>
	</div>
</BlockWrapper>
