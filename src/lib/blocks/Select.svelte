<script>
  /**
   * ChoiceSelector
   * A single- or multi-select stacked answer list, driven by formMeta.
   *
   * Props:
   *   value      - bindable. string|null for single-select, string[] for multi-select.
   *   choices    - string[]
   *   multiple   - boolean, defaults to false (single-select / radio behavior)
   *   canAnswer  - whether the choices are interactive. Also doubles as the
   *                audience signal for the empty state: true = live respondent,
   *                false = the person designing the form.
   *   form       - object whose `.meta` matches formMeta's shape (all fields optional, merged over defaults)
   *
   * Styling: Tailwind utility classes everywhere. The only real CSS left is two
   * @keyframes (Tailwind's `animate-[name_...]` arbitrary value needs the
   * keyframes defined somewhere, and there's no tailwind.config here to add
   * them to `theme.extend.keyframes`). Every color/size that depends on
   * formMeta is a CSS custom property set inline via `style={cssVars}`, and
   * the Tailwind classes reference those vars through arbitrary values like
   * `bg-[var(--cs-bg)]` — so the utility is static, only the value is runtime.
   */
  import { Check, ListPlus, Inbox } from '@lucide/svelte';

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

  // Convert a hex color to an "r, g, b" string so Tailwind's arbitrary rgba()
  // values can build tints from an arbitrary runtime formMeta.color.
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

  // --- Tailwind class builders -------------------------------------------
  // Kept as functions (rather than inlined ternaries in the markup) so the
  // long utility strings don't turn the template into a wall of text.

  const CHOICE_BASE =
    'group relative flex w-full items-center gap-3.5 rounded-2xl border-[1.5px] ' +
    'px-[1.15rem] py-4 text-left cursor-pointer opacity-0 ' +
    '[animation:choice-in_320ms_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:calc(var(--i,0)*40ms)] ' +
    'transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out ' +
    'enabled:hover:-translate-y-px ' +
    'active:enabled:translate-y-0 active:enabled:scale-[0.99] ' +
    'focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--cs-bg),0_0_0_4.5px_rgba(var(--cs-button-rgb),0.55)] ' +
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:!animate-none ' +
    'motion-reduce:!opacity-100 motion-reduce:!animate-none motion-reduce:!translate-y-0';

  const CHOICE_UNSELECTED =
    'border-[rgba(var(--cs-ink-rgb),0.1)] bg-[var(--cs-bg)] text-[var(--cs-answer)] ' +
    'shadow-[0_1px_2px_rgba(var(--cs-ink-rgb),0.04),0_0_0_1px_rgba(var(--cs-ink-rgb),0.02)] ' +
    'enabled:hover:border-[rgba(var(--cs-button-rgb),0.45)] enabled:hover:bg-[rgba(var(--cs-button-rgb),0.05)] ' +
    'enabled:hover:shadow-[0_6px_16px_-8px_rgba(var(--cs-ink-rgb),0.18),0_0_0_1px_rgba(var(--cs-button-rgb),0.12)]';

  const CHOICE_SELECTED =
    'border-[var(--cs-button)] bg-[var(--cs-bg)] text-[var(--cs-ink)] ' +
    '[background-image:linear-gradient(rgba(var(--cs-button-rgb),0.09),rgba(var(--cs-button-rgb),0.09))] ' +
    'shadow-[0_10px_24px_-12px_rgba(var(--cs-button-rgb),0.45),0_0_0_1px_rgba(var(--cs-button-rgb),0.35)] ' +
    'enabled:hover:[background-image:linear-gradient(rgba(var(--cs-button-rgb),0.13),rgba(var(--cs-button-rgb),0.13))]';

  function choiceClasses(selected) {
    return `${CHOICE_BASE} ${selected ? CHOICE_SELECTED : CHOICE_UNSELECTED}`;
  }

  const BADGE_BASE =
    'flex h-[1.9rem] w-[1.9rem] shrink-0 items-center justify-center rounded-[0.6rem] ' +
    'border-[1.5px] text-[length:var(--cs-badge-size)] font-semibold tracking-[0.01em] ' +
    'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ' +
    'motion-reduce:!scale-100';

  const BADGE_UNSELECTED =
    'border-[rgba(var(--cs-ink-rgb),0.08)] bg-[rgba(var(--cs-ink-rgb),0.05)] text-[var(--cs-answer)]';

  const BADGE_SELECTED =
    'scale-[1.06] border-transparent bg-gradient-to-br from-[var(--cs-button)] to-[rgba(var(--cs-button-rgb),0.82)] ' +
    'text-[var(--cs-button-text)] shadow-[0_3px_8px_-2px_rgba(var(--cs-button-rgb),0.55)]';

  function badgeClasses(selected) {
    return `${BADGE_BASE} ${selected ? BADGE_SELECTED : BADGE_UNSELECTED}`;
  }

  function markClasses(selected, isMultiple) {
    const shape = isMultiple ? 'rounded-[0.45rem]' : 'rounded-full';
    const base =
      `flex h-[1.35rem] w-[1.35rem] shrink-0 items-center justify-center border-[1.75px] ${shape} ` +
      'transition-[border-color,background-color,box-shadow] duration-200';
    const state = selected
      ? 'border-[var(--cs-button)] bg-[var(--cs-button)] shadow-[0_0_0_3px_rgba(var(--cs-button-rgb),0.16)]'
      : 'border-[rgba(var(--cs-ink-rgb),0.16)]';
    return `${base} ${state}`;
  }

  function dotClasses(selected) {
    return (
      'h-2 w-2 rounded-full bg-[var(--cs-button-text)] transition-transform duration-200 ' +
      '[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:!scale-100 ' +
      (selected ? 'scale-100' : 'scale-0')
    );
  }

  function checkIconClasses(selected) {
    return (
      'flex items-center justify-center text-[var(--cs-button-text)] transition-[transform,opacity] duration-[260ms] ' +
      '[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:!scale-100 motion-reduce:!rotate-0 motion-reduce:!opacity-100 ' +
      (selected ? 'scale-100 rotate-0 opacity-100' : 'scale-[0.3] -rotate-[8deg] opacity-0')
    );
  }
