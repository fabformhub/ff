<script>
  // MentionInput.svelte — Svelte 5 (runes), styled with Tailwind.
  //
  // A single-line, input-like contenteditable control. Typing "@" opens a
  // searchable dropdown of previous answers (names may contain spaces, e.g.
  // "this is the name"). Choosing one inserts "@name" as a highlighted,
  // non-editable chip. Everything else stays as plain, unstyled text.
  //
  // Public instance API (via bind:this):
  //   getPlainText()     -> "Hi @this is the name, welcome!"
  //   getResolvedText()  -> "Hi Jordan Reyes, welcome!"       (chips -> answer)
  //   getAnswersUsed()   -> [{ key, value, count }, ...]      (deduped)
  //   focus() / clear()

  import { AtSign } from '@lucide/svelte';

  let {
    answers = [],
    placeholder = 'Type @ to insert an answer…',
    value = $bindable(''),
    maxSuggestions = 40,
    onupdate = () => {},
  } = $props();

  let editorEl = $state(null);
  let wrapperEl = $state(null);
  let isFocused = $state(false);
  let isEmpty = $state(true);

  let showDropdown = $state(false);
  let query = $state('');
  let activeIndex = $state(0);
  let menuPos = $state({ top: 0, left: 0 });
  let mentionAnchor = null; // { node: Text, startOffset: number } — DOM-tied, not reactive
  let itemEls = $state([]);

  const norm = (s) => s.toLowerCase();

  let filteredAnswers = $derived.by(() => {
    const q = norm(query.trim());
    if (!q) return answers.slice(0, maxSuggestions);
    const starts = [];
    const includes = [];
    for (const a of answers) {
      const k = norm(a.key);
      if (k.startsWith(q)) starts.push(a);
      else if (k.includes(q)) includes.push(a);
    }
    return [...starts, ...includes].slice(0, maxSuggestions);
  });

  $effect(() => {
    if (activeIndex >= filteredAnswers.length) activeIndex = 0;
  });

  $effect(() => {
    itemEls[activeIndex]?.scrollIntoView({ block: 'nearest' });
  });

  let didInit = false;
  $effect(() => {
    if (!didInit && editorEl) {
      didInit = true;
      if (value) editorEl.textContent = value;
      refreshEmptyState();
    }
  });

  function refreshEmptyState() {
    isEmpty = !editorEl || editorEl.textContent.trim() === '';
  }

  function closeDropdown() {
    showDropdown = false;
    query = '';
    activeIndex = 0;
    mentionAnchor = null;
  }

  function positionMenu() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !wrapperEl) return;
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    let rect = range.getClientRects()[0];
    if (!rect) rect = range.getBoundingClientRect();
    const wrapRect = wrapperEl.getBoundingClientRect();
    menuPos = { top: rect.bottom - wrapRect.top + 6, left: Math.max(0, rect.left - wrapRect.left) };
  }

  function handleInput() {
    refreshEmptyState();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      closeDropdown();
      emitUpdate();
      return;
    }
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;

    if (node.nodeType !== Node.TEXT_NODE) {
      closeDropdown();
      emitUpdate();
      return;
    }

    const text = node.textContent ?? '';

    if (
      mentionAnchor &&
      mentionAnchor.node === node &&
      offset > mentionAnchor.startOffset &&
      text[mentionAnchor.startOffset] === '@'
    ) {
      query = text.slice(mentionAnchor.startOffset + 1, offset);
      showDropdown = true;
      positionMenu();
      emitUpdate();
      return;
    }

    if (text[offset - 1] === '@') {
      const prevChar = text[offset - 2];
      const validStart = prevChar === undefined || /\s/.test(prevChar);
      if (validStart) {
        mentionAnchor = { node, startOffset: offset - 1 };
        query = '';
        activeIndex = 0;
        showDropdown = true;
        positionMenu();
        emitUpdate();
        return;
      }
    }

    closeDropdown();
    emitUpdate();
  }

  function handleKeydown(e) {
    if (!showDropdown) {
      if (e.key === 'Enter') e.preventDefault(); // single-line control
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filteredAnswers.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredAnswers[activeIndex]) selectAnswer(filteredAnswers[activeIndex]);
        else closeDropdown();
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  }

  function selectAnswer(a) {
    if (!mentionAnchor) return;
    const sel = window.getSelection();
    const { node, startOffset } = mentionAnchor;
    const endOffset = startOffset + 1 + query.length;

    const range = document.createRange();
    range.setStart(node, startOffset);
    range.setEnd(node, Math.min(endOffset, node.textContent.length));
    range.deleteContents();

    const chip = document.createElement('span');
    chip.className =
      'bg-violet-100 text-violet-700 rounded px-1 mx-0.5 font-semibold whitespace-nowrap';
    chip.contentEditable = 'false';
    chip.dataset.answerKey = a.key;
    chip.textContent = `@${a.key}`;
    range.insertNode(chip);

    const spacer = document.createTextNode(' ');
    chip.after(spacer);

    const newRange = document.createRange();
    newRange.setStart(spacer, spacer.length);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    editorEl.focus();
    closeDropdown();
    refreshEmptyState();
    emitUpdate();
  }

  function handleFocus() {
    isFocused = true;
  }

  function handleBlur() {
    isFocused = false;
    closeDropdown();
  }

  function isChip(node) {
    return node.dataset?.answerKey !== undefined;
  }

  function walk(node, onText, onChip) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) onText(child.textContent);
      else if (isChip(child)) onChip(child);
      else walk(child, onText, onChip);
    }
  }

  export function getPlainText() {
    if (!editorEl) return '';
    let out = '';
    walk(editorEl, (t) => (out += t), (chip) => (out += chip.textContent));
    return out;
  }

  export function getResolvedText() {
    if (!editorEl) return '';
    let out = '';
    walk(
      editorEl,
      (t) => (out += t),
      (chip) => {
        const a = answers.find((x) => x.key === chip.dataset.answerKey);
        out += a ? a.value : chip.textContent;
      }
    );
    return out;
  }

  export function getAnswersUsed() {
    if (!editorEl) return [];
    const counts = new Map();
    editorEl.querySelectorAll('[data-answer-key]').forEach((chip) => {
      const key = chip.dataset.answerKey;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const out = [];
    for (const [key, count] of counts) {
      const a = answers.find((x) => x.key === key);
      if (a) out.push({ key: a.key, value: a.value, count });
    }
    return out;
  }

  export function focus() {
    editorEl?.focus();
  }

  export function clear() {
    if (!editorEl) return;
    editorEl.textContent = '';
    closeDropdown();
    refreshEmptyState();
    emitUpdate();
  }

  function emitUpdate() {
    const text = getPlainText();
    value = text;
    onupdate({ text, resolvedText: getResolvedText(), answersUsed: getAnswersUsed() });
  }
</script>

<div class="relative w-full" bind:this={wrapperEl}>
  <div
    class="w-full min-h-[42px] box-border px-3 py-2 border rounded-lg bg-white text-sm leading-6 text-gray-900 outline-none whitespace-pre-wrap break-words transition-colors
      {isFocused ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-300'}
      {isEmpty ? "before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none" : ''}"
    bind:this={editorEl}
    contenteditable="true"
    role="textbox"
    aria-label={placeholder}
    aria-multiline="false"
    tabindex="0"
    data-placeholder={placeholder}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onfocus={handleFocus}
    onblur={handleBlur}
  ></div>

  {#if showDropdown}
    <div
      class="absolute z-50 min-w-[260px] max-w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style="top:{menuPos.top}px; left:{menuPos.left}px;"
      onmousedown={(e) => e.preventDefault()}
    >
      {#if filteredAnswers.length === 0}
        <div class="flex items-center gap-2 p-3 text-gray-400 text-sm">
          <AtSign size={14} />
          <span>No answers match "{query}"</span>
        </div>
      {:else}
        <ul class="list-none m-0 p-1 max-h-64 overflow-y-auto" role="listbox">
          {#each filteredAnswers as item, i (item.key)}
            <li
              bind:this={itemEls[i]}
              role="option"
              aria-selected={i === activeIndex}
              class="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm {i === activeIndex ? 'bg-violet-50' : ''}"
              onclick={() => selectAnswer(item)}
              onmouseenter={() => (activeIndex = i)}
            >
              <span class="flex text-violet-600 shrink-0"><AtSign size={14} /></span>
              <span class="font-semibold text-gray-900 flex-1 truncate">{item.key}</span>
              <span class="text-gray-400 text-xs max-w-[110px] truncate">{item.value}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
