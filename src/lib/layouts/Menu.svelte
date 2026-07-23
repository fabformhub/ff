<script>
  let { form, setActive } = $props();

  import Hammer from '@lucide/svelte/icons/hammer';
  import Link from '@lucide/svelte/icons/link';
  import Share2 from '@lucide/svelte/icons/share-2';
  import BarChart2 from '@lucide/svelte/icons/bar-chart-2';
  import { DashboardButton, OpenFormLinkButton, CopyLinkButton } from "$lib/ui";
  import { APP_URL } from "$lib/utils/global.js";
  import { page } from '$app/state';

  const navigationItems = [
    { icon: Hammer, label: "Build", url: `/form/${form.id}/build` },
    { icon: Link, label: "Integrate", url: `/form/${form.id}/integrate` },
    { icon: Share2, label: "Share", url: `/form/${form.id}/share` },
    { icon: BarChart2, label: "Responses", url: `/form/${form.id}/responses` }
  ];

  const isActive = (url) => page.url.pathname === url;
</script>

<div class="w-full border-b">
  <nav class="flex items-center px-5 py-3">

    <!-- Left (grows to fill available space, aligns content left) -->
    <div class="flex flex-1 items-center gap-4 justify-start">
      <DashboardButton />
      <p class="font-semibold">{form.name}</p>
    </div>

    <!-- Center (stays naturally centered because left and right flex-1 boxes match space) -->
    <div class="flex items-center gap-1">
      {#each navigationItems as { icon: Icon, label, url }}
        {@const active = isActive(url)}

        <a
          href={url}
          onclick={() => setActive?.(label)}
          class="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition
          {active
            ? 'text-orange-500 bg-orange-50'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}"
        >
          <Icon 
            size={20}
            strokeWidth={active ? 2.25 : 2}
          />

          <span class="text-xs font-medium">
            {label}
          </span>

          {#if active}
            <span class="absolute -bottom-2 h-1 w-1 rounded-full bg-orange-500"></span>
          {/if}
        </a>
      {/each}
    </div>

    <!-- Right (grows to fill available space, pushes buttons to the far edge) -->
    <div class="flex flex-1 items-center gap-2 justify-end">
      <OpenFormLinkButton url={`${APP_URL}/f/${form.slug}`} />
      <CopyLinkButton link={`${APP_URL}/f/${form.slug}`} />
    </div>

  </nav>
</div>
