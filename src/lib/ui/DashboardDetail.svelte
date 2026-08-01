<script>
  import Eye from '@lucide/svelte/icons/eye';
  import DropdownButton from './DropdownButton.svelte';
  import { goto } from '$app/navigation';
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

<div class="relative max-w-[288px] rounded-[0.9rem] bg-transparent overflow-hidden">
  <!-- Pin marker -->
  <span
    class="absolute -top-[3px] left-[1.1rem] w-2.5 h-2.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10"
    style="background: var(--card-accent, #ff6b4a);"
  ></span>

  <!-- Top section -->
  <button
    type="button"
    onclick={() => goto(`/form/${form.id}/build`)}
    class="block w-full text-left px-[1.1rem] pt-[1.2rem] pb-[0.9rem] cursor-pointer bg-transparent border-none transition-colors duration-150 ease-in-out hover:bg-[var(--surface-hover,#fbfdff)]"
  >
    <h2
      class="font-[Bricolage_Grotesque,Inter,sans-serif] text-base font-semibold tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap"
      style="color: var(--text-1, #1b2140);"
    >
      {form.name}
    </h2>
    {#if form.slug}
      <p
        class="font-[Inter,sans-serif] text-[0.72rem] mt-[0.3rem] overflow-hidden text-ellipsis whitespace-nowrap"
        style="color: var(--text-3, #97a0bc);"
      >
        /{form.slug}
      </p>
    {/if}
  </button>

  <div class="h-px" style="background: var(--border, #e3ecfa);"></div>

  <!-- Bottom section -->
  <div class="flex items-center justify-between px-[1.1rem] py-[0.65rem]">
    <button
      type="button"
      onclick={() => goto(`/form/${form.id}/responses`)}
      class="font-[Inter,sans-serif] font-semibold text-[0.75rem] bg-transparent border-none cursor-pointer py-[0.2rem] transition-colors duration-150 ease-in-out hover:text-[var(--card-accent,#ff6b4a)]"
      style="color: var(--text-2, #5c6685);"
    >
      {responseCount} response{responseCount === 1 ? '' : 's'}
    </button>

    <div
      class="flex items-center gap-[0.3rem] font-[Inter,sans-serif] font-medium text-[0.75rem]"
      style="color: var(--text-3, #97a0bc);"
    >
      <Eye class="w-3.5 h-3.5" />
      <span>{formViewCount ?? 0}</span>
    </div>
  </div>

  <div class="absolute top-[0.6rem] right-[0.6rem]">
    <DropdownButton
      dropdownItems={[
        { label: 'Open Form', icon: 'OpenForm', onClick: onOpen },
        { label: 'Copy Form Link', icon: 'CopyLink', onClick: onCopy },
        { label: 'Rename Form', icon: 'Rename', onClick: onRenameForm },
        { label: 'Edit Form Link', icon: 'RenameLink', onClick: onRenameFormSlug },
        { label: 'Duplicate', icon: 'Duplicate', onClick: onDuplicate },
        { label: 'Delete Form', icon: 'Delete', onClick: onDelete },
        { label: 'Create QR Code', icon: 'QRCode', onClick: onQRCode }
      ]}
    />
  </div>
</div>
