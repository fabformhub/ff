<script>
  import { blockRegistry } from '$lib/utils/blockRegistry.js';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

  let {
    block = {},
    form = {},
    canAnswer = false,
    onFormButtonClick,
    errorMessage = '',
    textAlign = 'center'
  } = $props();

  const blockType = $derived(block?.meta?.type);

  // Look up Svelte component directly in blockRegistry
  const SvelteComponent = $derived(
    blockRegistry.find((item) => item.type === blockType)?.component
  );

  const formMeta = $derived(form?.meta);
  const isLeft = $derived(textAlign === 'left');

  // String check against registry type
  const isThankYouBlock = $derived(blockType === 'thank-you');

  // Handle both flat registry schema and legacy meta schema seamlessly
  const questionOrTitle = $derived(
    block?.question || block?.title || block?.meta?.question || block?.meta?.title
  );
  const description = $derived(block?.description || block?.meta?.description);
  const buttonText = $derived(block?.buttonText || block?.meta?.buttonText);
  const blockProps = $derived(block?.props || block?.meta?.props || {});
</script>

<!-- OUTER: FULL SCREEN + PROPER CENTERING SYSTEM -->
<div class="relative flex w-full px-6 py-10">

  <!-- HORIZONTAL ALIGNMENT LAYER -->
  <div class={`flex w-full ${isLeft ? 'justify-start' : 'justify-center'}`}>
    <!-- CONTENT COLUMN -->
    <div class="flex w-full max-w-md flex-col gap-5">

      {#if questionOrTitle}
        <p
          class="block w-full text-2xl font-medium leading-tight"
          class:text-left={isLeft}
          class:text-center={!isLeft}
          style={`color: ${formMeta?.questionColor};`}
        >
          {questionOrTitle}
        </p>
      {/if}

      {#if description}
        <p
          class="block w-full text-base opacity-80 leading-relaxed"
          class:text-left={isLeft}
          class:text-center={!isLeft}
          style={`color: ${formMeta?.questionColor};`}
        >
          {description}
        </p>
      {/if}

      {#if SvelteComponent}
        <div class="w-full">
          <SvelteComponent
            {form}
            bind:value={block.value}
            {canAnswer}
            {...blockProps}
          />
        </div>
      {/if}

      <!-- Render button for all blocks except thank-you -->
      {#if !isThankYouBlock}
        <div class={`flex ${isLeft ? 'justify-start' : 'justify-center'}`}>
          <button
            type="button"
            onclick={onFormButtonClick}
            class="rounded px-4 py-2"
            style={`
              background-color: ${formMeta?.buttonColor};
              color: ${formMeta?.buttonTextColor};
            `}
          >
            {buttonText || 'Next'}
          </button>
        </div>
      {/if}

      {#if errorMessage}
        <div class="flex items-start gap-2 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          <AlertTriangle size={20} class="mt-0.5 flex-shrink-0" />
          <p class="text-sm">{errorMessage}</p>
        </div>
      {/if}

    </div>
  </div>
</div>
