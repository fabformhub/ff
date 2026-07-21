<script>
	import { BlockWrapper } from "$lib/blocks";

	let {
		value = $bindable(),
		canAnswer = false,
		label = "",
		...restProps
	} = $props();
</script>

<BlockWrapper {canAnswer}>
	<label
		class={[
			"inline-flex items-center gap-4 select-none",
			canAnswer ? "cursor-pointer" : "cursor-not-allowed",
			!canAnswer && "opacity-40"
		]}
	>
		<input
			{...restProps}
			type="checkbox"
			bind:checked={value}
			disabled={!canAnswer}
			tabindex={canAnswer ? 0 : -1}
			class="absolute opacity-0 w-0 h-0"
		/>

		<span
			class={[
				"relative w-8 h-8 shrink-0 rounded-md border-2 border-gray-900",
				"shadow-[4px_4px_0_theme(colors.gray.900)]",
				"transition-all duration-300",
				value ? "bg-pink-500" : "bg-gray-200"
			]}
		>
			<span
				class={[
					"absolute top-[6px] left-[11px] w-[7px] h-[15px]",
					"border-white border-r-[2.5px] border-b-[2.5px] border-t-0 border-l-0",
					"rotate-45",
					value ? "block" : "hidden"
				]}
			></span>
		</span>

		<span class="text-[1.75rem] font-light tracking-tight text-gray-900">
			{label}
		</span>
	</label>
</BlockWrapper>
