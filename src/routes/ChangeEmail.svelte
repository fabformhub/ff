<script>
  import { authService } from '$lib/services/authService.svelte.js';
  import { onMount } from 'svelte';
  import { FileText } from '@lucide/svelte';

  let email = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  onMount(() => {
    if (authService.state.user) {
      email = authService.state.user.email || '';
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    error = '';
    success = '';
    if (!email) {
      error = 'Email cannot be empty.';
      return;
    }
    loading = true;
    try {
      const ok = await authService.updateEmail(email);
      if (ok) success = 'Email updated successfully!';
    } catch (err) {
      error = err?.message || 'Failed to update email.';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="settings-card">
  <!-- Brand Header Section -->
  <div class="card-header">
    <div class="eyebrow">
      <span class="eyebrow-mark"></span>
      Account settings
    </div>
    <h2 class="card-title">Change Email</h2>
    <p class="card-subtitle">Update your primary login and communications address</p>
  </div>

  <!-- Action Notification Banners -->
  {#if error}
    <div class="error-banner" role="alert">
      <span class="error-banner-text">{error}</span>
      <button class="error-banner-dismiss" onclick={() => (error = '')} aria-label="Dismiss">
        ✕
      </button>
    </div>
  {/if}

  {#if success}
    <div class="success-banner" role="alert">
      <span class="pulse-dot success-dot"></span>
      <span class="success-banner-text">{success}</span>
    </div>
  {/if}

  <!-- Interactive Form Area -->
  <form onsubmit={handleSubmit} class="settings-form">
    <div class="input-group">
      <label for="email" class="input-label">Email address</label>
      <input 
        id="email"
        type="email" 
        bind:value={email} 
        class="form-input" 
        placeholder="you@example.com"
        required 
      />
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}
          <div class="loading-mark-inline"></div>
          Updating…
        {:else}
          Update email
        {/if}
      </button>
    </div>
  </form>
</div>

<style>
  .settings-card {
    --surface: #ffffff;
    --border: #e3ecfa;
    --border-strong: #cddcf2;
    --text-1: #1b2140;
    --text-2: #5c6685;
    --text-3: #97a0bc;
    --coral: #ff6b4a;
    --periwinkle: #6c63ff;
    --success: #22b573;

    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 4px solid var(--periwinkle);
    border-radius: 1rem;
    box-shadow: 0 2px 8px -4px rgba(27, 33, 64, 0.08);
    max-width: 28rem;
    margin: 2.5rem auto;
    padding: 2.5rem 2rem;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--text-1);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .settings-card:hover {
    transform: translateY(-2px) rotate(-0.2deg);
    box-shadow: 0 14px 28px -12px rgba(27, 33, 64, 0.14);
  }

  /* ---------- Header Presentation ---------- */
  .card-header {
    margin-bottom: 1.75rem;
  }

  .eyebrow {
    display: flex;
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
    display: inline-block;
  }

  .card-title {
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--text-1);
    margin: 0;
  }

  .card-subtitle {
    font-size: 0.88rem;
    color: var(--text-2);
    margin-top: 0.4rem;
    margin-bottom: 0;
  }

  /* ---------- Notification Architecture ---------- */
  .error-banner {
    margin-bottom: 1.25rem;
    padding: 0.8rem 1.1rem;
    border-radius: 0.8rem;
    background: #fef1f1;
    border: 1px solid #f8caca;
    color: #b42424;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.82rem;
    font-weight: 500;
  }

  .error-banner-dismiss {
    background: transparent;
    border: none;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0;
  }

  .error-banner-dismiss:hover {
    opacity: 1;
  }

  .success-banner {
    margin-bottom: 1.25rem;
    padding: 0.8rem 1.1rem;
    border-radius: 0.8rem;
    background: #f2fbf6;
    border: 1px solid #bef1d7;
    color: var(--success);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--success);
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 181, 115, 0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(34, 181, 115, 0); }
  }

  /* ---------- Input Fields & Layouts ---------- */
  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-2);
  }

  .form-input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.65rem 0.9rem;
    border-radius: 0.7rem;
    border: 1px solid var(--border-strong);
    background: #ffffff;
    color: var(--text-1);
    font-size: 0.9rem;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--periwinkle);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
  }

  /* ---------- Actions & Custom CTA ---------- */
  .form-actions {
    display: flex;
    justify-content: flex-start;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.25rem;
    border-radius: 0.7rem;
    font-size: 0.87rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    border: 1px solid transparent;
  }

  .btn-primary {
    background: var(--coral);
    color: #ffffff;
    box-shadow: 0 4px 14px -4px rgba(255, 107, 74, 0.55);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 24px -8px rgba(255, 107, 74, 0.6);
  }

  .btn-primary:disabled {
    background: var(--text-3);
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .loading-mark-inline {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #ffffff;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse-dot, .loading-mark-inline {
      animation: none;
    }
  }
</style>
