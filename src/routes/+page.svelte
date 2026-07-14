<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  // ----- Live form preview (hero signature element) -----
  const fields = [
    { label: 'FULL NAME', value: 'Alex Rivera', typed: true },
    { label: 'WORK EMAIL', value: 'alex@studio.co', typed: false },
    { label: 'TEAM SIZE', value: '11 – 50 people', typed: false },
    { label: 'MONTHLY SUBMISSIONS', value: '≈ 2,400', typed: false },
  ];

  let activeField = $state(0);
  let previewInterval;

  onMount(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    previewInterval = setInterval(() => {
      activeField = (activeField + 1) % fields.length;
    }, 2400);
  });

  onDestroy(() => clearInterval(previewInterval));

  // Update these two paths if your routes live somewhere else.
  const onLogin = () => goto('/login');
  const onSignup = () => goto('/signup');
</script>

<svelte:head>
  <title>Fabform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="font-body text-ink min-h-screen antialiased bg-white">
  <!-- NAV -->
  <header class="border-b border-line">
    <div class="max-w-6xl mx-auto px-6 md:px-8 h-[72px] flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5">
        <div class="h-8 w-8 rounded-lg bg-[#FF6B4A] text-white flex items-center justify-center font-bold tracking-tighter text-[15px] shadow-[0_3px_10px_-3px_rgba(255,107,74,0.55)] font-display">
          F
        </div>
        <span class="font-display font-semibold text-[15px] tracking-tight text-ink">Fabform</span>
      </a>
      <div class="flex items-center gap-3">
        <button onclick={onLogin} class="text-[14px] font-medium text-ink/80 hover:text-ink transition-colors px-3.5 py-2">
          Log in
        </button>
        <button onclick={onSignup} class="btn-primary text-[13.5px] font-semibold text-white px-5 py-2.5 rounded-full">
          Sign up free
        </button>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute -top-[30%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/15 to-[#FFC94D]/15 blur-[120px]"></div>
      <div class="absolute -bottom-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/12 to-[#22B573]/8 blur-[120px]"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-2 gap-16 items-center w-full">
      <div>
        <div class="inline-flex items-center gap-2 text-[12.5px] font-medium text-accent bg-accentDim rounded-full px-3 py-1.5 mb-7">
          <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Now shipping v3.2 — logic branching
        </div>
        <h1
          class="font-display font-semibold text-[42px] leading-[1.1] sm:text-[50px] sm:leading-[1.08] md:text-[56px] md:leading-[1.06] tracking-[-0.01em] text-ink"
        >
          The form builder<br />for serious teams.
        </h1>
        <p class="mt-6 text-[16.5px] leading-[1.65] text-muted max-w-md">
          Build forms that look like your brand, branch like your logic, and land
          every submission exactly where your team already works.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-3">
          <button onclick={onSignup} class="btn-primary text-[15px] font-semibold text-white px-7 py-3.5 rounded-full">
            Create free account
          </button>
          <button
            onclick={onLogin}
            class="text-[15px] font-medium text-ink border border-line hover:border-ink/20 hover:bg-soft transition-colors px-6 py-3.5 rounded-full"
          >
            Log in
          </button>
        </div>
        <p class="mt-6 text-[13px] text-muted">No card required · Free up to 100 submissions/mo</p>
      </div>

      <!-- Signature: live form preview -->
      <div class="flex justify-center md:justify-end">
        <div class="relative w-full max-w-[380px]">
          <div class="absolute -inset-4 rounded-[32px] glow"></div>
          <div
            class="relative w-full bg-white border border-line rounded-2xl p-6"
            style="box-shadow: 0 1px 2px rgba(27,33,64,0.04), 0 16px 40px rgba(27,33,64,0.08);"
          >
            <span class="absolute -top-[5px] left-8 w-[9px] h-[9px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>
            <div class="flex items-center justify-between mb-6">
              <span class="font-mono text-[10.5px] tracking-wide text-muted">contact_form.v3</span>
              <span class="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-accent">
                <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>LIVE
              </span>
            </div>
            <div class="space-y-3">
              {#each fields as field, i}
                <div
                  class="field border rounded-lg px-4 py-3 transition-colors duration-500"
                  class:active={activeField === i}
                >
                  <div class="flex items-center justify-between">
                    <label class="block text-[10.5px] font-medium tracking-wide text-muted mb-1">{field.label}</label>
                    <span
                      class="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                      class:dot-active={activeField === i}
                      class:bg-line={activeField !== i}
                    ></span>
                  </div>
                  <div class="text-[14.5px]" class:text-ink={i === 0} class:text-ink-40={i !== 0}>
                    {field.value}{#if field.typed && activeField === i}<span class="cursor-blink text-accent">|</span>{/if}
                  </div>
                </div>
              {/each}
            </div>
            <button onclick={onSignup} class="w-full mt-6 bg-ink text-white text-[14px] font-semibold rounded-lg py-3 hover:bg-black transition-colors">
              Create form →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="border-t border-line">
    <div class="max-w-6xl mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="h-5 w-5 rounded-[5px] bg-[#FF6B4A] text-white flex items-center justify-center font-bold text-[10px] font-display">
          F
        </div>
        <span class="font-mono text-[12.5px] text-muted">Fabform.io</span>
      </div>
      <p class="text-[12.5px] text-muted">© 2026 Fabform. All rights reserved.</p>
    </div>
  </footer>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    --color-ink: #1b2140;
    --color-muted: #5c6685;
    --color-line: #e3ecfa;
    --color-soft: #f5faff;
    --color-accent: #6c63ff;
    --color-accent-dim: #eeecff;
  }

  .font-display {
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .font-body {
    font-family: 'Inter', sans-serif;
  }
  .text-ink {
    color: #1b2140;
  }
  .text-muted {
    color: #5c6685;
  }
  .border-line {
    border-color: #e3ecfa;
  }
  .bg-soft {
    background-color: #f5faff;
  }
  .text-accent {
    color: #6c63ff;
  }
  .bg-accent {
    background-color: #6c63ff;
  }
  .bg-accentDim {
    background-color: #eeecff;
  }
  .bg-ink {
    background-color: #1b2140;
  }

  .field {
    border-color: #e3ecfa;
  }
  .field.active {
    border-color: #6c63ff;
    background-color: #f7f7ff;
  }
  .dot-active {
    background-color: #6c63ff;
  }
  .text-ink-40 {
    color: rgba(27, 33, 64, 0.4);
  }
  .cursor-blink {
    animation: blink 1s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  .glow {
    background: radial-gradient(closest-side, rgba(255, 107, 74, 0.1), transparent 72%);
  }

  /* Primary button: coral gradient + inner highlight, matches login CTA */
  .btn-primary {
    background: linear-gradient(180deg, #ff7d5f 0%, #ff5a36 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      0 1px 2px rgba(27, 33, 64, 0.06),
      0 6px 16px rgba(255, 107, 74, 0.28);
    transition: box-shadow 0.2s ease, transform 0.2s ease, filter 0.2s ease;
  }
  .btn-primary:hover {
    filter: brightness(1.05);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 1px 2px rgba(27, 33, 64, 0.06),
      0 10px 22px rgba(255, 107, 74, 0.34);
    transform: translateY(-1px);
  }
  .btn-primary:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    .cursor-blink {
      animation: none;
    }
    .btn-primary {
      transition: none;
    }
  }

  :global(*) {
    -webkit-font-smoothing: antialiased;
  }
  :global(::selection) {
    background: #ffe4a8;
    color: #1b2140;
  }
  :global(:focus-visible) {
    outline: 2px solid #6c63ff;
    outline-offset: 2px;
  }
</style>
