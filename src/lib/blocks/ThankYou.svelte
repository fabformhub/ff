<script>
  import { APP_URL } from '$lib/utils/global.js';
  let { canAnswer } = $props();
</script>

<!-- Full‑screen centered container -->
<div class="w-full h-full flex items-center justify-center">
   <a  href={canAnswer ? "https://fabform.io" : "#"} 
    target="_blank" 
    class="text-sm px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800"
  >
    Create your own FabForm
  </a>
</div>
