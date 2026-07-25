<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input
	bind:value
	autofocus
	{...props}
	class="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900
	       shadow-md outline-none transition-colors
	       hover:border-gray-400
	       focus:border-indigo-500 focus:bg-white"
/>
