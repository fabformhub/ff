<script>
	import { onMount } from "svelte";
	import { BlockWrapper } from "$lib/blocks";
	import RefreshCw from "@lucide/svelte/icons/refresh-cw";

	let { value = $bindable(), formMode = true } = $props();

	let canvas;
	let ctx;
	let strokes = [];
	let currentStroke = [];
	let isDrawing = false;
	let hasDrawn = $state(false);
	let scaleX = 1;
	let scaleY = 1;

	function resizeCanvas() {
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		scaleX = canvas.width / rect.width;
		scaleY = canvas.height / rect.height;
		ctx = canvas.getContext("2d");
		ctx.scale(scaleX, scaleY);
	}

	function getPos(event) {
		const rect = canvas.getBoundingClientRect();
		const clientX = event.touches ? event.touches[0].clientX : event.clientX;
		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		return { x: clientX - rect.left, y: clientY - rect.top };
	}

	function startDraw(event) {
		if (!formMode) return;
		isDrawing = true;
		hasDrawn = true;
		currentStroke = [];
		strokes.push(currentStroke);
		currentStroke.push(getPos(event));
	}

	function draw(event) {
		if (!formMode || !isDrawing) return;
		currentStroke.push(getPos(event));
		redraw();
	}

	function stopDraw() {
		if (!formMode || !isDrawing) return;
		isDrawing = false;
		saveSignature();
	}

	function controlPoints(p0, p1, p2, p3) {
		const smoothing = 0.2;
		const cp1x = p1.x + (p2.x - p0.x) * smoothing;
		const cp1y = p1.y + (p2.y - p0.y) * smoothing;
		const cp2x = p2.x - (p3.x - p1.x) * smoothing;
		const cp2y = p2.y - (p3.y - p1.y) * smoothing;
		return [{ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }];
	}

	function redraw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = 2.5;
		ctx.strokeStyle = "#D4537E";

		for (const stroke of strokes) {
			if (stroke.length < 2) continue;
			ctx.beginPath();
			for (let i = 0; i < stroke.length - 1; i++) {
				const p0 = stroke[i - 1] || stroke[i];
				const p1 = stroke[i];
				const p2 = stroke[i + 1];
				const p3 = stroke[i + 2] || p2;
				if (i === 0) ctx.moveTo(p1.x, p1.y);
				const [cp1, cp2] = controlPoints(p0, p1, p2, p3);
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
			}
			ctx.stroke();
		}
	}

	function clearCanvas() {
		strokes = [];
		currentStroke = [];
		hasDrawn = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		value = "";
	}

	function saveSignature() {
		value = canvas.toDataURL("image/png");
	}

	onMount(() => {
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		return () => window.removeEventListener("resize", resizeCanvas);
	});
</script>

<BlockWrapper canAnswer={formMode}>
	<div class="w-full space-y-3">
		<div class="relative rounded-2xl border border-gray-200 bg-gray-50 h-56 overflow-hidden">
			<div class="absolute left-6 right-6 bottom-14 border-b-[1.5px] border-gray-300"></div>

			{#if !hasDrawn}
				<div
					class="absolute left-6 bottom-[3.7rem] text-[1.3rem] italic text-gray-400 pointer-events-none"
					style="font-family: Georgia, serif;"
				>
					Sign here
				</div>
			{/if}

			<button
				type="button"
				aria-label="Clear signature"
				onclick={clearCanvas}
				disabled={!formMode}
				class={[
					"absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
					"text-[0.8rem] text-gray-400 bg-transparent transition-colors duration-150",
					formMode ? "hover:text-pink-600 hover:bg-white cursor-pointer" : "cursor-not-allowed opacity-40"
				]}
			>
				<RefreshCw size={14} strokeWidth={2} />
				Clear
			</button>

			<canvas
				bind:this={canvas}
				class={["absolute inset-0 w-full h-full touch-none", formMode ? "cursor-crosshair" : "cursor-not-allowed"]}
				onmousedown={startDraw}
				onmousemove={draw}
				onmouseup={stopDraw}
				onmouseleave={stopDraw}
				ontouchstart={(e) => { e.preventDefault(); startDraw(e); }}
				ontouchmove={(e) => { e.preventDefault(); draw(e); }}
				ontouchend={(e) => { e.preventDefault(); stopDraw(e); }}
			></canvas>
		</div>

		<p class="text-center text-[0.8rem] text-gray-400">
			Draw your signature above using your mouse or finger
		</p>
	</div>
</BlockWrapper>
