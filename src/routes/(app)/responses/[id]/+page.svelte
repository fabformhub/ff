<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { getResponsesByFormId, deleteResponseById } from '$lib/services/responseService.js';
  import { blockRegistry } from '$lib/utils/blockRegistry.js';
  import { DefaultLayout } from '$lib/layouts/';
  import {
    Inbox, Download, Trash2, Search, Star, MoreHorizontal, X,
    Rows3, LayoutGrid, ChevronDown, Sparkles, Link2
  } from '@lucide/svelte';

  const formId = $derived(page.params.id);

  let responses = $state([]);
  let error = $state('');
  let loading = $state(true);
  let selected = $state(new Set());
  let starred = $state(new Set());
  let query = $state('');
  let deleting = $state(false);

  // Each block type carries its own icon + bg color directly on its
  // blockRegistry entry. Icons/labels use one neutral tone across every
  // chip so the background stays the single source of color distinction.
  const FALLBACK_CHIP = { icon: null, bg: 'bg-gray-100' };
  const CHIP_TONE = '#5C6685';

  function getBlock(blockTypeId) {
    return blockRegistry.find((b) => b.blockTypeId === blockTypeId);
  }

  function chipFor(blockTypeId) {
    const block = getBlock(blockTypeId);
    if (!block) return FALLBACK_CHIP;
    return {
      icon: block.icon ?? null,
      bg: block.bgColor ?? FALLBACK_CHIP.bg
    };
  }

  function initials(meta) {
    const nameField = meta?.find((m) => /name/i.test(m.question || m.title || ''));
    const src = nameField?.answer || '?';
    return String(src)
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  const filtered = $derived.by(() => {
    if (!query.trim()) return responses;
    const q = query.toLowerCase();
    return responses.filter((r) =>
      r.meta?.some((m) => String(m.answer ?? '').toLowerCase().includes(q))
    );
  });

  function toggleSelection(id) {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    selected = copy;
  }

  function toggleStar(id) {
    const copy = new Set(starred);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    starred = copy;
  }

  function clearSelection() {
    selected = new Set();
  }

  async function deleteSelected() {
    const idsToDelete = [...selected];
    deleting = true;
    try {
      await Promise.all(idsToDelete.map((id) => deleteResponseById(id)));
      responses = responses.filter((r) => !selected.has(r.id));
      selected = new Set();
    } catch (err) {
      error = 'Failed to delete some responses.';
    } finally {
      deleting = false;
    }
  }

  function escapeCSV(value) {
    if (value == null) return '';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  }

  function downloadCSV(rowsToExport) {
    if (rowsToExport.length === 0) return;
    const answerKeys = Array.from(
      new Set(rowsToExport.flatMap((r) => r.meta?.map((m) => m.blockTypeId) || []))
    );
    const headers = ['ID', 'Timestamp', ...answerKeys.map((key) => `Answer-${key}`)];
    const rows = rowsToExport.map((response) => {
      const map = new Map(response.meta?.map((m) => [m.blockTypeId, m.answer || '']));
      return [
        response.id,
        formatDate(response.created_at),
        ...answerKeys.map((k) => escapeCSV(map.get(k) || ''))
      ];
    });
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `responses-${formId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportAll() {
    downloadCSV(responses);
  }

  function exportSelected() {
    downloadCSV(responses.filter((r) => selected.has(r.id)));
  }

  async function copyFormLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/f/${formId}`);
    } catch (err) {
      // clipboard permission denied — silently ignore, button remains usable
    }
  }

  onMount(async () => {
    const res = await getResponsesByFormId(formId);
    if (res.success) {
      responses = res.data?.responses ?? [];
    } else {
      error = res.error;
    }
    loading = false;
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<DefaultLayout {formId} activeMenuLabel="Responses">
  <div class="min-h-screen relative font-sans" style="background:#F5FAFF">
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div
        class="absolute -top-[30%] left-[10%] w-[600px] h-[600px] rounded-full blur-[120px]"
        style="background:linear-gradient(135deg, rgba(255,107,74,0.2), rgba(255,201,77,0.2))"
      ></div>
      <div
        class="absolute -bottom-[30%] right-[10%] w-[600px] h-[600px] rounded-full blur-[120px]"
        style="background:linear-gradient(135deg, rgba(108,99,255,0.15), rgba(34,181,115,0.1))"
      ></div>
    </div>

    <div class="relative max-w-5xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <h1
              class="text-[26px] font-bold tracking-tight text-[#1B2140]"
              style="font-family:'Bricolage Grotesque', sans-serif"
            >
              Responses
            </h1>
            {#if !loading}
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style="background:#EFEDFF;color:#4A3FBF"
              >
                {responses.length}
                {responses.length === 1 ? 'response' : 'responses'}
              </span>
            {/if}
          </div>
          <p class="text-sm text-[#5C6685]">
            Every answer your form has collected, organized and ready to export.
          </p>
        </div>

        {#if responses.length > 0}
          <button
            onclick={exportAll}
            class="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E3ECFA] rounded-xl text-sm font-medium text-[#1B2140] shadow-[0_2px_8px_rgba(27,33,64,0.04)] hover:border-[#6C63FF] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
          >
            <Download class="w-4 h-4" strokeWidth={2.25} />
            <span>Export CSV</span>
          </button>
        {/if}
      </div>

      {#if error}
        <div
          class="mb-6 rounded-xl border border-[#F8CACA] bg-[#FEF1F1] p-3.5 flex items-start gap-3 text-sm text-[#B42424]"
        >
          <span class="font-medium">{error}</span>
        </div>
      {/if}

      <!-- Loading -->
      {#if loading}
        <div class="space-y-4">
          {#each Array(3) as _}
            <div class="h-[132px] rounded-2xl bg-white border border-[#E3ECFA] animate-pulse"></div>
          {/each}
        </div>

      <!-- Empty state -->
      {:else if responses.length === 0}
        <div
          class="relative bg-white border border-[#E3ECFA] rounded-2xl px-10 py-20 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(27,33,64,0.06)] overflow-hidden"
        >
          <span
            class="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          ></span>
          <div class="relative w-20 h-20 rounded-full flex items-center justify-center mb-6" style="background:#FFF1EC">
            <div class="absolute inset-0 rounded-full border-2 border-dashed" style="border-color:#FFC5AE"></div>
            <Inbox class="w-8 h-8" style="color:#FF6B4A" strokeWidth={1.75} />
          </div>
          <h2
            class="text-xl font-bold text-[#1B2140] mb-1.5"
            style="font-family:'Bricolage Grotesque', sans-serif"
          >
            Nobody's answered yet
          </h2>
          <p class="text-sm text-[#5C6685] max-w-[360px] mb-7">
            Share your form and every response will land here in real time, organized question by
            question.
          </p>
          <div class="flex items-center gap-3">
            <button
              onclick={copyFormLink}
              class="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] text-white rounded-xl text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
            >
              <Link2 class="w-4 h-4" />
              <span>Copy form link</span>
            </button>
            <a
              href={`/forms/${formId}/edit`}
              class="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#5C6685] hover:text-[#1B2140] transition-colors"
            >
              View form
            </a>
          </div>
        </div>

      <!-- Response list -->
      {:else}
        <div class="flex items-center gap-3 mb-6 flex-wrap">
          <div class="relative flex-1 min-w-[220px]">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#97A0BC]" strokeWidth={2.25} />
            <input
              type="text"
              bind:value={query}
              placeholder="Search responses"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECFA] bg-white text-sm text-[#1B2140] placeholder-[#97A0BC] outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
            />
          </div>
          <button
            class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E3ECFA] bg-white text-sm font-medium text-[#5C6685] hover:border-[#6C63FF] hover:text-[#1B2140] transition-all duration-200"
          >
            Newest first
            <ChevronDown class="w-3.5 h-3.5" />
          </button>
          <div class="flex items-center rounded-xl border border-[#E3ECFA] bg-white p-1 gap-0.5">
            <button class="p-1.5 rounded-lg bg-[#F5FAFF] text-[#6C63FF]" aria-label="List view">
              <Rows3 class="w-4 h-4" />
            </button>
            <button class="p-1.5 rounded-lg text-[#97A0BC] hover:text-[#5C6685]" aria-label="Grid view">
              <LayoutGrid class="w-4 h-4" />
            </button>
          </div>
        </div>

        {#if filtered.length === 0}
          <div class="text-center py-16 text-sm text-[#97A0BC]">
            No responses match &ldquo;{query}&rdquo;.
          </div>
        {:else}
          <div class="space-y-4 pb-24">
            {#each filtered as resp (resp.id)}
              {@const firstChip = resp.meta?.[0] ? chipFor(resp.meta[0].blockTypeId) : FALLBACK_CHIP}
              {@const isSelected = selected.has(resp.id)}
              {@const isStarred = starred.has(resp.id)}
              <div
                class="relative bg-white rounded-2xl border transition-all duration-200 group"
                style="border-color:{isSelected ? '#6C63FF' : '#E3ECFA'}; box-shadow:{isSelected
                  ? '0 8px 24px rgba(108,99,255,0.12)'
                  : '0 2px 10px rgba(27,33,64,0.04)'}"
              >
                <div class="absolute left-0 top-4 bottom-4 w-[3px] rounded-full {firstChip.bg}"></div>

                <div class="flex items-start gap-4 p-5 pl-7">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onchange={() => toggleSelection(resp.id)}
                    class="mt-1 w-4 h-4 rounded border-[#CBD5E8] text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer"
                    aria-label={`Select response ${resp.id}`}
                  />

                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style="background:#EFEDFF;color:#4A3FBF"
                  >
                    {initials(resp.meta)}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs font-medium text-[#97A0BC]">{formatDate(resp.created_at)}</span>
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {#if resp.timeToComplete}
                          <span class="text-[11px] font-medium text-[#97A0BC] mr-1">{resp.timeToComplete}</span>
                        {/if}
                        <button
                          onclick={() => toggleStar(resp.id)}
                          class="p-1.5 rounded-lg hover:bg-[#F5FAFF]"
                          aria-label="Star response"
                        >
                          <Star
                            class="w-3.5 h-3.5"
                            style="color:{isStarred ? '#F5A524' : '#97A0BC'}"
                            fill={isStarred ? '#F5A524' : 'none'}
                          />
                        </button>
                        <button class="p-1.5 rounded-lg hover:bg-[#F5FAFF]" aria-label="More options">
                          <MoreHorizontal class="w-3.5 h-3.5 text-[#97A0BC]" />
                        </button>
                      </div>
                    </div>

                    {#if resp.meta && resp.meta.length > 0}
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {#each resp.meta as item}
                          {@const chip = chipFor(item.blockTypeId)}
                          {@const Icon = chip.icon}
                          {@const isLong = (item.answer || '').length > 60}
                          <div
                            class="rounded-xl px-3.5 py-3 {chip.bg} {isLong ? 'sm:col-span-2' : ''}"
                          >
                            {#if item.question || item.title}
                              <div class="flex items-center gap-1.5 mb-1">
                                {#if Icon}
                                  <Icon class="w-3 h-3" style="color:{CHIP_TONE}" strokeWidth={2.5} />
                                {/if}
                                <span
                                  class="text-[10.5px] font-semibold uppercase tracking-wider"
                                  style="color:{CHIP_TONE}"
                                >
                                  {item.question || item.title}
                                </span>
                              </div>
                            {/if}
                            <p class="text-sm font-medium text-[#1B2140] break-words leading-snug">
                              {item.answer || '—'}
                            </p>
                          </div>
                        {/each}
                      </div>
                    {:else}
                      <div class="text-sm text-[#97A0BC] italic">No answers</div>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>

    <!-- Floating selection toolbar -->
    {#if selected.size > 0}
      <div
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-2 rounded-2xl shadow-[0_12px_32px_rgba(27,33,64,0.28)]"
        style="background:#1B2140"
      >
        <span class="text-sm font-semibold text-white pl-3 pr-2 flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5" style="color:#FFC94D" />
          {selected.size} selected
        </span>
        <div class="w-px h-5 bg-white/15 mx-1"></div>
        <button
          onclick={exportSelected}
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
        >
          <Download class="w-4 h-4" />
          <span>Export</span>
        </button>
        <button
          onclick={deleteSelected}
          disabled={deleting}
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#FF8A7A] hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Trash2 class="w-4 h-4" />
          <span>{deleting ? 'Deleting…' : 'Delete'}</span>
        </button>
        <div class="w-px h-5 bg-white/15 mx-1"></div>
        <button
          onclick={clearSelection}
          class="p-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Clear selection"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    {/if}
  </div>
</DefaultLayout>
