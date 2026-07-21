<script>
  import { BlockWrapper } from "$lib/blocks";
  let {
    value = $bindable(),
    canAnswer = false,
    size = "Medium",
    ...restProps
  } = $props();
  const sizeClasses = {
    Small:         "w-96 h-36",
    Medium:        "w-[28rem] h-48",
    Large:         "w-[32rem] h-64",
    "Extra Large": "w-[36rem] h-80"
  };
</script>

<BlockWrapper {canAnswer}>
  <div class="relative group inline-block max-w-full">
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

    <textarea
      {...restProps}
      bind:value
      readonly={!canAnswer}
      tabindex={canAnswer ? undefined : -1}
      aria-readonly={!canAnswer}
      class={`${sizeClasses[size] ?? sizeClasses.Medium}
        max-w-full border px-4 py-3.5
        font-mono text-[0.95rem] leading-relaxed tracking-tight
        outline-none transition-colors duration-150 motion-reduce:transition-none
        placeholder:font-sans placeholder:italic placeholder:text-[0.95em] placeholder:tracking-normal placeholder:text-[#101112]/30
        selection:bg-[#FF2E9A]/20 resize-none
        ${canAnswer
          ? "bg-white border-[#101112]/15 text-[#101112] caret-[#FF2E9A] focus:border-[#101112] cursor-text"
          : "bg-[#101112]/[0.03] border-[#101112]/10 text-[#101112]/40 cursor-not-allowed"}
      `}
    ></textarea>
  </div>
</BlockWrapper>
