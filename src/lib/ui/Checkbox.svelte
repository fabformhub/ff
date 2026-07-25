<script>
	let { checked = $bindable(false), label = '' } = $props();
</script>

<label class="flex cursor-pointer select-none items-center space-x-2">
	<input
		type="checkbox"
		bind:checked
		class="h-5 w-5 rounded border-2 border-gray-300 bg-gray-50 text-indigo-600
		       transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
	/>
	{#if label}
		<span class="text-sm text-gray-900">{label}</span>
	{/if}
</label>
