<script>
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService.svelte.js';
  let email = $state('');
  let password = $state('');
  let confirm = $state('');
  let error = $state('');
  let loading = $state(false);
  let googleLoading = $state(false);
  function validate() {
    if (!email.trim()) return 'Please enter your email address.';
    if (!password.trim()) return 'Please create a password.';
    if (password.length < 6) return 'Password needs to be at least 6 characters.';
    if (password !== confirm) return 'Your passwords don\'t match.';
    return null;
  }
  async function handleSignup(e) {
    e.preventDefault();
    error = '';
    const v = validate();
    if (v) {
      error = v;
      return;
    }
    loading = true;
    try {
      const ok = await authService.createUser(email, password);
      if (!ok) {
        error = authService.state.error || 'Something went wrong. Please check your details.';
        return;
      }
      fetch('https://lbwtzoxtlssyjeututrs.supabase.co/functions/v1/send_welcome_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => {});
    /*  toast.success('Workspace created! Check your inbox for a quick confirmation link.', {
        duration: 4000
      });
    */
      setTimeout(() => goto('/login'), 1200);
    } catch (err) {
      error = err?.message || 'Signup failed. Please try again.';
    } finally {
      loading = false;
    }
  }
  async function loginGoogle() {
    googleLoading = true;
    error = '';
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      error = err?.message || 'Google authentication failed.';
      googleLoading = false;
    }
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-screen flex bg-white font-sans selection:bg-[#FFE4A8]">

  <!-- Sign Up App Side -->
  <div class="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 relative bg-[#F5FAFF]">
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute -top-[30%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/20 to-[#FFC94D]/20 blur-[120px]"></div>
    </div>

    <div class="relative w-full max-w-[420px] bg-white border border-[#E3ECFA] shadow-[0_8px_30px_rgb(27,33,64,0.06)] rounded-2xl p-8 sm:p-10">
      <!-- Pin accent, echoes the dashboard's corkboard cards -->
      <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>

      <div class="flex flex-col items-center text-center mb-8">
        <div class="flex items-center gap-2 mb-2">
          <div class="h-8 w-8 rounded-lg bg-[#FF6B4A] text-white flex items-center justify-center font-bold text-base" style="font-family: 'Bricolage Grotesque', sans-serif;">
            F
          </div>
          <span class="text-base font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">FabForm</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">Get your free account</h1>
        <p class="text-sm text-[#5C6685] mt-1">Unlimited forms. Unlimited responses. No credit card required.</p>
      </div>

      {#if error}
        <div class="mb-5 rounded-xl border border-[#F8CACA] bg-[#FEF1F1] p-3.5 flex items-start gap-2.5 text-sm text-[#B42424]">
          <span class="font-medium">{error}</span>
        </div>
      {/if}

      <!-- Quick Social Auth -->
      <button
        onclick={loginGoogle}
        disabled={googleLoading || loading}
        class="w-full flex items-center justify-center gap-3 rounded-xl border border-[#E3ECFA] bg-white px-4 py-3 text-sm font-medium text-[#1B2140] hover:bg-[#FBFDFF] hover:border-[#6C63FF] transition-all duration-150 disabled:opacity-50"
      >
        {#if googleLoading}
          <span class="text-[#97A0BC]">Connecting...</span>
        {:else}
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign up with Google</span>
        {/if}
      </button>

      <div class="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-[#97A0BC]">
        <div class="flex-1 border-t border-[#E3ECFA]"></div>
        <span>or use your email</span>
        <div class="flex-1 border-t border-[#E3ECFA]"></div>
      </div>

      <!-- Traditional Credentials -->
      <form onsubmit={handleSignup} class="space-y-3.5">
        <div>
          <input
            type="email"
            bind:value={email}
            placeholder="Email address"
            required
            class="w-full rounded-xl border border-[#E3ECFA] bg-white px-4 py-3 text-sm text-[#1B2140] placeholder-[#97A0BC] outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-150"
          />
        </div>
        <div>
          <input
            type="password"
            bind:value={password}
            placeholder="Create password (min 6 chars)"
            required
            class="w-full rounded-xl border border-[#E3ECFA] bg-white px-4 py-3 text-sm text-[#1B2140] placeholder-[#97A0BC] outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-150"
          />
        </div>
        <div>
          <input
            type="password"
            bind:value={confirm}
            placeholder="Confirm password"
            required
            class="w-full rounded-xl border border-[#E3ECFA] bg-white px-4 py-3 text-sm text-[#1B2140] placeholder-[#97A0BC] outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-150"
          />
        </div>
        <button
          type="submit"
          disabled={loading || googleLoading}
          class="w-full rounded-xl bg-[#FF6B4A] text-white py-3 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mt-1"
        >
          {loading ? 'Setting up your space...' : 'Create free account'}
        </button>
      </form>

      <p class="text-center text-sm text-[#5C6685] mt-6">
        Already using FabForm?
        <a href="/login" class="text-[#6C63FF] font-semibold hover:underline ml-0.5">Sign in</a>
      </p>
    </div>
  </div>

  <!-- Benefits Sidebar -->
  <div class="hidden lg:flex lg:w-[44%] xl:w-[40%] bg-gradient-to-br from-[#6C63FF] to-[#4B3FA8] p-12 flex-col justify-between relative text-white overflow-hidden">
    <div class="absolute -top-[20%] -right-[15%] w-[420px] h-[420px] rounded-full bg-white/10 blur-[100px] pointer-events-none"></div>

    <div class="relative">
      <span class="text-xs font-semibold text-white bg-white/15 px-2.5 py-1 rounded-md border border-white/20 uppercase tracking-wider">
        Why switch?
      </span>
      <h2 class="text-2xl font-bold tracking-tight mt-5 leading-snug" style="font-family: 'Bricolage Grotesque', sans-serif;">
        Stop losing responses to ugly forms that look like homework.
      </h2>
      <p class="text-white/75 text-sm mt-2 leading-relaxed">
        FabForm turns boring, corporate digital interrogations into clean, easy, one-question-at-a-time human conversations.
      </p>
    </div>

    <!-- Clear, Real Benefits Pitch -->
    <div class="relative space-y-5 my-6">
      <div class="flex gap-3">
        <div class="h-5 w-5 rounded-full bg-[#FFC94D] text-[#1B2140] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">✓</div>
        <div>
          <h3 class="text-sm font-semibold text-white">Unlimited everything, really</h3>
          <p class="text-xs text-white/65 mt-0.5">Build as many forms as you want and collect every single submission without hitting a monthly paywall or surprise charges.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="h-5 w-5 rounded-full bg-[#FFC94D] text-[#1B2140] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">✓</div>
        <div>
          <h3 class="text-sm font-semibold text-white">Never lose a lead halfway</h3>
          <p class="text-xs text-white/65 mt-0.5">FabForm saves progress instantly as people type. If someone closes the tab on step 3, you still keep their details in your dashboard.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="h-5 w-5 rounded-full bg-[#FFC94D] text-[#1B2140] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">✓</div>
        <div>
          <h3 class="text-sm font-semibold text-white">Smart flows & logic paths</h3>
          <p class="text-xs text-white/65 mt-0.5">Greet users by name dynamically and use intelligent branching logic to skip fields that don't apply to them. No coding required.</p>
        </div>
      </div>
    </div>

    <!-- Social Proof -->
    <div class="relative bg-white/10 border border-white/20 rounded-xl p-4.5 backdrop-blur-sm">
      <p class="text-white/90 text-xs leading-relaxed italic">
        "We swapped out Typeform for FabForm across our complete onboarding flow. Not only did we clear out thousands of dollars in monthly overage fees, but our actual user completion rates immediately scaled up by 24%."
      </p>
      <p class="text-[11px] text-white/60 mt-3 font-medium">
        — Head of Product Growth, ScaleKit
      </p>
    </div>

    <div class="relative text-[11px] text-white/55 flex justify-between border-t border-white/15 pt-4">
      <span>Join thousands of creators shipping today</span>
      <span>100% secure data hosting</span>
    </div>
  </div>
</div>
