<script>
  import { ControlShell } from "$lib/blocks"; 
  let { value = $bindable(), canAnswer = false, ...restProps } = $props();
  let size = $derived(restProps?.size ?? 'Medium');

const sizeClasses = {
  'Small':        'w-96   h-36',      // 384 × 144
  'Medium':       'w-[28rem] h-48',   // 448 × 192
  'Large':        'w-[32rem] h-64',   // 512 × 256
  'Extra Large':  'w-[36rem] h-80'    // 576 × 320
};


</script>

<ControlShell {canAnswer}>
  <textarea
    bind:value={value}
    {...restProps}
    readonly={!canAnswer}
    class={`w-full min-h-[140px] bg-gray-50/60 rounded-xl border border-gray-300
    ${sizeClasses[size]}
    px-4 py-3 text-[15px] leading-relaxed tracking-wide
    placeholder:text-gray-400 placeholder:opacity-60
    resize-none outline-none transition-all duration-300

      ${canAnswer
        ? "text-gray-900 focus:border-indigo-500 focus:bg-white focus:shadow-md"
        : "text-gray-400 border-gray-200 cursor-not-allowed"}
    `}
  />
</ControlShell>

