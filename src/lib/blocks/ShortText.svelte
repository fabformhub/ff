<script>
  import { ControlShell } from "$lib/blocks"; 
  let { value = $bindable(), canAnswer = false, ...restProps } = $props();
</script>

<ControlShell {canAnswer}>
  <input
    type="text"
    bind:value={value}
    {...restProps}
    readonly={!canAnswer}
    class={`block w-full bg-transparent border-0 border-b-2 text-xl py-2 px-0 outline-none
      transition-all duration-300
      placeholder:text-gray-400 placeholder:opacity-60
      ${canAnswer
        ? "text-gray-900 border-gray-400 focus:border-indigo-500 cursor-text"
        : "text-gray-400 border-gray-200 cursor-not-allowed"}
    `}
  />
</ControlShell>

