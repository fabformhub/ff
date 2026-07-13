<script>
  /**
   * ChoiceSelector
   * A single- or multi-select stacked answer list, formMeta. from formMeta.
   *
   * Props:
   *   value      - bindable. string|null for single-select, string[] for multi-select.
   *   choices    - string[]
   *   multiple   - boolean, defaults to false (single-select / radio behavior)
   *   canAnswer  - whether the choices are interactive
   *   meta       - formMeta.object matching formMeta's shape (all fields optional, merged over defaults)
   */
  let {
    value = $bindable(),
    choices = [],
    multiple = false,
    canAnswer = false,
    form = {}
  } = $props();

  const defaultMeta = {
    color: '#0f172a',
    bgColor: '#ffffff',
    fontSize: 'Medium',
    fontFamily: 'Inter',
    answerColor: '#334155',
    buttonColor: '#6366f1',
    questionColor: '#0f172a',
    buttonTextColor: '#ffffff',
    bgImage: ''
  };

  let formMeta = $derived({ ...defaultMeta, ...(form?.meta ?? {}) });

  const fontSizeScale = {
    Small: { label: '0.875rem', badge: '0.75rem' },
    Medium: { label: '0.975rem', badge: '0.8rem' },
    Large: { label: '1.125rem', badge: '0.875rem' }
  };
  let scale = $derived(fontSizeScale[formMeta.fontSize] ?? fontSizeScale.Medium);

  // Convert a hex color to an "r, g, b" string so CSS can build rgba() tints
  // from an arbitrary runtime formMeta.color (can't do that with var() alone).
  function hexToRgbString(hex) {
    const clean = (hex || '').replace('#', '').trim();
    const full = clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;
    const num = parseInt(full, 16);
    if (Number.isNaN(num) || full.length !== 6) return '99, 102, 241'; // fallback: indigo
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  let cssVars = $derived(
    `--cs-ink:${formMeta.color};` +
    `--cs-bg:${formMeta.bgColor};` +
    `--cs-answer:${formMeta.answerColor};` +
    `--cs-question:${formMeta.questionColor};` +
    `--cs-button:${formMeta.buttonColor};` +
    `--cs-button-rgb:${hexToRgbString(formMeta.buttonColor)};` +
    `--cs-button-text:${formMeta.buttonTextColor};` +
    `--cs-ink-rgb:${hexToRgbString(formMeta.color)};` +
    `--cs-font:'${formMeta.fontFamily}', ui-sans-serif, system-ui, sans-serif;` +
    `--cs-label-size:${scale.label};` +
    `--cs-badge-size:${scale.badge};` +
    (formMeta.bgImage
      ? `--cs-bg-image:url('${formMeta.bgImage}');`
      : `--cs-bg-image:none;`)
  );

  function letterFor(index) {
    return String.fromCharCode(65 + (index % 26));
  }

  // One DOM node per choice, for roving-tabindex keyboard navigation.
  let buttons = $state([]);

  function isSelected(choice) {
    if (multiple) {
      return Array.isArray(value) && value.includes(choice);
    }
    return value === choice;
  }

  function toggleChoice(choice) {
    if (!canAnswer) return;
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      value = current.includes(choice)
        ? current.filter((v) => v !== choice)
        : [...current, choice];
    } else {
      value = value === choice ? null : choice;
    }
  }

  // Arrow keys move focus between options; Home/End jump to the ends.
  // Enter/Space select. This mirrors native radiogroup/listbox behavior.
  function handleKeydown(event, index) {
    const key = event.key;
    const isNav = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(key);
    if (!isNav) return;
    event.preventDefault();

    let next = index;
    if (key === 'ArrowRight' || key === 'ArrowDown') next = (index + 1) % choices.length;
    else if (key === 'ArrowLeft' || key === 'ArrowUp') next = (index - 1 + choices.length) % choices.length;
    else if (key === 'Home') next = 0;
    else if (key === 'End') next = choices.length - 1;

    buttons[next]?.focus();
  }
