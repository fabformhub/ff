<script>
	import { BlockWrapper } from "$lib/blocks";
	import { Check, X } from "@lucide/svelte";

	let { value = $bindable(), canAnswer = false } = $props();

	function selectYesNo(val) {
		if (!canAnswer) return;
		value = val;
	}
</script>

<BlockWrapper {canAnswer}>
	<div class={["flex gap-5", !canAnswer && "opacity-40"]}>
		<button
			type="button"
			disabled={!canAnswer}
			onclick={() => selectYesNo(true)}
			aria-pressed={value === true}
			class={[
				"flex-1 flex flex-col items-center justify-center gap-2.5 py-7 rounded-2xl",
				"border-[1.5px] transition-all duration-200 ease-out active:scale-[0.96]",
				canAnswer ? "cursor-pointer" : "cursor-not-allowed",
				value === true
					? "border-pink-500 bg-pink-500"
					: "border-gray-200 bg-gray-50"
			]}
		>
			<Check
				size={26}
				strokeWidth={3}
				class={value === true ? "text-white" : "text-gray-400"}
			/>
			<span
				class={[
					"text-[1.9rem] tracking-tight transition-all duration-200",
					value === true ? "text-white font-medium" : "text-gray-600 font-light"
				]}
			>
				Yes
			</span>
		</button>

		<button
			type="button"
			disabled={!canAnswer}
			onclick={() => selectYesNo(false)}
			aria-pressed={value === false}
			class={[
				"flex-1 flex flex-col items-center justify-center gap-2.5 py-7 rounded-2xl",
				"border-[1.5px] transition-all duration-200 ease-out active:scale-[0.96]",
				canAnswer ? "cursor-pointer" : "cursor-not-allowed",
				value === false
					? "border-gray-900 bg-gray-900"
					: "border-gray-200 bg-gray-50"
			]}
		>
			<X
				size={24}
				strokeWidth={3}
				class={value === false ? "text-white" : "text-gray-400"}
			/>
			<span
				class={[
					"text-[1.9rem] tracking-tight transition-all duration-200",
					value === false ? "text-white font-medium" : "text-gray-600 font-light"
				]}
			>
				No
			</span>
		</button>
	</div>
</BlockWrapper>
