<!-- src/routes/(app)/+layout.svelte -->

<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { authService } from '$lib/services/authService.svelte.js';

    let { children } = $props();

    let loading = $state(true);

    onMount(async () => {
        await authService.init();

        if (!authService.getUser()) {
            goto('/login');
            return;
        }

        loading = false;
    });
</script>

{#if !loading}
    {@render children()}
{/if}