</script>

<div
  class="choice-list"
  style={cssVars}
  role={multiple ? 'group' : 'radiogroup'}
  aria-label="Choices"
>
  {#each choices as choice, i (choice)}
    {@const selected = isSelected(choice)}
    <button
      bind:this={buttons[i]}
      type="button"
      disabled={!canAnswer}
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      tabindex={selected || (!Array.isArray(value) && !value && i === 0) ? 0 : -1}
      class="choice"
      class:selected
      onclick={() => toggleChoice(choice)}
      onkeydown={(e) => handleKeydown(e, i)}
    >
      <span class="choice__badge" class:selected aria-hidden="true">
        {letterFor(i)}
      </span>

      <span class="choice__label">{choice}</span>

      <span class="choice__mark" class:multiple class:selected aria-hidden="true">
        {#if multiple}
          <svg viewBox="0 0 20 20" class="check-svg">
            <path
              class="check-path"
              d="M4.5 10.5L8 14L15.5 6"
              fill="none"
              stroke-width="2.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {:else}
          <span class="dot"></span>
        {/if}
      </span>
    </button>
  {/each}
</div>

<style>
  .choice-list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    width: 100%;
    font-family: var(--cs-font);
    background-image: var(--cs-bg-image);
    background-size: cover;
    background-position: center;
  }

  .choice {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    width: 100%;
    text-align: left;
    padding: 0.95rem 1.1rem;
    border-radius: 0.9rem;
    border: 1.5px solid rgba(var(--cs-ink-rgb), 0.12);
    background: var(--cs-bg);
    color: var(--cs-answer);
    cursor: pointer;
    font: inherit;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 180ms ease;
  }

  .choice:hover:not(:disabled) {
    border-color: rgba(var(--cs-button-rgb), 0.5);
    background: rgba(var(--cs-button-rgb), 0.06);
  }

  .choice:active:not(:disabled) {
    transform: scale(0.99);
  }

  .choice:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--cs-bg), 0 0 0 4px rgba(var(--cs-button-rgb), 0.55);
  }

  .choice:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .choice.selected {
    border-color: var(--cs-button);
    background: rgba(var(--cs-button-rgb), 0.08);
    color: var(--cs-ink);
    box-shadow: 0 4px 14px -6px rgba(var(--cs-button-rgb), 0.35);
  }

  .choice.selected:hover:not(:disabled) {
    background: rgba(var(--cs-button-rgb), 0.12);
  }

  /* Lettered reference badge (A, B, C...) */
  .choice__badge {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 0.55rem;
    font-size: var(--cs-badge-size);
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--cs-answer);
    background: rgba(var(--cs-ink-rgb), 0.06);
    border: 1.5px solid rgba(var(--cs-ink-rgb), 0.1);
    transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
  }

  .choice__badge.selected {
    background: var(--cs-button);
    border-color: var(--cs-button);
    color: var(--cs-button-text);
  }

  .choice__label {
    flex: 1;
    font-size: var(--cs-label-size);
    font-weight: 500;
    letter-spacing: -0.006em;
    line-height: 1.4;
  }

  /* Radio-style indicator (single select) */
  .choice__mark {
    flex-shrink: 0;
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 999px;
    border: 1.75px solid rgba(var(--cs-ink-rgb), 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 180ms ease, background-color 180ms ease;
  }

  .choice__mark.selected {
    border-color: var(--cs-button);
    background: var(--cs-button);
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--cs-button-text);
    transform: scale(0);
    transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .choice__mark.selected .dot {
    transform: scale(1);
  }

  /* Checkbox-style indicator (multi select) */
  .choice__mark.multiple {
    border-radius: 0.45rem;
  }

  .check-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .check-path {
    stroke: var(--cs-button-text);
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    transition: stroke-dashoffset 260ms ease 40ms;
  }

  .choice__mark.selected .check-path {
    stroke-dashoffset: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .choice,
    .dot,
    .check-path {
      transition-duration: 0.01ms !important;
    }
  }
</style>
