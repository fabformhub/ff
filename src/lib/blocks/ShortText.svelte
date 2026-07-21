<script>
	import { BlockWrapper } from "$lib/blocks";

	let {
		value = $bindable(),
		canAnswer = false,
		type = "text",
		...restProps
	} = $props();
</script>

<BlockWrapper {canAnswer}>
	<div class="group w-full">
		<input
			{...restProps}
			{type}
			bind:value
			readonly={!canAnswer}
			tabindex={canAnswer ? undefined : -1}
			aria-readonly={!canAnswer}
			class="w-full bg-transparent border-0 outline-none px-0 py-3 text-[2rem] font-light tracking-tight placeholder:text-gray-400"
		/>

		<div class="relative h-[2px] bg-gray-200">
			<div
				class={`absolute left-0 top-0 h-full bg-pink-500 transition-all duration-300
				${canAnswer ? "w-0 group-focus-within:w-full" : "w-0"}`}
			/>
		</div>
	</div>
</BlockWrapper>
