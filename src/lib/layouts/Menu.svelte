<script>
import Hammer from '@lucide/svelte/icons/hammer';
import Link from '@lucide/svelte/icons/link';
import Share2 from '@lucide/svelte/icons/share-2';
import BarChart2 from '@lucide/svelte/icons/bar-chart-2';

import { DashboardButton, OpenFormLinkButton, CopyLinkButton } from "$lib/ui";
import { APP_URL } from "$lib/utils/global.js";
import { page } from '$app/state';

let { form, setActive } = $props();

const navigationItems = $derived(
  form
    ? [
        { icon: Hammer, label: "Build", url: `/form/build/${form.id}` },
        { icon: Link, label: "Integrate", url: `/integrate/${form.id}` },
        { icon: Share2, label: "Share", url: `/share/${form.id}` },
        { icon: BarChart2, label: "Responses", url: `/responses/${form.id}` }
      ]
    : []
);

const isActive = (url) => page.url.pathname === url;
</script>

{#if form}
<div class="w-full fixed top-0 left-0 z-50 bg-white border-b border-[#E3ECFA] shadow-[0_2px_12px_rgba(27,33,64,0.04)]">
  <nav class="w-full flex items-center justify-between px-5 py-2.5">
    <div class="flex items-center gap-4">
      <DashboardButton />
      <p
        class="font-semibold text-[#1B2140] tracking-tight"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >
        {form.name}
      </p>
    </div>

    <div class="flex items-center gap-1">
      {#each navigationItems as { icon: Icon, label, url }}
        {@const active = isActive(url)}
        <a
          href={url}
          onclick={() => setActive?.(label)}
          class="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl cursor-pointer transition-all duration-200
                 {active
                   ? 'text-[#FF6B4A] bg-[#FFF3EF]'
                   : 'text-[#5C6685] hover:text-[#1B2140] hover:bg-[#F5FAFF]'}"
        >
          <Icon size={20} strokeWidth={active ? 2.25 : 2} />
          <span class="text-[11px] font-medium">{label}</span>
          {#if active}
            <span class="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6B4A]"></span>
          {/if}
        </a>
      {/each}
    </div>

    <div class="flex items-center gap-2">
      <OpenFormLinkButton url={`${APP_URL}/f/${form.slug}`} />
      <CopyLinkButton link={`${APP_URL}/f/${form.slug}`} />
    </div>
  </nav>
</div>
{/if}
