<script>
	let { value = $bindable(), ...props } = $props();
</script>

<textarea
	bind:value
	autofocus
	{...props}
	rows="4"
	class="my-2 block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
	       shadow-md outline-none transition-colors
	       hover:border-gray-400
	       focus:border-indigo-500 focus:bg-white"
></textarea>
