<script>
  import { BlockWrapper } from "$lib/blocks";
  let { value = $bindable(), canAnswer = false, type = "text", ...restProps } = $props();
</script>

<BlockWrapper {canAnswer}>
  <div class="relative group">
    {#if canAnswer}
      <span class="pointer-events-none absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-transparent transition-all duration-150
        group-hover:border-[#101112] group-hover:-top-3 group-hover:-left-3
        group-focus-within:border-[#FF2E9A] group-focus-within:-top-3 group-focus-within:-left-3"></span>
      <span class="pointer-events-none absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-transparent transition-all duration-150
        group-hover:border-[#101112] group-hover:-top-3 group-hover:-right-3
        group-focus-within:border-[#FF2E9A] group-focus-within:-top-3 group-focus-within:-right-3"></span>
      <span class="pointer-events-none absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-transparent transition-all duration-150
        group-hover:border-[#101112] group-hover:-bottom-3 group-hover:-left-3
        group-focus-within:border-[#FF2E9A] group-focus-within:-bottom-3 group-focus-within:-left-3"></span>
      <span class="pointer-events-none absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-transparent transition-all duration-150
        group-hover:border-[#101112] group-hover:-bottom-3 group-hover:-right-3
        group-focus-within:border-[#FF2E9A] group-focus-within:-bottom-3 group-focus-within:-right-3"></span>
    {/if}

    <input
      {...restProps}
      {type}
      bind:value
      readonly={!canAnswer}
      tabindex={canAnswer ? undefined : -1}
      aria-readonly={!canAnswer}
      class={`block w-full bg-white border py-3 px-4
        font-mono text-[1.35rem] tracking-tight tabular-nums
        outline-none transition-colors duration-150 motion-reduce:transition-none
        placeholder:font-sans placeholder:italic placeholder:text-[0.95em] placeholder:tracking-normal placeholder:text-[#101112]/30
        selection:bg-[#FF2E9A]/20
        ${canAnswer
          ? "border-[#101112]/15 focus:border-[#101112] text-[#101112] caret-[#FF2E9A] cursor-text"
          : "border-[#101112]/10 text-[#101112]/40 cursor-not-allowed"}
      `}
    />
  </div>
</BlockWrapper>
