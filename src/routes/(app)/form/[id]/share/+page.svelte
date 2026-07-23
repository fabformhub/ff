<script>
  import { CopyLinkButton, Dropdown } from '$lib/ui';
  import { Clipboard, Link2, Code2, Check } from '@lucide/svelte';
  import { tooltip } from '$lib/utils/tooltip.js';
  import { APP_URL } from '$lib/utils/global.js';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';

  const formId = $derived(page.params.id);
  const url = $derived(`${APP_URL}/f/${formId}`);
  let embedChoice = $state('Inline Embed');
  let justCopied = $state(false);

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
      justCopied = true;
      setTimeout(() => (justCopied = false), 1800);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error(err);
    }
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="relative min-h-screen bg-[#F5FAFF] px-4 py-12 sm:px-6 font-sans overflow-hidden">
  <!-- Decorative blurred blobs, echoing the auth screen -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div class="absolute -top-[30%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/20 to-[#FFC94D]/20 blur-[120px]"></div>
    <div class="absolute -bottom-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/15 to-[#22B573]/10 blur-[120px]"></div>
  </div>

  <div class="relative mx-auto max-w-3xl">
    <div class="relative rounded-2xl border border-[#E3ECFA] bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(27,33,64,0.06)] transition-all duration-300">
      <!-- Pin accent -->
      <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>

      <div class="mb-8">
        <h1
          class="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2140]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Share your form
        </h1>
        <p class="mt-1.5 text-sm text-[#5C6685]">
          Share your form with a direct link or embed it on your website.
        </p>
      </div>

      <div class="space-y-7">
        <!-- Form URL -->
        <div>
          <div class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#97A0BC]">
            <Link2 class="h-3.5 w-3.5" />
            <span>Direct link</span>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              class="flex-1 rounded-xl border border-[#E3ECFA] bg-[#F5FAFF] px-4 py-3 text-sm text-[#1B2140] outline-none transition-all duration-200 focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] focus:bg-white"
              readonly
              value={url}
            />
            <div class="shrink-0">
              <CopyLinkButton link={url} />
            </div>
          </div>
        </div>

        <!-- Embed Type -->
        <div>
          <div class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#97A0BC]">
            <Code2 class="h-3.5 w-3.5" />
            <span>Embed style</span>
          </div>
          <div class="max-w-xs">
            <Dropdown
              choices={['Inline Embed', 'Popup', 'Fullpage']}
              bind:value={embedChoice}
            />
          </div>
        </div>

        <!-- Embed Code -->
        <div class="overflow-hidden rounded-xl border border-[#E3ECFA] shadow-[0_4px_18px_-6px_rgba(27,33,64,0.10)]">
          <div class="flex items-center justify-between border-b border-white/10 bg-[#1B2140] px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-[#FF6B4A]/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-[#FFC94D]/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-[#22B573]/70"></span>
              <span class="ml-2 text-xs font-medium text-white/50">{embedChoice}</span>
            </div>
            <button
              use:tooltip={{ text: 'Copy code', position: 'bottom' }}
              onclick={copyCode}
              class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
              aria-label="Copy embed code"
            >
              {#if justCopied}
                <Check class="h-4 w-4 text-[#22B573]" />
                <span class="text-[#22B573]">Copied</span>
              {:else}
                <Clipboard class="h-4 w-4" />
                <span>Copy</span>
              {/if}
            </button>
          </div>
          <pre class="overflow-auto bg-[#1B2140] p-5 text-[13px] leading-6 text-[#8FE3C0]"><code>{embedCode}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>