</script>

{#if choices.length === 0}
  <div
    class="flex flex-col items-center gap-2.5 rounded-2xl border-[1.5px] border-dashed
      border-[rgba(var(--cs-ink-rgb),0.16)] bg-[var(--cs-bg)]
      [background-image:radial-gradient(120%_140%_at_50%_0%,rgba(var(--cs-button-rgb),0.06),transparent_60%)]
      px-7 py-11 text-center [font-family:var(--cs-font)] text-[var(--cs-answer)]"
    style={cssVars}
    role="status"
  >
    {#if canAnswer}
      <!-- Respondent view: nothing they can do about it, so no call to action. -->
      <div
        class="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border-[1.5px]
          border-[rgba(var(--cs-ink-rgb),0.1)] bg-[rgba(var(--cs-ink-rgb),0.06)] text-[var(--cs-answer)]
          [animation:empty-pop_420ms_cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:!animate-none"
      >
        <Inbox size={22} strokeWidth={2} />
      </div>
      <p class="m-0 text-[length:var(--cs-label-size)] font-semibold tracking-[-0.008em] text-[var(--cs-question)]">
        This question has no answers yet
      </p>
      <p class="m-0 max-w-[28ch] text-[length:var(--cs-badge-size)] leading-relaxed text-[var(--cs-answer)] opacity-75">
        There's nothing to select right now.
      </p>
    {:else}
      <!-- Designer view: helpful and actionable, since they can fix it here. -->
      <div
        class="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border-[1.5px]
          border-[rgba(var(--cs-button-rgb),0.18)] bg-[rgba(var(--cs-button-rgb),0.1)] text-[var(--cs-button)]
          [animation:empty-pop_420ms_cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:!animate-none"
      >
        <ListPlus size={22} strokeWidth={2} />
      </div>
      <p class="m-0 text-[length:var(--cs-label-size)] font-semibold tracking-[-0.008em] text-[var(--cs-question)]">
        Add your first answer to get started
      </p>
      <p class="m-0 max-w-[28ch] text-[length:var(--cs-badge-size)] leading-relaxed text-[var(--cs-answer)] opacity-75">
        Respondents will see these as selectable options. Add a few to see this preview come to life.
      </p>
    {/if}
  </div>
{:else}
  <div
    class="flex w-full flex-col gap-[0.65rem] [font-family:var(--cs-font)] [background-image:var(--cs-bg-image)] bg-cover bg-center"
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
        class={choiceClasses(selected)}
        style="--i:{i}"
        onclick={() => toggleChoice(choice)}
        onkeydown={(e) => handleKeydown(e, i)}
      >
        <span class={badgeClasses(selected)} aria-hidden="true">
          {letterFor(i)}
        </span>
        <span class="flex-1 text-[length:var(--cs-label-size)] font-medium tracking-[-0.006em] leading-[1.4]">
          {choice}
        </span>
        <span class={markClasses(selected, multiple)} aria-hidden="true">
          {#if multiple}
            <span class={checkIconClasses(selected)}>
              <Check size={13} strokeWidth={3} />
            </span>
          {:else}
            <span class={dotClasses(selected)}></span>
          {/if}
        </span>
      </button>
    {/each}
  </div>
{/if}

<style>
  /* Tailwind's arbitrary `[animation:name_...]` values need the keyframes to
     exist somewhere; without a tailwind.config to extend, this is the
     smallest CSS footprint that still gets the entrance/pop motion.

     IMPORTANT: the `-global-` prefix stops Svelte from hash-renaming these
     keyframes. Tailwind's generated `animation: choice-in ...` rule lives in
     a separate stylesheet it doesn't know about, so if Svelte silently
     renamed `choice-in` to `choice-in-xxxxx` here, the name Tailwind
     references would no longer exist anywhere — the animation would never
     fire, and every choice (which starts at opacity-0 until the animation
     runs) would stay invisible. -global- is stripped from the final output,
     so the compiled name is still exactly `choice-in` / `empty-pop`. */
  @keyframes -global-choice-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes -global-empty-pop {
    from {
      opacity: 0;
      transform: scale(0.75);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
