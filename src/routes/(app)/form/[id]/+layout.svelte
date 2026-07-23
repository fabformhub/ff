<script>
	import { Menu } from "$lib/layouts";
	let { data, children } = $props();
</script>
<Menu form={data.form} />
{@render children()}
