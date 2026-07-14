<script>
  import { onMount } from 'svelte';
  import { authService } from '$lib/services/authService.svelte.js';
  import { checkUserSubscribed } from '$lib/services/subscriptionService.js';
  import { createForm, getFormsByUserId, deleteFormById, updateForm, updateFormSlug, duplicateFormById, getFormViews, createBlock } from '$lib/services/formService.js';
  import { countResponsesByFormId } from '$lib/services/responseService.js';
  import { DashboardDetail } from '$lib/ui';
  import { Dialog, RenameDialog, RenameSlugDialog, QRCodeDialog } from '$lib/dialogs';
  import { AccountMenu } from '$lib/layouts';
  import { openDialog } from '$lib/utils/dialog.svelte.js';
  import { blockRegistry } from '$lib/utils/blockRegistry';
  import { APP_URL } from '$lib/utils/global.js';
  import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
  import { Plus, FileText } from '@lucide/svelte';
  import { formMeta } from '$lib/constants/formMeta.js';

  // ----- Reactive state (Svelte 5 runes) -----
  let forms = $state([]);
  let formResponseCounts = $state({});
  let formViewCounts = $state({});
  let userId = $state(null);
  let isUserPaid = $state(false);
  let countdown = $state("");
  let showUpgrade = $state(true);
  let loading = $state(true);
  let loadError = $state(null);
  let actionError = $state(null);
  let actionErrorTimeout;

  const offerEnd = new Date();
  offerEnd.setHours(23, 59, 59, 999);
  const price = "$99";

  const isTrial = () => !isUserPaid;
  const cardAccents = ['#FF6B4A', '#FFC94D', '#6C63FF', '#22B573'];

  // Turn raw errors (often a bare "Failed to fetch") into something a person can act on.
  function friendlyErrorMessage(err) {
    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      return "Can't reach the server. Check your connection and try again.";
    }
    return err?.message || "Something went wrong. Please try again.";
  }

  function showActionError(err, fallbackContext) {
    console.error(fallbackContext, err);
    actionError = friendlyErrorMessage(err);
    clearTimeout(actionErrorTimeout);
    actionErrorTimeout = setTimeout(() => (actionError = null), 5000);
  }

  function generateRandomUrl() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2
    });
  }

  function updateCountdown() {
    const diff = offerEnd.getTime() - Date.now();
    if (diff <= 0) {
      countdown = "Expired";
      showUpgrade = false;
      return;
    }
    const h = Math.floor(diff / 3.6e6);
    const m = Math.floor((diff % 3.6e6) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    countdown = `${h}h ${m}m ${s}s`;
  }

  function handleUpgrade() {
    window.open("https://fabform.io/pricing", "_blank");
  }

  function copyFormLink(id) {
    navigator.clipboard.writeText(APP_URL + `/f/${id}`);
  }

  function openFormLink(id) {
    window.open(`${APP_URL}/f/${id}`, "_blank");
  }

  // Fetch response + view counts for one form, never throws
  async function fetchFormStats(formId) {
    const [responseRes, viewRes] = await Promise.all([
      countResponsesByFormId(formId).catch((err) => {
        console.error(`Failed to count responses for form ${formId}`, err);
        return null;
      }),
      getFormViews(formId).catch((err) => {
        console.error(`Failed to get views for form ${formId}`, err);
        return null;
      })
    ]);
    return {
      responses: responseRes?.data?.count ?? 0,
      views: viewRes?.data?.views ?? 0
    };
  }

  async function fetchForms() {
    if (!userId) {
      console.error("fetchForms: No userId provided");
      return;
    }

    loading = true;
    loadError = null;
    try {
      const res = await getFormsByUserId(userId);
      if (!res?.success) {
        console.error("fetchForms: Failed to load forms", res?.error);
        loadError = res?.error?.message
          ? friendlyErrorMessage(new Error(res.error.message))
          : "We couldn't load your forms. Please try again.";
        forms = [];
        return;
      }

      forms = res.data?.forms ?? [];

      // Fetch all stats in parallel instead of one-by-one
      const stats = await Promise.all(
        forms.map((form) => fetchFormStats(form.id))
      );

      const newResponseCounts = {};
      const newViewCounts = {};
      forms.forEach((form, i) => {
        newResponseCounts[form.id] = stats[i].responses;
        newViewCounts[form.id] = stats[i].views;
      });
      formResponseCounts = newResponseCounts;
      formViewCounts = newViewCounts;
    } catch (err) {
      console.error("fetchForms: Unexpected error", err);
      loadError = friendlyErrorMessage(err);
      forms = [];
    } finally {
      loading = false;
    }
  }

  async function createNewForm() {
    try {
      const res = await createForm({
        name: "Untitled Form",
        user_id: userId,
        meta: formMeta
      });
      if (!res.success) {
        showActionError(res.error, "createNewForm: Failed to create form");
        return;
      }
      const formId = res.data.id;
      await createBlock(formId, blockRegistry[0]);
      await createBlock(formId, blockRegistry.at(-1));
      await fetchForms();
    } catch (err) {
      showActionError(err, "createNewForm: Unexpected error");
    }
  }

  async function renameForm(formId) {
    try {
      const result = await openDialog('Rename form', '', 'Cancel', 'Rename', RenameDialog, { name: 'Untitled' });
      if (!result?.name) return;
      await updateForm({ id: formId, name: result.name });
      await fetchForms();
    } catch (err) {
      showActionError(err, "renameForm: Unexpected error");
    }
  }

  async function renameFormSlug(formId) {
    try {
      const result = await openDialog('Rename link', '', 'Cancel', 'Rename', RenameSlugDialog, { slugName: generateRandomUrl() });
      if (!result?.slugName) return;
      await updateFormSlug(formId, result.slugName);
      await fetchForms();
    } catch (err) {
      showActionError(err, "renameFormSlug: Unexpected error");
    }
  }

  async function deleteForm(formId) {
    try {
      const ok = await openDialog('Delete form', 'This action cannot be undone.', 'Cancel', 'Delete');
      if (!ok) return;
      await deleteFormById(formId);
      await fetchForms();
    } catch (err) {
      showActionError(err, "deleteForm: Unexpected error");
    }
  }

  async function duplicateForm(formId) {
    try {
      await duplicateFormById(formId);
      await fetchForms();
    } catch (err) {
      showActionError(err, "duplicateForm: Unexpected error");
    }
  }

  onMount(() => {
    (async () => {
      try {
        await authService.getUser();
        const user = authService.state.user;
        if (!user) {
          loading = false;
          return;
        }
        userId = user.id;

        if (user.email) {
          const res = await checkUserSubscribed(user.email);
          if (res.success && res.data?.subscribed) {
            isUserPaid = true;
            showUpgrade = false;
          }
        }

        await fetchForms();
      } catch (err) {
        console.error("onMount: Unexpected error", err);
        loadError = friendlyErrorMessage(err);
        loading = false;
      }
    })();

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
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

<AccountMenu />

<div class="dash">
  <Dialog />

  <!-- ================= HEADER ================= -->
  <div class="dash-header">
    <div>
      <div class="eyebrow">
        <span class="eyebrow-mark"></span>
        Workspace — {forms.length} {forms.length === 1 ? "form" : "forms"}
      </div>
      <h1 class="dash-title">My forms</h1>
      <p class="dash-subtitle">Build and publish forms that convert</p>
    </div>
    <div class="header-actions">
      {#if !isUserPaid}
        <button onclick={handleUpgrade} class="btn btn-ghost">
          Upgrade — {price}
        </button>
      {/if}
      <button onclick={createNewForm} class="btn btn-primary">
        <Plus class="w-4 h-4" />
        New form
      </button>
    </div>
  </div>

  <!-- ================= TRIAL BAR ================= -->
  {#if isTrial()}
    <div class="ledger-bar">
      <div class="ledger-bar-left">
        <span class="pulse-dot"></span>
        <div>
          <div class="ledger-bar-title">Trial experience active</div>
          <div class="ledger-bar-sub">Everything is fully available — upgrade anytime to keep your workspace</div>
        </div>
      </div>
      <button onclick={handleUpgrade} class="countdown-chip">
        {countdown}
      </button>
    </div>
  {/if}

  <!-- ================= ACTION ERROR BANNER ================= -->
  {#if actionError}
    <div class="error-banner" role="alert">
      <span class="error-banner-text">{actionError}</span>
      <button class="error-banner-dismiss" onclick={() => (actionError = null)} aria-label="Dismiss">
        ✕
      </button>
    </div>
  {/if}

  <!-- ================= LOAD ERROR STATE ================= -->
  {#if loadError}
    <div class="state-block">
      <svg class="empty-glyph error-glyph" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="22" stroke="currentColor" stroke-width="1.5" />
        <path d="M32 22v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="32" cy="42" r="1.5" fill="currentColor" />
      </svg>
      <h2 class="state-title">Couldn't load your forms</h2>
      <p class="state-caption">{loadError}</p>
      <button onclick={fetchForms} class="btn btn-primary state-cta">
        Try again
      </button>
    </div>

  <!-- ================= LOADING STATE ================= -->
  {:else if loading}
    <div class="state-block">
      <div class="loading-mark"></div>
      <p class="state-caption">Loading your forms…</p>
    </div>

  <!-- ================= EMPTY STATE ================= -->
  {:else if forms.length === 0}
    <div class="state-block">
      <svg class="empty-glyph" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="12" width="32" height="42" rx="3" fill="#FFFFFF" stroke="#E3ECFA" stroke-width="1.5" transform="rotate(-4 32 33)" />
        <path d="M24 26h16M24 33h16M24 40h9" stroke="#97A0BC" stroke-width="1.5" stroke-linecap="round" transform="rotate(-4 32 33)" />
        <circle cx="46" cy="16" r="6" fill="#FF6B4A" />
      </svg>
      <h2 class="state-title">Your workspace is ready</h2>
      <p class="state-caption">
        {isTrial()
          ? "Start building your first form. Everything is unlocked in this experience."
          : "Create your first form to get started."}
      </p>
      <button onclick={createNewForm} class="btn btn-primary state-cta">
        Create your first form
      </button>
    </div>

  <!-- ================= GRID ================= -->
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each forms as form, i (form.id)}
        <div class="form-frame" style="--card-accent: {cardAccents[i % cardAccents.length]}">
          <DashboardDetail
            {form}
            responseCount={formResponseCounts[form.id]}
            formViewCount={formViewCounts[form.id]}
            onOpen={() => openFormLink(form.id)}
            onCopy={() => copyFormLink(form.id)}
            onRenameForm={() => renameForm(form.id)}
            onRenameFormSlug={() => renameFormSlug(form.id)}
            onDuplicate={() => duplicateForm(form.id)}
            onDelete={() => deleteForm(form.id)}
            onQRCode={() =>
              openDialog('QR Code', '', 'Close', null, QRCodeDialog, {
                text: APP_URL + `/f/${form.slug || form.id}`
              })
            }
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- ================= FLOATING CONVERSION CTA ================= -->
{#if isTrial() && showUpgrade}
  <div onclick={handleUpgrade} class="float-cta" role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && handleUpgrade()}>
    <div class="float-cta-seal">★</div>
    <div>
      <div class="float-cta-title">Unlock lifetime access — {price}</div>
      <div class="float-cta-sub">Keep everything you build — no subscription</div>
      <div class="float-cta-time">Ends in {countdown}</div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    background: #f5faff;
  }

  .dash {
    --bg: #f5faff;
    --surface: #ffffff;
    --surface-hover: #fbfdff;
    --border: #e3ecfa;
    --border-strong: #cddcf2;
    --text-1: #1b2140;
    --text-2: #5c6685;
    --text-3: #97a0bc;
    --coral: #ff6b4a;
    --yellow: #ffc94d;
    --periwinkle: #6c63ff;
    --success: #22b573;
    --danger: #d93636;

    min-height: 100vh;
    background-color: var(--bg);
    background-image: radial-gradient(circle at 12% 8%, rgba(255, 107, 74, 0.08), transparent 40%),
      radial-gradient(circle at 92% 0%, rgba(108, 99, 255, 0.08), transparent 38%);
    color: var(--text-1);
    font-family: 'Inter', system-ui, sans-serif;
    padding: 3rem 2.5rem;
  }

  /* ---------- Header ---------- */
  .dash-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2.5rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--periwinkle);
    margin-bottom: 0.75rem;
  }

  .eyebrow-mark {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--coral);
    display: inline-block;
  }

  .dash-title {
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 2.75rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--text-1);
  }

  .dash-subtitle {
    font-size: 0.95rem;
    color: var(--text-2);
    margin-top: 0.65rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  /* ---------- Buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.15rem;
    border-radius: 0.7rem;
    font-size: 0.87rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    border: 1px solid transparent;
  }

  .btn-ghost {
    background: #ffffff;
    border-color: var(--border-strong);
    color: var(--text-2);
  }
  .btn-ghost:hover {
    border-color: var(--periwinkle);
    color: var(--periwinkle);
  }

  .btn-primary {
    background: var(--coral);
    color: #ffffff;
    box-shadow: 0 4px 14px -4px rgba(255, 107, 74, 0.55);
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 24px -8px rgba(255, 107, 74, 0.6);
  }

  /* ---------- Trial bar ---------- */
  .ledger-bar {
    margin-bottom: 1.75rem;
    padding: 0.9rem 1.25rem;
    border-radius: 0.9rem;
    background: #fff8e8;
    border: 1px solid #ffe4a8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ledger-bar-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--yellow);
    flex-shrink: 0;
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 201, 77, 0.5); }
    50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(255, 201, 77, 0); }
  }

  .ledger-bar-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-1);
  }

  .ledger-bar-sub {
    font-size: 0.75rem;
    color: var(--text-2);
    margin-top: 0.15rem;
  }

  .countdown-chip {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.78rem;
    color: var(--text-1);
    background: #ffffff;
    border: 1px solid #ffe4a8;
    padding: 0.5rem 0.9rem;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }
  .countdown-chip:hover {
    border-color: var(--coral);
  }

  /* ---------- Action error banner ---------- */
  .error-banner {
    margin-bottom: 1.75rem;
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
    flex-shrink: 0;
  }
  .error-banner-dismiss:hover {
    opacity: 1;
  }

  .error-glyph {
    color: var(--danger);
    animation: none;
  }

  /* ---------- Loading / empty states ---------- */
  .state-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 7rem 1rem;
  }

  .loading-mark {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 3px solid var(--border-strong);
    border-top-color: var(--coral);
    animation: spin 0.8s linear infinite;
    margin-bottom: 1.25rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-glyph {
    width: 64px;
    height: 64px;
    margin-bottom: 1.5rem;
    animation: breathe 5s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { transform: rotate(-4deg) scale(1); }
    50% { transform: rotate(-2deg) scale(1.04); }
  }

  .state-title {
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--text-1);
  }

  .state-caption {
    font-size: 0.88rem;
    color: var(--text-2);
    max-width: 26rem;
    margin-top: 0.5rem;
  }

  .state-cta {
    margin-top: 1.75rem;
  }

  /* ---------- Form card frame ---------- */
  .form-frame {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 4px solid var(--card-accent, var(--coral));
    border-radius: 1rem;
    box-shadow: 0 2px 8px -4px rgba(27, 33, 64, 0.08);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .form-frame:hover {
    transform: translateY(-4px) rotate(-0.4deg);
    box-shadow: 0 18px 30px -14px rgba(27, 33, 64, 0.18);
  }

  /* ---------- Floating CTA ---------- */
  .float-cta {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    max-width: 19rem;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 1rem;
    border-radius: 1rem;
    background: #ffffff;
    border: 1px solid var(--border-strong);
    box-shadow: 0 16px 34px -14px rgba(27, 33, 64, 0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .float-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -14px rgba(255, 107, 74, 0.3);
  }

  .float-cta-seal {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: var(--coral);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
  }

  .float-cta-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-1);
  }

  .float-cta-sub {
    font-size: 0.75rem;
    color: var(--text-2);
    margin-top: 0.2rem;
  }

  .float-cta-time {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.72rem;
    color: var(--periwinkle);
    margin-top: 0.5rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse-dot, .empty-glyph, .loading-mark {
      animation: none;
    }
  }
</style>
