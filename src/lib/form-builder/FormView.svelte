<script>
  import { BlockView } from '.';

  let {
    form,
    block,
    canAnswer = false,
    nextBlock = () => {},
    errorMessage = ''
  } = $props();

  const layout = $derived(block?.meta?.coverImageProps?.layout);
  const coverImage  = $derived(block?.meta?.coverImageProps?.coverImage);
  const formBgImage = $derived(form?.meta?.bgImage);
  const formBgColor = $derived(form?.meta?.bgColor);


  const fontSizeClass = $derived(
    {
      Small: 'text-sm md:text-base leading-relaxed',
      Medium: 'text-base md:text-xl leading-relaxed',
      Large: 'text-lg md:text-2xl leading-relaxed',
      'Extra Large': 'text-xl md:text-3xl leading-relaxed'
    }[form?.meta?.fontSize] ?? 'text-base md:text-xl leading-relaxed'
  );

  const splitImageClass =
    'w-full md:w-1/2 min-h-[250px] md:min-h-screen bg-cover bg-center';
</script>

{#snippet blockContent()}
  <BlockView
    form={form}
    bind:block={block}
    canAnswer= {canAnswer}
    onFormButtonClick={nextBlock}
    {errorMessage}
    textAlign={block?.meta?.textAlign ?? 'center'}
  />
{/snippet}

<div
  class={`w-full min-h-screen ${fontSizeClass}`}
  style={`background-color:${formBgColor};
         background-image:url('${formBgImage}');
         background-repeat:no-repeat;
         background-size:cover;
         background-position:center;`}
>

{#if layout === 'wallpaper' || layout ===""}

  <div
    class={`w-full min-h-screen bg-cover bg-center bg-no-repeat ${fontSizeClass}`}
    style={coverImage
      ? `background-image: url("${coverImage}")`
      : undefined}
  >
    <div class="flex items-center justify-center w-full min-h-screen">
      {@render blockContent()}
    </div>

    </div>
{:else}

  <!-- All other layouts use the form background -->
  <div
    class={`w-full min-h-screen bg-cover bg-center bg-no-repeat ${fontSizeClass}`}
    style={formBgImage
      ? `background-image: url("${formBgImage}")`
      : undefined}
  >

    {#if layout === 'stack'}

      <div class="w-full flex flex-col items-center justify-center py-10 gap-8">

        {#if coverImage}
          <img
            src={coverImage}
            alt="Cover"
            class="max-h-[22vh] w-auto object-contain"
          />
        {/if}

        <div class="w-full flex justify-center">
          {@render blockContent()}
        </div>

      </div>

    {:else if layout === 'split-left'}

      <div class="flex flex-col md:flex-row w-full min-h-screen">

        {#if coverImage}
          <div
            class={splitImageClass}
            style={`background-image: url("${coverImage}")`}
          />
        {/if}

        <div class="w-full md:w-1/2 flex items-center justify-center p-4">
          {@render blockContent()}
        </div>

      </div>

    {:else if layout === 'split-right'}

      <div class="flex flex-col md:flex-row w-full min-h-screen">

        <div class="w-full md:w-1/2 flex items-center justify-center p-4">
          {@render blockContent()}
        </div>

        {#if coverImage}
          <div
            class={splitImageClass}
            style={`background-image: url("${coverImage}")`}
          />
        {/if}

      </div>

    {/if}
  </div>

{/if}
</div>
