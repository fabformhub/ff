<script>
  import { getComponent } from '$lib/utils/getComponent.js';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

  let {
    block,
    form,
    canAnswer = false,
    onFormButtonClick,
    errorMessage = '',
    textAlign = 'center'
  } = $props();
  const SvelteComponent = $derived(getComponent(block?.meta?.component));
  const formMeta = $derived(form?.meta);
  const isLeft = $derived(textAlign === 'left');
</script>

<!-- OUTER: FULL SCREEN + PROPER CENTERING SYSTEM -->
<div class="relative w-full px-6 py-10 flex">


  <!-- HORIZONTAL ALIGNMENT LAYER -->
  <div class={`w-full flex ${isLeft ? 'justify-start' : 'justify-center'}`}>
    <!-- CONTENT COLUMN -->
    <div class="w-full max-w-md flex flex-col gap-5">

      {#if block.meta.question || block.meta.title}
        <p
          class="block w-full text-2xl font-medium leading-tight"
          class:text-left={isLeft}
          class:text-center={!isLeft}
          style={`color: ${formMeta?.questionColor};`}
        >
          {block.meta.question || block.meta.title}
        </p>
      {/if}

      {#if block?.meta?.description}
        <p
          class="block w-full text-base opacity-80 leading-relaxed"
          class:text-left={isLeft}
          class:text-center={!isLeft}
          style={`color: ${formMeta?.questionColor};`}
        >
          {block.meta.description}
        </p>
      {/if}

      {#if SvelteComponent}
        <div class="w-full">
          <SvelteComponent
            form={form}
            bind:value={block.value}
            canAnswer={canAnswer}
            {...block?.meta?.props}
          />
        </div>
      {/if}

      {#if block?.meta?.blockTypeId !== 99}
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
            {block?.meta?.buttonText || 'button text missing for this component'}
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

