<script>
  import Eye from '@lucide/svelte/icons/eye';
  import DropdownButton from './DropdownButton.svelte';
  import { navigate } from '$lib/routes.js';

  let {
    form,
    responseCount = 0,
    formViewCount = 0,
    onOpen,
    onCopy,
    onRenameForm,
    onRenameFormSlug,
    onDuplicate,
    onDelete,
    onQRCode
  } = $props();
</script>

<div class="card">
  <span class="pin"></span>

  <!-- Top section -->
  <button
    type="button"
    onclick={() => navigate('/form/build/' + form.id)}
    class="card-top"
  >
    <h2 class="card-title">{form.name}</h2>
    {#if form.slug}
      <p class="card-slug">/{form.slug}</p>
    {/if}
  </button>

  <div class="card-divider"></div>

  <!-- Bottom section -->
  <div class="card-bottom">
    <button
      type="button"
      onclick={() => navigate('/responses/' + form.id)}
      class="responses-link"
    >
      {responseCount} response{responseCount === 1 ? '' : 's'}
    </button>

    <div class="views">
      <Eye class="w-3.5 h-3.5" />
      <span>{formViewCount ?? 0}</span>
    </div>
  </div>

  <div class="card-menu">
    <DropdownButton
      dropdownItems={[
        { label: 'Open Form', icon: 'OpenForm', onClick: onOpen },
        { label: 'Copy Form Link', icon: 'CopyLink', onClick: onCopy },
        { label: 'Rename Form', icon: 'Rename', onClick: onRenameForm },
        { label: 'Customize Form Link', icon: 'RenameLink', onClick: onRenameFormSlug },
        { label: 'Duplicate', icon: 'Duplicate', onClick: onDuplicate },
        { label: 'Delete Form', icon: 'Delete', onClick: onDelete },
        { label: 'Create QR Code', icon: 'QRCode', onClick: onQRCode }
      ]}
    />
  </div>
</div>

<style>
  .card {
    position: relative;
    max-width: 288px;
    border-radius: 0.9rem;
    background: transparent;
    overflow: hidden;
  }

  /* Small colored pin marker, ties to the card's accent color set by the parent grid */
  .pin {
    position: absolute;
    top: -3px;
    left: 1.1rem;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--card-accent, #ff6b4a);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  /* ---------- Top ---------- */
  .card-top {
    display: block;
    width: 100%;
    text-align: left;
    padding: 1.2rem 1.1rem 0.9rem;
    cursor: pointer;
    background: transparent;
    border: none;
    transition: background 0.15s ease;
  }
  .card-top:hover {
    background: var(--surface-hover, #fbfdff);
  }

  .card-title {
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-1, #1b2140);
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-slug {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    color: var(--text-3, #97a0bc);
    margin-top: 0.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ---------- Divider ---------- */
  .card-divider {
    height: 1px;
    background: var(--border, #e3ecfa);
  }

  /* ---------- Bottom ---------- */
  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 1.1rem;
  }

  .responses-link {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.75rem;
    color: var(--text-2, #5c6685);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0;
    transition: color 0.15s ease;
  }
  .responses-link:hover {
    color: var(--card-accent, #ff6b4a);
  }

  .views {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 0.75rem;
    color: var(--text-3, #97a0bc);
  }

  /* ---------- Dropdown menu ---------- */
  .card-menu {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
  }
</style>
