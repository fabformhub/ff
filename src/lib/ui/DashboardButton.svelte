<script>
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import { navigate } from '$lib/router.js';
  
 function goDashboard() {
    navigate('/dashboard'); 
  }

</script>

<div class="group relative inline-block m-1">
  <button class="cursor-pointer" on:click={goDashboard}>
    <ArrowLeft
      class="w-8 h-8 stroke-current fill-none 
      hover:scale-125 duration-200 hover:stroke-blue-500"
      stroke-width="2"
    />
  </button>
</div>
