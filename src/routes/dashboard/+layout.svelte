<script>
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Dialog from '$lib/components/ui/dialog';

  let { children } = $props();
</script>

<Tooltip.Provider>
  <Dialog.Root>
    {@render children()}
  </Dialog.Root>
</Tooltip.Provider>
