<script>
  import Hammer from '@lucide/svelte/icons/hammer';
  import Link from '@lucide/svelte/icons/link';
  import Share2 from '@lucide/svelte/icons/share-2';
  import BarChart2 from '@lucide/svelte/icons/bar-chart-2';

  import { DashboardButton } from "$lib/ui";
  import { page } from '$app/state';

  let { formId, setActive } = $props();

  const navigationItems = [
    { icon: Hammer, label: "Build", url: `/form/build/${formId}` },
    { icon: Link, label: "Integrate", url: `/integrate/${formId}` },
    { icon: Share2, label: "Share", url: `/share/${formId}` },
    { icon: BarChart2, label: "Responses", url: `/responses/${formId}` }
  ];

  const isActive = (url) => page.url.pathname === url;
</script>

<div class="w-full border-b">
  <nav class="relative flex items-center px-5 py-3">

    <!-- Left -->
    <div class="flex items-center gap-4">
      <DashboardButton />

      <p class="font-semibold tracking-tight">
        FabForm
      </p>
    </div>


    <!-- Center Navigation -->
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">

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


  </nav>
</div>
