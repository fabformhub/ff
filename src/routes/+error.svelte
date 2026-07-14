<!-- src/routes/+error.svelte -->
<script>
  import Footprints from '@lucide/svelte/icons/footprints';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import { fly, fade } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
</script>

<svelte:head>
  <title>Page Not Found | Fabform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="relative min-h-screen flex items-center justify-center bg-[#F5FAFF] p-6 font-sans overflow-hidden">
  <!-- Ambient background blobs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div class="absolute -top-[35%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/20 to-[#FFC94D]/20 blur-[120px]"></div>
    <div class="absolute -bottom-[35%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/15 to-[#22B573]/10 blur-[120px]"></div>
  </div>

  <!-- Floating particles -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <span class="absolute top-[18%] left-[20%] w-3 h-3 rounded-full bg-[#FF6B4A]/50 animate-bounce [animation-duration:3s]"></span>
    <span class="absolute top-[70%] left-[15%] w-2 h-2 rounded-full bg-[#6C63FF]/50 animate-pulse [animation-duration:2.5s]"></span>
    <span class="absolute top-[25%] right-[18%] w-2.5 h-2.5 rounded-full bg-[#FFC94D]/60 animate-bounce [animation-duration:3.5s] [animation-delay:.4s]"></span>
    <span class="absolute top-[65%] right-[22%] w-2 h-2 rounded-full bg-[#22B573]/50 animate-pulse [animation-duration:3s] [animation-delay:.2s]"></span>
    <span class="absolute top-[45%] left-[8%] w-1.5 h-1.5 rounded-full bg-[#6C63FF]/40 animate-ping [animation-duration:2.8s]"></span>
    <span class="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#FF6B4A]/40 animate-ping [animation-duration:3.2s] [animation-delay:.6s]"></span>
  </div>

  <div class="relative text-center">
    <div
      in:fly={{ y: -14, duration: 500, easing: backOut }}
      class="h-11 w-11 mx-auto rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold tracking-tighter text-xl shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mb-8 hover:rotate-12 transition-transform duration-300"
      style="font-family: 'Bricolage Grotesque', sans-serif;"
    >
      F
    </div>

    <!-- 404, with footprints walking off instead of a plain "0" -->
    <div
      in:fly={{ y: 24, duration: 550, delay: 80, easing: backOut }}
      class="flex items-center justify-center gap-1 sm:gap-2"
    >
      <span
        class="text-[110px] sm:text-[140px] font-bold leading-none tracking-tight text-[#1B2140] -rotate-2"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >4</span>
      <span
        class="text-[110px] sm:text-[140px] font-bold leading-none tracking-tight text-[#1B2140]"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >0</span>
      <span
        class="text-[110px] sm:text-[140px] font-bold leading-none tracking-tight text-[#1B2140] rotate-2"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >4</span>

      <span class="relative self-end mb-3 sm:mb-5 ml-1 sm:ml-2">
        <Footprints
          class="w-7 h-7 sm:w-9 sm:h-9 text-[#6C63FF] rotate-[24deg] animate-bounce [animation-duration:2.4s]"
          strokeWidth={1.75}
        />
      </span>
    </div>

    <div in:fade={{ duration: 400, delay: 220 }}>
      <h2 class="text-xl font-semibold text-[#1B2140] mt-3" style="font-family: 'Bricolage Grotesque', sans-serif;">
        This page has done a runner
      </h2>
      <p class="mt-3 text-sm text-[#5C6685] max-w-sm mx-auto">
        We've had a good look, checked behind the couch, even rang round the pub — no sign of it.
        Let's get you back somewhere it actually exists.
      </p>
    </div>

    <div in:fly={{ y: 14, duration: 450, delay: 320, easing: backOut }}>
      <a
        href="/"
        class="group mt-9 inline-flex items-center gap-2 rounded-xl bg-[#FF6B4A] text-white px-7 py-3.5 text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 active:scale-95 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
      >
        <ArrowLeft class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Right, back we go
      </a>
    </div>
  </div>
</div>
