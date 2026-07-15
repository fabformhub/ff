<script>
  import { onMount } from 'svelte';
  import { authService } from '$lib/services/authService.svelte.js';
  import { checkUserSubscribed } from '$lib/services/subscriptionService.js';

  let userPaid = $state(false);
  let userEmail = $state(null);
  let loadingAccess = $state(true);
  let connectingId = $state(null);

  const integrations = [
    { id: 'slack', name: 'Slack', description: 'Send form responses straight to any Slack channel.', logo: 'S', accent: '#4A154B' },
    { id: 'google-sheets', name: 'Google Sheets', description: 'Log every submission to a live spreadsheet.', logo: 'G', accent: '#0F9D58' },
    { id: 'zapier', name: 'Zapier', description: 'Connect to 5,000+ apps through Zapier.', logo: 'Z', accent: '#FF4A00' },
    { id: 'mailchimp', name: 'Mailchimp', description: 'Sync new respondents to your audience automatically.', logo: 'M', accent: '#FFE01B' },
    { id: 'webhook', name: 'Webhooks', description: 'Fire real-time POST requests on new submissions.', logo: 'W', accent: '#6C63FF' },
    { id: 'notion', name: 'Notion', description: 'Create a Notion page for every response you get.', logo: 'N', accent: '#1B2140' },
  ];

  async function connect(integration) {
    if (!userPaid) return;
    connectingId = integration.id;
    try {
      // Placeholder for the real OAuth / connection flow.
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      connectingId = null;
    }
  }

  onMount(async () => {
    try {
      if (!authService.state.user) {
        await authService.getUser();
      }
      const user = authService.state.user;
      if (user) {
        userEmail = user.email;
        const res = await checkUserSubscribed(userEmail);
        userPaid = Boolean(res.success && res.data?.subscribed);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      loadingAccess = false;
    }
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

<div class="relative min-h-screen bg-[#F5FAFF] p-6 sm:p-10 font-sans overflow-hidden">
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div class="absolute -top-[25%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/15 to-[#FFC94D]/15 blur-[120px]"></div>
    <div class="absolute -bottom-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/12 to-[#22B573]/10 blur-[120px]"></div>
  </div>

  <div class="relative max-w-6xl mx-auto">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div class="flex items-center gap-4">
        <div
          class="h-11 w-11 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold tracking-tighter text-xl shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          F
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
            Integrations
          </h1>
          <p class="text-sm text-[#5C6685] mt-1">
            {#if loadingAccess}
              Checking your plan…
            {:else if userPaid}
              Connect Fabform to the tools your team already uses.
            {:else}
              Available on paid plans — connect Slack, Sheets, Zapier and more.
            {/if}
          </p>
        </div>
      </div>
      {#if !loadingAccess && !userPaid}
        
      <a href="https://fabform.io/pricing/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-xl bg-[#FF6B4A] text-white px-5 py-2.5 text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
        >
          Upgrade
        </a>
      {/if}
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each integrations as integration (integration.id)}
        <article class="relative bg-white border border-[#E3ECFA] rounded-2xl p-6 shadow-[0_8px_30px_rgb(27,33,64,0.06)] hover:shadow-[0_12px_36px_rgb(27,33,64,0.09)] hover:-translate-y-0.5 transition-all duration-200">
          <div class="flex items-start gap-4">
            <div
              class="h-12 w-12 shrink-0 rounded-xl border border-[#E3ECFA] flex items-center justify-center text-lg font-bold text-white"
              style="font-family: 'Bricolage Grotesque', sans-serif; background-color: {integration.accent};"
            >
              {integration.logo}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-base font-semibold text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
                  {integration.name}
                </h3>
                {#if !userPaid}
                  <span class="shrink-0 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full bg-[#FFF3E6] text-[#FF6B4A] border border-[#FFE0C7]">
                    Paid
                  </span>
                {/if}
              </div>
              <p class="text-sm text-[#5C6685] mt-1.5 leading-relaxed">{integration.description}</p>
              <div class="mt-4">
                {#if userPaid}
                  <button
                    type="button"
                    onclick={() => connect(integration)}
                    disabled={connectingId === integration.id}
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B2140] text-white text-sm font-semibold hover:bg-[#6C63FF] active:bg-[#5b53e6] transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
                  >
                    {#if connectingId === integration.id}
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting…
                    {:else}
                      Connect
                    {/if}
                  </button>
                {:else}
                  
                   <a  href="https://fabform.io/pricing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#F5FAFF] text-[#1B2140] text-sm font-semibold border border-[#E3ECFA] hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
                  >
                    Unlock on Pro
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </section>

    {#if !loadingAccess && !userPaid}
      <footer class="mt-12 relative bg-white border border-[#E3ECFA] rounded-2xl p-8 shadow-[0_8px_30px_rgb(27,33,64,0.06)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>
        <div>
          <h4 class="text-xl font-bold text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
            Integrations are part of Pro
          </h4>
          <p class="text-sm text-[#5C6685] mt-1.5 max-w-md">
            Connect to Slack, Sheets, Zapier and more. Upgrade to unlock live integrations and automated workflows.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="text-2xl font-bold text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">$99</div>
            <div class="text-xs font-medium text-[#97A0BC] uppercase tracking-wide">lifetime deal</div>
          </div>
          
            <a href="https://fabform.io/pricing/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl bg-[#FF6B4A] text-white px-5 py-3 text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
          >
            Upgrade now
          </a>
        </div>
      </footer>
    {/if}
  </div>
</div>
