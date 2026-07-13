<script>
  let { form = $bindable() } = $props();

  import { loadGoogleFont } from "$lib/fontLoader";
  import Palette from "@lucide/svelte/icons/palette";
  import X  from "@lucide/svelte/icons/x";

  import { Dropdown } from "$lib/ui/";
  import { ImageUploader } from "$lib/ui";

  const googleFonts = [
    // UI / modern system
    "Inter",
    "Roboto",
    "DM Sans",
    "Manrope",
    "Work Sans",
    "Lexend",
    // geometric sans
    "Poppins",
    "Montserrat",
    "Rubik",
    "Outfit",
    // humanist / friendly
    "Open Sans",
    "Lato",
    "Nunito",
    "Quicksand",
    // serif (strong contrast)
    "Playfair Display",
    "Merriweather",
    "Source Serif 4",
    "Crimson Text",
    // display / personality
    "Oswald",
    "Space Grotesk",
    "Raleway",
    "Exo 2",
    // monospace
    "JetBrains Mono",
    "IBM Plex Mono",
  ];

  $effect(() => {
    const font = form?.meta?.fontFamily;
    if (!font) return;
    loadGoogleFont(font);
  });

  // --- self-contained drawer state (no Sheet.* primitives) ---
  let open = $state(false);
  let panelEl;

  function closeDrawer() {
    open = false;
  }

  function handleKeydown(e) {
    if (open && e.key === "Escape") closeDrawer();
  }

  $effect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => panelEl?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- CENTERED TRIGGER -->
<div class="flex justify-center w-full py-6">
  <button
    type="button"
    class="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-3 py-1.5 rounded-md shadow-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
    onclick={() => (open = true)}
  >
    <Palette class="h-4 w-4 text-gray-600" />
    <span>Design</span>
  </button>
</div>

<!-- OVERLAY -->
<div
  class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out"
  class:opacity-100={open}
  class:opacity-0={!open}
  class:pointer-events-none={!open}
  aria-hidden="true"
  onclick={closeDrawer}
></div>

<!-- PANEL -->
<div
  bind:this={panelEl}
  role="dialog"
  aria-modal="true"
  aria-hidden={!open}
  tabindex="-1"
  class="fixed top-0 right-0 z-50 h-full w-[420px] max-w-full bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-in-out outline-none"
  class:translate-x-0={open}
  class:translate-x-full={!open}
>
  <!-- HEADER -->
  <div class="shrink-0 border-b border-gray-100 px-5 py-4 flex items-start justify-between gap-4">
    <div>
      <h2 class="text-base font-semibold text-gray-900">Design</h2>
      <p class="text-sm text-gray-500">Customize the appearance of your form</p>
    </div>
    <button
      type="button"
      aria-label="Close"
      class="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      onclick={closeDrawer}
    >
      <X class="h-4 w-4" />
    </button>
  </div>

  <!-- SCROLL AREA -->
  <div class="flex-1 overflow-y-auto px-5 py-6 space-y-8">
    <!-- COLORS -->
    <section class="space-y-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Colors
      </h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Background</label>
          <input
            type="color"
            bind:value={form.meta.bgColor}
            class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Question</label>
          <input
            type="color"
            bind:value={form.meta.questionColor}
            class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Answer</label>
          <input
            type="color"
            bind:value={form.meta.answerColor}
            class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Button</label>
          <input
            type="color"
            bind:value={form.meta.buttonColor}
            class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Button Text</label>
          <input
            type="color"
            bind:value={form.meta.buttonTextColor}
            class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
          />
        </div>
      </div>
    </section>

    <!-- TYPOGRAPHY -->
    <section class="space-y-4 border-t border-gray-100 pt-6">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Typography
      </h3>
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Font Size</label>
          <Dropdown
            choices={["Small", "Medium", "Large", "Extra Large"]}
            bind:value={form.meta.fontSize}
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700">Font Family</label>
          <Dropdown
            choices={googleFonts}
            bind:value={form.meta.fontFamily}
            props={{ placeholder: "Select font…" }}
          />
        </div>
      </div>
    </section>

    <label class="block text-gray-700 font-medium"> Form Background Image </label>
    <ImageUploader id={form.id} imageType="form" bind:image={form.meta.bgImage} />

    <div class="h-6"></div>
  </div>
</div>
