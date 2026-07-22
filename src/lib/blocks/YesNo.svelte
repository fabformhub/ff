<script>
	import { BlockWrapper } from "$lib/blocks";
	import { Check, X } from "@lucide/svelte";

	let { value = $bindable(), canAnswer = false } = $props();

	let shakeYes = $state(false);
	let shakeNo = $state(false);
	let poppedYes = $state(false);
	let poppedNo = $state(false);
	let confetti = $state([]);
	let confettiId = 0;

	const YES_CONFETTI = ["#065f46", "#facc15", "#ffffff"];
	const NO_CONFETTI = ["#7f1d1d", "#facc15", "#ffffff"];

	function vibrate(pattern) {
		if (typeof navigator !== "undefined" && navigator.vibrate) {
			navigator.vibrate(pattern);
		}
	}

	function triggerShake(which) {
		if (which === "yes") {
			shakeYes = false;
			requestAnimationFrame(() => (shakeYes = true));
		} else {
			shakeNo = false;
			requestAnimationFrame(() => (shakeNo = true));
		}
		vibrate([10, 40, 10]);
	}

	function triggerPop(which) {
		if (which === "yes") {
			poppedYes = false;
			requestAnimationFrame(() => (poppedYes = true));
		} else {
			poppedNo = false;
			requestAnimationFrame(() => (poppedNo = true));
		}
		vibrate(14);
	}

	function addConfetti(event, tone) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = (event.clientX ?? rect.left + rect.width / 2) - rect.left;
		const y = (event.clientY ?? rect.top + rect.height / 2) - rect.top;
		const palette = tone === "yes" ? YES_CONFETTI : NO_CONFETTI;
		const pieces = Array.from({ length: 10 }, () => {
			const angle = Math.random() * Math.PI * 2;
			const distance = 40 + Math.random() * 40;
			return {
				id: confettiId++,
				tone,
				x,
				y,
				dx: Math.cos(angle) * distance,
				dy: Math.sin(angle) * distance - 10,
				rotate: Math.random() * 360,
				color: palette[Math.floor(Math.random() * palette.length)],
				size: 5 + Math.random() * 4
			};
		});
		confetti = [...confetti, ...pieces];
		const ids = new Set(pieces.map((p) => p.id));
		setTimeout(() => {
			confetti = confetti.filter((p) => !ids.has(p.id));
		}, 600);
	}

	function selectYesNo(val, event) {
		const which = val ? "yes" : "no";
		if (!canAnswer) {
			triggerShake(which);
			return;
		}
		addConfetti(event, which);
		triggerPop(which);
		value = val;
	}
</script>

