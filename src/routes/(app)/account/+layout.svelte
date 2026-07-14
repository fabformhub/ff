<script>
  import { AccountMenu } from '$lib/layouts';
  import { ArrowLeft } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  let { data, children } = $props();

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      goto('/dashboard');
    }
  }
</script>

<AccountMenu/>

<div class="px-8 pt-5">
  <button
    onclick={goBack}
    title="Go back"
    aria-label="Go back"
    class="group relative inline-flex h-10 w-10 items-center justify-center rounded-full
           border border-[#e3ecfa] bg-white text-[#5c6685]
           shadow-[0_2px_6px_-3px_rgba(27,33,64,0.12)]
           transition-all duration-200 ease-out
           hover:border-[#6c63ff] hover:text-[#6c63ff] hover:scale-[1.04]
           hover:shadow-[0_8px_20px_-8px_rgba(108,99,255,0.45)]
           active:scale-95 active:duration-100
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]/40 focus-visible:ring-offset-2
           motion-reduce:transition-none motion-reduce:hover:scale-100"
  >
    <ArrowLeft
      class="h-[18px] w-[18px] transition-transform duration-200 ease-out
             group-hover:-translate-x-0.5 group-active:-translate-x-1
             motion-reduce:group-hover:translate-x-0"
      strokeWidth={2.25}
    />
  </button>
</div>

<main class="flex-1 p-8">
  {@render children()}
</main>
