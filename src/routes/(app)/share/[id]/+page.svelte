<script>
  import { CopyLinkButton, Dropdown } from '$lib/ui';
  import { Clipboard } from '@lucide/svelte';
  import { tooltip } from '$lib/utils/tooltip.js';
  import { Menu } from '$lib/layouts';
  import { APP_URL } from '$lib/utils/global.js';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';

  const formId = $derived(page.params.id);

  const url = $derived(`${APP_URL}/f/${formId}`);

  let embedChoice = $state('Inline Embed');

  const embedCode = $derived.by(() => {
    switch (embedChoice) {
      case 'Inline Embed':
        return `<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`;

      case 'Popup':
        return `<button onclick="window.open('${url}','_blank','width=600,height=700')">
  Open Form
</button>`;

      case 'Fullpage':
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">
  Open Form
</a>`;

      default:
        return '';
    }
  });

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);

      toast.success('Embed code copied!');
    } catch (err) {
      toast.error('Failed to copy code');
      console.error(err);
    }
  }
</script>

<Menu {formId} />
  <div class="min-h-screen bg-gray-50 px-6 py-12">
    <div class="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Share your form
        </h1>

        <p class="mt-2 text-gray-600">
          Share your form with a direct link or embed it on your website.
        </p>
      </div>

      <div class="space-y-6">

        <!-- Form URL -->
        <div class="flex flex-col gap-3 md:flex-row">
          <input
            class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
            readonly
            value={url}
          />

          <CopyLinkButton link={url} />
        </div>

        <!-- Embed Type -->
        <div class="max-w-xs">
          <Dropdown
            choices={['Inline Embed', 'Popup', 'Fullpage']}
            bind:value={embedChoice}
          />
        </div>

        <!-- Embed Code -->
        <div class="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          <div class="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <span class="text-sm font-medium text-slate-300">
              Embed Code
            </span>

            <button
              use:tooltip={{ text: 'Copy code', position: 'bottom' }}
              onclick={copyCode}
              class="rounded-md p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              aria-label="Copy embed code"
            >
              <Clipboard class="h-5 w-5" />
            </button>
          </div>

          <pre class="overflow-auto p-5 text-sm leading-6 text-green-300">
<code>{embedCode}</code>
          </pre>

        </div>

      </div>

    </div>
  </div>
