<script>
	import { BlockWrapper } from "$lib/blocks";
	import Minus from "@lucide/svelte/icons/minus";
	import Plus from "@lucide/svelte/icons/plus";

	let {
		value = $bindable(),
		canAnswer = true,
		min = 0,
		max = 999999,
		step = 1,
		prefix = "",
		suffix = ""
	} = $props();

	let number = $state(String(value ?? ""));
	let focused = $state(false);

	$effect(() => {
		if (!focused) {
			number = String(value ?? "");
		}
	});

	function updateNumber(next) {
		let parsed = Number(next);

		if (Number.isNaN(parsed)) {
			number = "";
			value = "";
			return;
		}

		parsed = Math.max(min, Math.min(max, parsed));

		number = String(parsed);
		value = parsed;
	}

	function change(amount) {
		if (!canAnswer) return;
		updateNumber(Number(number || 0) + amount);
	}

	function handleBeforeInput(e) {
		if (!e.data) return;
		if (!/^\d+$/.test(e.data)) {
			e.preventDefault();
		}
	}

	function handlePaste(e) {
		const text = e.clipboardData.getData("text");

		if (!/^\d+$/.test(text)) {
			e.preventDefault();
		}
	}

	function handleInput(e) {
		const clean = e.target.value.replace(/\D/g, "");

		number = clean;
		value = clean === "" ? "" : Number(clean);
	}

	function handleBlur() {
		focused = false;

		if (number !== "") {
			updateNumber(number);
		}
	}
</script>

<BlockWrapper {canAnswer}>
	<div class="group w-full max-w-xl pt-4">

		<div class="flex items-center gap-6">

			<button
				type="button"
				onclick={() => change(-step)}
				disabled={!canAnswer}
				class="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all duration-200 hover:border-zinc-400 hover:text-zinc-900 active:scale-95 disabled:opacity-30"
			>
				<Minus class="h-5 w-5" />
			</button>

			<div class="flex flex-1 items-center justify-center">

				{#if prefix}
					<span class="mr-2 text-3xl font-light text-zinc-400">
						{prefix}
					</span>
				{/if}

				<input
					value={number}
					onbeforeinput={handleBeforeInput}
					onpaste={handlePaste}
					oninput={handleInput}
					onfocus={() => (focused = true)}
					onblur={handleBlur}
					inputmode="numeric"
					pattern="[0-9]*"
					readonly={!canAnswer}
					class="w-40 bg-transparent text-center text-[3rem] font-light tracking-[-0.05em] text-zinc-900 outline-none placeholder:text-zinc-300 caret-fuchsia-500 disabled:text-zinc-400"
				/>

				{#if suffix}
					<span class="ml-2 text-3xl font-light text-zinc-400">
						{suffix}
					</span>
				{/if}

			</div>

			<button
				type="button"
				onclick={() => change(step)}
				disabled={!canAnswer}
				class="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all duration-200 hover:border-zinc-400 hover:text-zinc-900 active:scale-95 disabled:opacity-30"
			>
				<Plus class="h-5 w-5" />
			</button>

		</div>

		<div class="relative mt-4 h-px overflow-hidden rounded-full bg-zinc-200">
			<div
				class={`absolute inset-y-0 left-0 rounded-full
				bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500
				transition-all duration-300 ease-out
				${canAnswer
					? number
						? "w-full"
						: "w-0 group-focus-within:w-full"
					: "w-0"}`}
			/>
		</div>

	</div>
</BlockWrapper>
