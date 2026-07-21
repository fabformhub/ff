<script>
	import { BlockWrapper } from "$lib/blocks";

	let { canAnswer = false, value = $bindable() } = $props();
	let poppingId = $state(null);

	const moods = [
		{ id: 1, label: "Very sad", face: "#F5C4B3", eyes: "#4A1B0C", ring: "#D85A30" },
		{ id: 2, label: "Sad", face: "#FAC775", eyes: "#412402", ring: "#EF9F27" },
		{ id: 3, label: "Neutral", face: "#B4B2A9", eyes: "#2C2C2A", ring: "#888780" },
		{ id: 4, label: "Happy", face: "#97C459", eyes: "#173404", ring: "#639922" }
	];

	function selectValue(id) {
		if (!canAnswer) return;
		value = id;
		poppingId = null;
		requestAnimationFrame(() => (poppingId = id));
	}

	function mouthPath(id) {
		if (id === 1) return "M28 52 Q40 42 52 52";
		if (id === 2) return "M29 50 Q40 44 51 50";
		if (id === 4) return "M27 46 Q40 60 53 46";
		return null;
	}
</script>

<BlockWrapper {canAnswer}>
	<div class={["flex gap-3.5", !canAnswer && "opacity-40"]}>
		{#each moods as mood (mood.id)}
			<button
				type="button"
				disabled={!canAnswer}
				onclick={() => selectValue(mood.id)}
				aria-pressed={value === mood.id}
				aria-label={`Mood rating: ${mood.label}`}
				class={[
					"flex-1 flex flex-col items-center gap-2.5 py-3.5 px-1.5 rounded-2xl bg-transparent",
					canAnswer ? "cursor-pointer" : "cursor-not-allowed"
				]}
			>
				<span
					class={[
						"flex items-center justify-center w-16 h-16 rounded-full transition-all",
						"duration-[260ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
						value === mood.id ? "opacity-100 scale-[1.12]" : "opacity-55 hover:opacity-85",
						poppingId === mood.id && "animate-[pop_380ms_cubic-bezier(0.34,1.56,0.64,1)]"
					]}
					style={value === mood.id
						? `box-shadow: 0 0 0 3px var(--surface-0), 0 0 0 5px ${mood.ring}`
						: ""}
				>
					<svg viewBox="0 0 80 80" width="56" height="56">
						<circle cx="40" cy="40" r="30" fill={mood.face} />
						{#if mood.id === 3}
							<circle cx="30" cy="34" r="3.5" fill={mood.eyes} />
							<circle cx="50" cy="34" r="3.5" fill={mood.eyes} />
							<line x1="29" y1="50" x2="51" y2="50" stroke={mood.eyes} stroke-width="3" stroke-linecap="round" />
						{:else if mood.id === 4}
							<circle cx="30" cy="33" r="4" fill={mood.eyes} />
							<circle cx="50" cy="33" r="4" fill={mood.eyes} />
							<path d={mouthPath(mood.id)} stroke={mood.eyes} stroke-width="3" fill="none" stroke-linecap="round" />
						{:else}
							<circle cx="30" cy="34" r="3.5" fill={mood.eyes} />
							<circle cx="50" cy="34" r="3.5" fill={mood.eyes} />
							<path d={mouthPath(mood.id)} stroke={mood.eyes} stroke-width="3" fill="none" stroke-linecap="round" />
						{/if}
					</svg>
				</span>

				<span
					class={[
						"text-[0.95rem] transition-colors duration-200",
						value === mood.id ? "text-gray-900 font-medium" : "text-gray-400 font-normal"
					]}
				>
					{mood.label}
				</span>
			</button>
		{/each}
	</div>
</BlockWrapper>

<style>
	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.28);
		}
		100% {
			transform: scale(1.12);
		}
	}
</style>
