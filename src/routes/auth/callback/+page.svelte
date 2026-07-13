<script>
  import { onMount } from 'svelte';
  import { authService } from '$lib/services/authService.svelte.js';
  import { CheckCircle, Sparkles, Shield, Loader2 } from '@lucide/svelte';
  let stage = $state(0);
  import { goto } from '$app/navigation';

  onMount(async () => {
    stage = 1;

    await authService.init();

    // small intentional UX delay (feels “secure processing”)
    setTimeout(() => {
      stage = 2;
    }, 1000);

    setTimeout(() => {
      stage = 3;
    }, 2000);

    setTimeout(() => {
      goto('/dashboard');
    }, 4000);
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

<div class="auth-wrapper">
  <!-- Soft brand-aligned glowing gradients -->
  <div class="glow-container" aria-hidden="true">
    <div class="glow-orb top-left"></div>
    <div class="glow-orb bottom-right"></div>
  </div>

  <div class="auth-container">
    <div class="auth-card">
      
      <!-- Labeled Logo Element -->
      <div class="logo-area">
        <div class="logo-box">
          <Sparkles class="w-5 h-5 text-white" />
        </div>
      </div>

      <!-- Header Presentation -->
      <div class="text-center">
        <div class="eyebrow">
          <span class="eyebrow-mark"></span>
          Security Portal
        </div>
        <h1 class="auth-title">Signing you in</h1>
        <p class="auth-subtitle">Secure authentication in progress</p>
      </div>

      <!-- Progress Step Blocks -->
      <div class="steps-list">
        
        <!-- Step 1 -->
        <div class="step-row" class:active={stage === 1} class:done={stage > 1}>
          <div class="indicator-box">
            {#if stage > 1}
              <CheckCircle class="w-4 h-4 text-success" />
            {:else}
              <Loader2 class="w-4 h-4 spin text-periwinkle" />
            {/if}
          </div>
          <div class="step-label">Verifying identity</div>
        </div>

        <!-- Step 2 -->
        <div class="step-row" class:active={stage === 2} class:done={stage > 2}>
          <div class="indicator-box">
            {#if stage > 2}
              <CheckCircle class="w-4 h-4 text-success" />
            {:else if stage === 2}
              <Loader2 class="w-4 h-4 spin text-periwinkle" />
            {:else}
              <Shield class="w-4 h-4 text-text-3" />
            {/if}
          </div>
          <div class="step-label">Establishing secure session</div>
        </div>

        <!-- Step 3 -->
        <div class="step-row" class:active={stage === 3} class:done={stage > 3}>
          <div class="indicator-box">
            {#if stage > 3}
              <CheckCircle class="w-4 h-4 text-success" />
            {:else if stage >= 2}
              <Loader2 class="w-4 h-4 spin text-periwinkle" />
            {:else}
              <Loader2 class="w-4 h-4 text-text-3 opacity-40" />
            {/if}
          </div>
          <div class="step-label">Redirecting to dashboard</div>
        </div>

      </div>

      <!-- Dynamic Bottom Status Chip -->
      <div class="status-footer">
        <div class="chip" class:chip-success={stage === 3}>
          {#if stage === 3}
            <span class="pulse-dot success-dot"></span>
            Ready!
          {:else}
            <span class="pulse-dot"></span>
            Secure connection active
          {/if}
        </div>
      </div>

    </div>

    <!-- Clean footer layout matching dashboard baseline -->
    <p class="system-footer">
      Fabform authentication system
    </p>
  </div>
</div>

<style>
  :global(body) {
    background: #f5faff;
  }

  .auth-wrapper {
    --bg: #f5faff;
    --surface: #ffffff;
    --border: #e3ecfa;
    --border-strong: #cddcf2;
    --text-1: #1b2140;
    --text-2: #5c6685;
    --text-3: #97a0bc;
    --coral: #ff6b4a;
    --yellow: #ffc94d;
    --periwinkle: #6c63ff;
    --success: #22b573;

    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text-1);
    font-family: 'Inter', system-ui, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  /* ---------- Ambient Glow Graphics ---------- */
  .glow-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .glow-orb {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 999px;
  }

  .top-left {
    top: -10rem;
    left: -10rem;
    background: rgba(255, 107, 74, 0.08);
    filter: blur(140px);
  }

  .bottom-right {
    bottom: -10rem;
    right: -10rem;
    background: rgba(108, 99, 255, 0.08);
    filter: blur(160px);
  }

  /* ---------- Content Architecture ---------- */
  .auth-container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 26rem;
  }

  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 4px solid var(--periwinkle);
    border-radius: 1rem;
    box-shadow: 0 12px 32px -12px rgba(27, 33, 64, 0.12);
    padding: 2.5rem 2rem;
    animation: breathe 6s ease-in-out infinite;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .auth-card:hover {
    transform: translateY(-2px) rotate(0.4deg);
    box-shadow: 0 18px 36px -14px rgba(27, 33, 64, 0.16);
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.01); }
  }

  /* ---------- Branding Area ---------- */
  .logo-area {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .logo-box {
    width: 3rem;
    height: 3rem;
    border-radius: 0.85rem;
    background: var(--text-1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(27, 33, 64, 0.15);
  }

  /* ---------- Typography Layouts ---------- */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--periwinkle);
    margin-bottom: 0.5rem;
  }

  .eyebrow-mark {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--coral);
  }

  .auth-title {
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--text-1);
    margin: 0;
  }

  .auth-subtitle {
    font-size: 0.88rem;
    color: var(--text-2);
    margin-top: 0.4rem;
    margin-bottom: 0;
  }

  /* ---------- Process Steps ---------- */
  .steps-list {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .step-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.65rem 0.85rem;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    opacity: 0.5;
  }

  .step-row.active {
    opacity: 1;
    background: #fbfdff;
    border-color: var(--border);
  }

  .step-row.done {
    opacity: 1;
  }

  .indicator-box {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.6rem;
    border: 1px solid var(--border);
    background: #fbfdff;
    flex-shrink: 0;
  }

  .step-label {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-2);
    transition: color 0.2s ease;
  }

  .step-row.active .step-label {
    color: var(--text-1);
    font-weight: 600;
  }

  .step-row.done .step-label {
    color: var(--text-3);
    text-decoration: line-through;
    text-decoration-color: rgba(151, 160, 188, 0.3);
  }

  /* ---------- Micro Animations ---------- */
  .spin {
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ---------- Bottom Status Elements ---------- */
  .status-footer {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-2);
    background: #fff8e8;
    border: 1px solid #ffe4a8;
    padding: 0.4rem 0.85rem;
    border-radius: 0.6rem;
    transition: all 0.2s ease;
  }

  .chip-success {
    background: #f2fbf6;
    border-color: #bef1d7;
    color: var(--success);
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--yellow);
    animation: pulse 2s ease-in-out infinite;
  }

  .success-dot {
    background: var(--success);
    animation: pulse-success 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 201, 77, 0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(255, 201, 77, 0); }
  }

  @keyframes pulse-success {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 181, 115, 0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34, 181, 115, 0); }
  }

  .system-footer {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-3);
    margin-top: 1.5rem;
    margin-bottom: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .auth-card, .spin, .pulse-dot {
      animation: none;
    }
  }
</style>
