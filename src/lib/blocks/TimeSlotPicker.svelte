<script>
	import { onMount } from "svelte";
	import { BlockWrapper } from "$lib/blocks";
	import CalendarClock from "@lucide/svelte/icons/calendar-clock";
	import Check from "@lucide/svelte/icons/check";

	let { canAnswer = true, value = $bindable() } = $props();

	const now = new Date();
	let availableSlots = $state([
		{ start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30).toISOString() },
		{ start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30).toISOString() },
		{ start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30).toISOString() },
		{ start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 30).toISOString() },
		{ start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 13, 0).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 13, 30).toISOString() }
	]);

	let selectedDate = $state(null);
	let selectedSlot = $state(value);

	let days = $derived(Array.from(new Set(availableSlots.map((s) => new Date(s.start).toDateString()))));

	let filteredSlots = $derived(
		selectedDate
			? availableSlots.filter((s) => new Date(s.start).toDateString() === new Date(selectedDate).toDateString())
			: []
	);

	onMount(() => {
		if (days.length > 0) selectedDate = new Date(days[0]);
	});

	function selectDate(day) {
		if (!canAnswer) return;
		selectedDate = new Date(day);
		selectedSlot = null;
	}

	function selectSlot(slot) {
		if (!canAnswer) return;
		selectedSlot = slot;
		value = slot;
	}

	function dayLabel(day) {
		const d = new Date(day);
		const isToday = d.toDateString() === now.toDateString();
		return isToday ? "Today" : d.toLocaleDateString([], { weekday: "short" });
	}
</script>

<BlockWrapper {canAnswer}>
	<div class="w-full space-y-5">
		<div class="flex items-center gap-2.5">
			<CalendarClock size={20} strokeWidth={2} class="text-pink-500" />
			<span class="text-[1.05rem] font-medium text-gray-900">Pick a time</span>
		</div>

		<div class="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each days as day}
				{@const active = selectedDate?.toDateString() === new Date(day).toDateString()}
				<button
					type="button"
					disabled={!canAnswer}
					onclick={() => selectDate(day)}
					class={[
						"flex-1 min-w-[92px] flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border",
						"transition-colors duration-200",
						canAnswer ? "cursor-pointer" : "cursor-not-allowed",
						active ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-500"
					]}
				>
					<span class={["text-[0.8rem]", active ? "text-pink-800" : "text-gray-400"]}>
						{dayLabel(day)}
					</span>
					<span class={["text-[1rem] font-medium", active ? "text-pink-900" : "text-gray-900"]}>
						{new Date(day).toLocaleDateString([], { month: "short", day: "numeric" })}
					</span>
				</button>
			{/each}
		</div>

		{#if selectedDate}
			{#if filteredSlots.length > 0}
				<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
					{#each filteredSlots as slot}
						{@const active = selectedSlot?.start === slot.start}
						<button
							type="button"
							disabled={!canAnswer}
							onclick={() => selectSlot(slot)}
							class={[
								"py-3.5 rounded-xl border text-[0.95rem] transition-all duration-200",
								"[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
								canAnswer ? "cursor-pointer" : "cursor-not-allowed",
								active
									? "border-pink-500 bg-pink-500 text-white font-medium scale-[1.03]"
									: "border-gray-200 text-gray-600 font-normal hover:border-pink-500 hover:text-gray-900"
							]}
						>
							{new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
						</button>
					{/each}
				</div>
			{:else}
				<p class="text-center text-gray-400 text-sm py-2">No available slots for this date.</p>
			{/if}

			{#if selectedSlot}
				<div class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50">
					<Check size={16} strokeWidth={2.75} class="text-pink-500 shrink-0" />
					<span class="text-[0.95rem] text-gray-900">
						{new Date(selectedSlot.start).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
						at
						{new Date(selectedSlot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
					</span>
				</div>
			{/if}
		{:else}
			<p class="text-center text-gray-400 text-sm py-2">Pick a date to see available times</p>
		{/if}
	</div>
</BlockWrapper>
