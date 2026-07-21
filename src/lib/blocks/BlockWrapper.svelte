<script>
  import { Lock } from "@lucide/svelte";
  let { canAnswer = false, children } = $props();
  const isPreview = $derived(!canAnswer);
</script>

<div class="relative w-full">
  <div
    class="peer w-full transition-opacity duration-300 motion-reduce:transition-none"
    class:opacity-[0.55]={isPreview}
  >
    {@render children()}
  </div>

  {#if canAnswer}
    <!-- Nib line: draws outward from center, not edge-to-edge -->
    <span
      class="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2
             bg-gradient-to-r from-[#B8873F] via-[#E4C285] to-[#B8873F]
             transition-all duration-500 ease-out motion-reduce:transition-none
             peer-focus-within:w-full"
    ></span>

    <!-- Calibration ticks -->
    {#each ["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as pos (pos)}
      <span
        class={`pointer-events-none absolute ${pos} h-2 w-2
                border-transparent transition-all duration-300 ease-out motion-reduce:transition-none
                peer-focus-within:border-[#B8873F]/70`}
      ></span>
    {/each}
  {/if}

  {#if isPreview}
    <div
      class="absolute inset-0 z-10 cursor-not-allowed rounded-md
             bg-[#F6F3EA]/50 backdrop-blur-[1.5px]
             ring-1 ring-inset ring-[#E4E0D6]"
      style="background-image: repeating-linear-gradient(135deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 8px);"
    ></div>

    <div
      class="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center
             rounded-full bg-[#EFE9DA] text-[#8A7A57]
             ring-1 ring-inset ring-[#D8CDAE]
             shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.08)]"
      title="Locked"
    >
      <Lock size={11} strokeWidth={2.5} />
    </div>
  {/if}
</div>
