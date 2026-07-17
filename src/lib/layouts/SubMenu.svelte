 <script>
  let { onBlock, onDesign,onEmail } = $props();
  import { goto } from '$app/navigation';

  import { tick } from 'svelte';
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
  let hoveredItem = $state(null);

  let groupEl = $state(null);
  let itemRefs = {}; // plain object of DOM refs, not reactive — read inside effect only

  let indicator = $state({ left: 0, width: 0, opacity: 0 });

const items = [
  { id: 'add-block', label: 'Add Block', icon: Plus, action: onBlock },
  { id: 'design', label: 'Design', icon: Palette, action: onDesign },
  { id: 'email', label: 'Email', icon: Mail, action: onEmail }
];

function select(item) {
  activeItem = activeItem === item.id ? null : item.id;
  item.action?.();
}
const displayItem = $derived(hoveredItem ?? activeItem);

  async function updateIndicator() {
    await tick();
    const target = displayItem;
    if (!target || !itemRefs[target] || !groupEl) {
      indicator = { ...indicator, opacity: 0 };
      return;
    }
    const groupRect = groupEl.getBoundingClientRect();
    const btnRect = itemRefs[target].getBoundingClientRect();
    indicator = {
      left: btnRect.left - groupRect.left,
      width: btnRect.width,
      opacity: 1
    };
  }

  $effect(() => {
    displayItem;
    updateIndicator();
  });

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
  <div class="menubar__group" bind:this={groupEl}>
    <span
      class="menubar__indicator"
      style="transform:translateX({indicator.left}px); width:{indicator.width}px; opacity:{indicator.opacity}"
    ></span>
    {#each items as item (item.id)}
      <button
        type="button"
        bind:this={itemRefs[item.id]}
        class="menubar__item"
        class:is-active={activeItem === item.id}
        aria-pressed={activeItem === item.id}
        onclick={() => select(item)}
        onmouseenter={() => (hoveredItem = item.id)}
        onmouseleave={() => (hoveredItem = null)}
      >
        <span class="menubar__icon">
          <item.icon size={15} strokeWidth={2.25} />
        </span>
        <span class="menubar__label">{item.label}</span>
      </button>
    {/each}
  </div>

  <div class="menubar__divider" aria-hidden="true"></div>

  <div
    class="menubar__save"
    data-state={saveState}
    title={saveState === 'saving' ? 'Saving…' : 'All changes saved'}
  >
    <span class="menubar__save-icon">
      {#if saveState === 'saving'}
        <Loader2 size={13} strokeWidth={2.5} class="spin" />
      {:else}
        <span class="menubar__save-dot"></span>
        <Check size={13} strokeWidth={2.75} />
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
  @keyframes pulse-in {
    0%   { opacity: 0.9; transform: scale(0.6); }
    60%  { opacity: 0.35; transform: scale(1.6); }
    100% { opacity: 0; transform: scale(2); }
  }

  .menubar {
    /* Fabform design system */
    --bar-bg: #FFFFFF;
    --bar-border: #E3ECFA;
    --ink: #1B2140;
    --ink-dim: #97A0BC;
    --active-bg: #EFEDFF;
    --active-ink: #4A3FBF;
    --focus-ring: #6C63FF;
    --accent: #22B573;
    --accent-soft: rgba(34, 181, 115, 0.16);

    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 5px 7px;
    background: var(--bar-bg);
    border: 1px solid var(--bar-border);
    border-radius: 12px;
    box-shadow:
      0 8px 30px rgba(27, 33, 64, 0.07),
      0 1px 2px rgba(27, 33, 64, 0.04);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  .menubar__group {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .menubar__indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 8px;
    background: var(--active-bg);
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      width 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.15s ease;
    pointer-events: none;
    z-index: 0;
  }

  .menubar__item {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 11px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--ink-dim);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
    cursor: pointer;
    transition: color 0.18s ease, transform 0.1s ease;
  }
  .menubar__item:hover {
    color: var(--ink);
  }
  .menubar__item:active {
    transform: scale(0.97);
  }
  .menubar__item.is-active {
    color: var(--active-ink);
  }
  .menubar__item:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 1px;
  }

  .menubar__icon {
    display: inline-flex;
    color: inherit;
    opacity: 0.85;
  }
  .menubar__item.is-active .menubar__icon,
  .menubar__item:hover .menubar__icon {
    opacity: 1;
  }

  .menubar__label {
    white-space: nowrap;
  }

  .menubar__divider {
    width: 1px;
    height: 20px;
    margin: 0 6px;
    background: var(--bar-border);
    flex-shrink: 0;
  }

  .menubar__save {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 11px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
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
  .menubar__save-label {
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
</style>
