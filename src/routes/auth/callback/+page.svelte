<script>
  import { onMount } from 'svelte';
  import { authService } from '$lib/services/authService.svelte.js';
  import { CheckCircle, Shield, Loader2 } from '@lucide/svelte';
  let stage = $state(0);
  import { goto } from '$app/navigation';

  function stepStatus(index) {
    if (stage > index) return 'done';
    if (stage === index) return 'active';
    return 'idle';
  }

  onMount(async () => {
    stage = 1;
    await authService.init();
    // small intentional UX delay (feels "secure processing")
    setTimeout(() => {
      stage = 2;
    }, 2700);
    setTimeout(() => {
      stage = 3;
    }, 2700);
    setTimeout(() => {
      goto('/dashboard');
    }, 3700);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="relative min-h-screen bg-[#F5FAFF] flex items-center justify-center p-6 font-sans overflow-hidden">
  <!-- Ambient glow + grid texture -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div class="absolute -top-48 -left-48 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,74,0.18),rgba(255,201,77,0.08)_60%,transparent_75%)] blur-[110px]"></div>
    <div class="absolute -bottom-48 -right-48 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(108,99,255,0.16),rgba(34,181,115,0.06)_60%,transparent_75%)] blur-[130px]"></div>
    <div class="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(27,33,64,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,33,64,0.025)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_0%,transparent_75%)]"></div>
  </div>

  <div class="relative z-10 w-full max-w-[26rem]">
    <div class="relative bg-white border border-[#E3ECFA] rounded-2xl shadow-[0_24px_60px_-20px_rgba(27,33,64,0.16),0_2px_8px_rgba(27,33,64,0.04)] hover:shadow-[0_28px_70px_-18px_rgba(27,33,64,0.2),0_2px_8px_rgba(27,33,64,0.05)] hover:-translate-y-0.5 transition-all duration-300 px-9 pt-11 pb-9">
      <!-- Gradient top accent -->
      <span class="absolute -top-px left-[12%] right-[12%] h-[3px] rounded-full bg-gradient-to-r from-[#FF6B4A] via-[#FFC94D] to-[#6C63FF]"></span>
      <!-- Pin accent -->
      <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>

      <!-- Logo -->
      <div class="flex justify-center mb-7">
        <div
          class="h-12 w-12 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold text-2xl tracking-tight shadow-[0_8px_22px_-6px_rgba(255,107,74,0.55)]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          F
        </div>
      </div>

      <!-- Header -->
      <div class="text-center">
        <div class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6C63FF] mb-2.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]"></span>
          Security Portal
        </div>
        <h1 class="text-[1.85rem] leading-tight font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
          Signing you in
        </h1>
        <p class="text-sm text-[#5C6685] mt-1.5">Secure authentication in progress</p>
      </div>

      <!-- Steps -->
      <div class="mt-9 flex flex-col gap-2.5">
        <!-- Step 1 -->
        <div class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl border transition-all duration-200 {stepStatus(1) === 'active' ? 'opacity-100 bg-[#FBFDFF] border-[#E3ECFA] shadow-[0_1px_2px_rgba(27,33,64,0.03)]' : stepStatus(1) === 'done' ? 'opacity-85 border-transparent' : 'opacity-45 border-transparent'}">
          <div class="h-[2.1rem] w-[2.1rem] shrink-0 rounded-[0.65rem] border flex items-center justify-center transition-colors duration-200 {stage > 1 ? 'bg-[#F2FBF6] border-[#BEF1D7]' : 'bg-[#FBFDFF] border-[#E3ECFA]'}">
            {#if stage > 1}
              <CheckCircle class="w-4 h-4 text-[#22B573]" />
            {:else}
              <Loader2 class="w-4 h-4 animate-spin text-[#6C63FF]" />
            {/if}
          </div>
          <div class="text-sm {stepStatus(1) === 'active' ? 'font-semibold text-[#1B2140]' : stepStatus(1) === 'done' ? 'font-medium text-[#97A0BC] line-through' : 'font-medium text-[#5C6685]'}">
            Verifying identity
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl border transition-all duration-200 {stepStatus(2) === 'active' ? 'opacity-100 bg-[#FBFDFF] border-[#E3ECFA] shadow-[0_1px_2px_rgba(27,33,64,0.03)]' : stepStatus(2) === 'done' ? 'opacity-85 border-transparent' : 'opacity-45 border-transparent'}">
          <div class="h-[2.1rem] w-[2.1rem] shrink-0 rounded-[0.65rem] border flex items-center justify-center transition-colors duration-200 {stage > 2 ? 'bg-[#F2FBF6] border-[#BEF1D7]' : 'bg-[#FBFDFF] border-[#E3ECFA]'}">
            {#if stage > 2}
              <CheckCircle class="w-4 h-4 text-[#22B573]" />
            {:else if stage === 2}
              <Loader2 class="w-4 h-4 animate-spin text-[#6C63FF]" />
            {:else}
              <Shield class="w-4 h-4 text-[#97A0BC] opacity-50" />
            {/if}
          </div>
          <div class="text-sm {stepStatus(2) === 'active' ? 'font-semibold text-[#1B2140]' : stepStatus(2) === 'done' ? 'font-medium text-[#97A0BC] line-through' : 'font-medium text-[#5C6685]'}">
            Establishing secure session
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl border transition-all duration-200 {stepStatus(3) === 'active' ? 'opacity-100 bg-[#FBFDFF] border-[#E3ECFA] shadow-[0_1px_2px_rgba(27,33,64,0.03)]' : stepStatus(3) === 'done' ? 'opacity-85 border-transparent' : 'opacity-45 border-transparent'}">
          <div class="h-[2.1rem] w-[2.1rem] shrink-0 rounded-[0.65rem] border flex items-center justify-center transition-colors duration-200 {stage > 3 ? 'bg-[#F2FBF6] border-[#BEF1D7]' : 'bg-[#FBFDFF] border-[#E3ECFA]'}">
            {#if stage > 3}
              <CheckCircle class="w-4 h-4 text-[#22B573]" />
            {:else if stage >= 2}
              <Loader2 class="w-4 h-4 animate-spin text-[#6C63FF]" />
            {:else}
              <Loader2 class="w-4 h-4 text-[#97A0BC] opacity-50" />
            {/if}
          </div>
          <div class="text-sm {stepStatus(3) === 'active' ? 'font-semibold text-[#1B2140]' : stepStatus(3) === 'done' ? 'font-medium text-[#97A0BC] line-through' : 'font-medium text-[#5C6685]'}">
            Redirecting to dashboard
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-7 h-1 rounded-full bg-[#E3ECFA] overflow-hidden" aria-hidden="true">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#6C63FF] transition-all duration-500 ease-out"
          style="width: {Math.min(stage, 3) * 33.333}%"
        ></div>
      </div>

      <!-- Status chip -->
      <div class="mt-7 flex justify-center">
        {#if stage === 3}
          <div class="inline-flex items-center gap-2 text-[13px] font-semibold px-3.5 py-1.5 rounded-full bg-[#F2FBF6] border border-[#BEF1D7] text-[#22B573]">
            <span class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22B573] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22B573]"></span>
            </span>
            Ready
          </div>
        {:else}
          <div class="inline-flex items-center gap-2 text-[13px] font-semibold px-3.5 py-1.5 rounded-full bg-[#FFF8E8] border border-[#FFE4A8] text-[#5C6685]">
            <span class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC94D] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFC94D]"></span>
            </span>
            Secure connection active
          </div>
        {/if}
      </div>
    </div>

    <p class="text-center text-xs text-[#97A0BC] mt-6">Fabform authentication system</p>
  </div>
</div>
