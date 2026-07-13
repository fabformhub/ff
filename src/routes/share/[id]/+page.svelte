<script>
  import { toast } from 'svelte-sonner';
  import { CopyLinkButton } from '$lib/ui';
  import { tooltip } from '$lib/utils/tooltip.js';
  import { DefaultLayout } from '$lib/fabform/layouts/';
  import { APP_URL } from '$lib/utils/global.js';
  
  import { page } from '$app/state';   
  const formId = $derived(page.params.id);

  let embedChoice = $state('Inline Embed');
  let dropdownOpen = $state(false);
  // Derived states
  let url = $derived.by(() => `${APP_URL}/f/${formId}`);
  let embedCode = $derived.by(() => {
    switch (embedChoice) {
      case 'Inline Embed':
        return `<iframe src="${url}" style="width:100%; height:300px;" frameborder="0"></iframe>`;
      case 'Popup':
        return `<button onclick="window.open('${url}', '_blank', 'width=600,height=400')">Open Form</button>`;
      case 'Fullpage':
        return `<a href="${url}" target="_blank">Go to Fullpage Form</a>`;
      default:
        return '';
    }
  });
  // Copy handler
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success('Code Copied!');
    } catch (err) {
      console.error('[COPY] failed', err);
      toast.error('Failed to copy code');
    }
  }
</script>
<DefaultLayout bind:formId={formId} activeMenuLabel="Share">
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
    <div class="w-full max-w-4xl space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <!-- Link + Copy -->
      <div class="flex flex-col space-y-4 items-center md:items-start">
        <div class="w-full flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0">
          <input
            class="w-full md:w-80 px-3 py-2 rounded-md border border-gray-300 text-gray-800 text-sm"
            type="text"
            readonly
            value={url}
          />
          <CopyLinkButton link={url} />
        </div>
        <!-- Hardcoded Dropdown -->
        <div class="relative inline-block text-left">
          <button
            class="inline-flex justify-between w-40 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
            on:click={() => (dropdownOpen
