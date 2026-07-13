<script>
  import LinkIcon from '@lucide/svelte/icons/link';
  import { tooltip } from '$lib/utils/tooltip.js';
  import { toast } from 'svelte-sonner';

  let { link = '' } = $props();

  async function copyToClipboard() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  }
</script>

<div class="flex items-center space-x-2">
  <button
    use:tooltip={{ text: 'Copy form link', position: 'bottom' }}
    onclick={copyToClipboard}
    class="inline-flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
    disabled={!link}
  >
    <LinkIcon class="w-5 h-5" />
  </button>
</div>