<BlockWrapper {canAnswer}>
	<div class="tv-stage">
		<div class={["relative flex gap-4", !canAnswer && "opacity-40"]}>
			<button
				type="button"
				aria-disabled={!canAnswer}
				tabindex={canAnswer ? 0 : -1}
				onclick={(e) => selectYesNo(true, e)}
				onanimationend={() => {
					shakeYes = false;
					poppedYes = false;
				}}
				aria-pressed={value === true}
				class:pop={poppedYes}
				class:shake={shakeYes}
				class:tv-tile-pressed={value === true}
				class={[
					"tv-tile tv-tile-yes group relative flex-1 flex flex-col items-center justify-center gap-3.5 pt-8 pb-7",
					canAnswer ? "cursor-pointer" : "cursor-not-allowed"
				]}
			>
				{#if value === true}
					<div class="tv-badge tv-badge-yes">SELECTED</div>
				{/if}

				{#each confetti.filter((c) => c.tone === "yes") as c (c.id)}
					<span
						class="confetti absolute pointer-events-none"
						style="left:{c.x}px; top:{c.y}px; width:{c.size}px; height:{c.size}px; background:{c.color}; --dx:{c.dx}px; --dy:{c.dy}px; --rot:{c.rotate}deg;"
					></span>
				{/each}

				<div class="tv-icon-box tv-icon-box-yes">
					<Check size={26} strokeWidth={4} class="text-emerald-950" />
				</div>

				<span class="tv-label">YES</span>
			</button>

			<button
				type="button"
				aria-disabled={!canAnswer}
				tabindex={canAnswer ? 0 : -1}
				onclick={(e) => selectYesNo(false, e)}
				onanimationend={() => {
					shakeNo = false;
					poppedNo = false;
				}}
				aria-pressed={value === false}
				class:pop={poppedNo}
				class:shake={shakeNo}
				class:tv-tile-pressed={value === false}
				class={[
					"tv-tile tv-tile-no group relative flex-1 flex flex-col items-center justify-center gap-3.5 pt-8 pb-7",
					canAnswer ? "cursor-pointer" : "cursor-not-allowed"
				]}
			>
				{#if value === false}
					<div class="tv-badge tv-badge-no">SELECTED</div>
				{/if}

				{#each confetti.filter((c) => c.tone === "no") as c (c.id)}
					<span
						class="confetti absolute pointer-events-none"
						style="left:{c.x}px; top:{c.y}px; width:{c.size}px; height:{c.size}px; background:{c.color}; --dx:{c.dx}px; --dy:{c.dy}px; --rot:{c.rotate}deg;"
					></span>
				{/each}

				<div class="tv-icon-box tv-icon-box-no">
					<X size={24} strokeWidth={4} class="text-rose-950" />
				</div>

				<span class="tv-label">NO</span>
			</button>
		</div>
	</div>
</BlockWrapper>

<style>
	.tv-stage {
		padding: 8px;
		background: #fef3c7;
		border: 3px solid #18181b;
	}

	/* Flat color, square corners, hard offset shadow instead of blur/glow —
	   the shadow itself is the depth cue, and it collapses on press/select
	   so the tile visually "sits down" like a physical game-show button. */
	.tv-tile {
		border: 3px solid #18181b;
		outline: none;
		transform: translate(0, 0);
		transition: transform 120ms ease-out, box-shadow 120ms ease-out;
	}

	.tv-tile-yes {
		background: #4ade80;
		box-shadow: 6px 6px 0 0 #18181b;
	}

	.tv-tile-no {
		background: #fb7185;
		box-shadow: 6px 6px 0 0 #18181b;
	}

	.tv-tile:hover,
	.tv-tile:focus-visible {
		transform: translate(-2px, -2px);
		box-shadow: 8px 8px 0 0 #18181b;
	}

	.tv-tile:focus-visible {
		outline: 3px solid #18181b;
		outline-offset: 3px;
	}

	.tv-tile:active {
		transform: translate(3px, 3px);
		box-shadow: 3px 3px 0 0 #18181b;
	}

	.tv-tile-pressed {
		transform: translate(6px, 6px) !important;
		box-shadow: 0 0 0 0 #18181b !important;
	}

	.tv-icon-box {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		background: #ffffff;
		border: 3px solid #18181b;
		box-shadow: 3px 3px 0 0 #18181b;
		transition: transform 150ms ease-out;
	}

	.tv-tile:hover .tv-icon-box,
	.tv-tile:focus-visible .tv-icon-box {
		transform: rotate(-6deg);
	}

	.tv-tile-no:hover .tv-icon-box,
	.tv-tile-no:focus-visible .tv-icon-box {
		transform: rotate(6deg);
	}

	.tv-tile-pressed .tv-icon-box {
		transform: rotate(0deg) !important;
		box-shadow: none;
	}

	.tv-label {
		position: relative;
		font-size: 1.85rem;
		font-weight: 900;
		letter-spacing: 0.02em;
		color: #18181b;
		text-transform: uppercase;
	}

	.tv-badge {
		position: absolute;
		top: -3px;
		right: -3px;
		padding: 4px 10px;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		color: #ffffff;
		background: #18181b;
		border-left: 3px solid #18181b;
		border-bottom: 3px solid #18181b;
	}

	@keyframes pop {
		0% {
			transform: translate(6px, 6px);
		}
		40% {
			transform: translate(-3px, -3px) scale(1.04);
		}
		70% {
			transform: translate(1px, 1px);
		}
		100% {
			transform: translate(6px, 6px);
		}
	}

	@keyframes shake {
		10%,
		90% {
			transform: translateX(-2px);
		}
		20%,
		80% {
			transform: translateX(3px);
		}
		30%,
		50%,
		70% {
			transform: translateX(-5px);
		}
		40%,
		60% {
			transform: translateX(5px);
		}
	}

	@keyframes confettiBurst {
		0% {
			transform: translate(0, 0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
			opacity: 0;
		}
	}

	.pop {
		animation: pop 380ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	.shake {
		animation: shake 380ms ease-in-out both;
	}

	.confetti {
		animation: confettiBurst 600ms ease-out forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.pop,
		.shake,
		.confetti {
			animation: none !important;
		}
		.tv-tile,
		.tv-icon-box {
			transition: none !important;
		}
	}
</style>
