<script>
  /**
   * MenuBar.svelte — Svelte 5
   * A thin, premium horizontal toolbar with an animated autosave indicator.
   *
   * npm i lucide-svelte
   */

import Plus from '@lucide/svelte/icons/plus';
import Palette from '@lucide/svelte/icons/palette';
import Mail from '@lucide/svelte/icons/mail';
import Check from '@lucide/svelte/icons/check';
import Loader2 from '@lucide/svelte/icons/loader-2';

  /**
   * saveState: 'idle' | 'saving' | 'saved'
   * Drive this from your app's actual persistence layer.
   * Demo cycle included below — remove in production.
   */
  let saveState = $state('saved');
  let activeItem = $state(null);

  const items = [
    { id: 'add-block', label: 'Add Block', icon: Plus },
    { id: 'design',    label: 'Design',    icon: Palette },
    { id: 'email',     label: 'Email',     icon: Mail },
  ];

  function select(id) {
    activeItem = activeItem === id ? null : id;
  }

  // --- Demo only: simulates an autosave cycle every few seconds ---
  // Delete this $effect block when wiring up real save events.
  $effect(() => {
    const t = setInterval(() => {
      saveState = 'saving';
      setTimeout(() => { saveState = 'saved'; }, 900);
    }, 5000);
    return () => clearInterval(t);
  });
</script>

<div class="menubar" role="toolbar" aria-label="Main toolbar">
  <div class="menubar__group">
    {#each items as item (item.id)}
      <button
        type="button"
        class="menubar__item"
        class:is-active={activeItem === item.id}
        aria-pressed={activeItem === item.id}
        onclick={() => select(item.id)}
      >
        <span class="menubar__icon">
          <item.icon size={15} strokeWidth={2} />
        </span>
        <span class="menubar__label">{item.label}</span>
      </button>
    {/each}
  </div>

  <div class="menubar__divider" aria-hidden="true"></div>

  <div class="menubar__save" data-state={saveState} title={saveState === 'saving' ? 'Saving…' : 'All changes saved'}>
    <span class="menubar__save-icon">
      {#if saveState === 'saving'}
        <Loader2 size={13} strokeWidth={2.25} class="spin" />
      {:else}
        <span class="menubar__save-dot"></span>
        <Check size={13} strokeWidth={2.5} />
      {/if}
    </span>
    <span class="menubar__save-label">
      {saveState === 'saving' ? 'Saving' : 'Saved'}
    </span>
  </div>
</div>

<style>
  :global(.spin) {
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .menubar {
    --bar-bg: #141416;
    --bar-border: rgba(255, 255, 255, 0.07);
    --ink: #ededf0;
    --ink-dim: #8b8b93;
    --hover-bg: rgba(255, 255, 255, 0.055);
    --active-bg: rgba(255, 255, 255, 0.09);
    --accent: #34d399;
    --accent-soft: rgba(52, 211, 153, 0.16);
    --radius: 8px;

    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 4px 6px;
    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), var(--bar-bg);
    border: 1px solid var(--bar-border);
    border-radius: 10px;
    box-shadow:
      0 1px 0 rgba(255,255,255,0.04) inset,
      0 8px 24px -12px rgba(0,0,0,0.55),
      0 1px 2px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  .menubar__group {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .menubar__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius);
    color: var(--ink-dim);
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
  }

  .menubar__item:hover {
    background: var(--hover-bg);
    color: var(--ink);
  }

  .menubar__item:active {
    transform: scale(0.97);
  }

  .menubar__item.is-active {
    background: var(--active-bg);
    color: var(--ink);
  }

  .menubar__item:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  .menubar__icon {
    display: inline-flex;
    color: inherit;
    opacity: 0.85;
  }

  .menubar__item.is-active .menubar__icon {
    opacity: 1;
  }

  .menubar__label {
    white-space: nowrap;
  }

  .menubar__divider {
    width: 1px;
    height: 18px;
    margin: 0 6px;
    background: var(--bar-border);
    flex-shrink: 0;
  }

  .menubar__save {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 10px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-dim);
    transition: color 0.2s ease;
  }

  .menubar__save[data-state='saved'] {
    color: var(--accent);
  }

  .menubar__save-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
  }

  .menubar__save[data-state='saving'] .menubar__save-icon {
    color: var(--ink-dim);
  }

  .menubar__save[data-state='saved'] .menubar__save-icon {
    color: var(--accent);
  }

  .menubar__save-dot {
    position: absolute;
    inset: -3px;
    border-radius: 999px;
    background: var(--accent-soft);
    opacity: 0;
    transform: scale(0.6);
  }

  .menubar__save[data-state='saved'] .menubar__save-dot {
    animation: pulse-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes pulse-in {
    0% { opacity: 0.9; transform: scale(0.6); }
    60% { opacity: 0.35; transform: scale(1.6); }
    100% { opacity: 0; transform: scale(2); }
  }

  .menubar__save-label {
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
</style>
