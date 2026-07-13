<script>
  import { authService } from '$lib/services/authService.svelte.js';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);
  let googleLoading = $state(false);
  import { goto } from '$app/navigation';

  function validate() {
    if (!email.trim()) return 'Email is required';
    if (!password.trim()) return 'Password is required';
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    const v = validate();
    if (v) {
      error = v;
      return;
    }
    loading = true;
    try {
      const ok = await authService.loginWithEmail(email, password);
      if (!ok) {
        error = authService.state.error || 'Invalid credentials';
        return;
      }
      goto('/dashboard');
    } catch (err) {
      error = err?.message || 'Login failed';
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
      error = err?.message || 'Google login failed';
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

<div class="min-h-screen flex items-center justify-center bg-[#F5FAFF] p-4 sm:p-6 font-sans selection:bg-[#FFE4A8]">
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div class="absolute -top-[35%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF6B4A]/20 to-[#FFC94D]/20 blur-[120px]"></div>
    <div class="absolute -bottom-[35%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6C63FF]/15 to-[#22B573]/10 blur-[120px]"></div>
  </div>

  <div class="relative w-full max-w-[440px] bg-white border border-[#E3ECFA] shadow-[0_8px_30px_rgb(27,33,64,0.06)] rounded-2xl p-8 sm:p-10 transition-all duration-300">
    <!-- Pin accent, echoes the dashboard's corkboard cards -->
    <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>

    <div class="flex flex-col items-center text-center mb-8">
      <div class="h-11 w-11 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold tracking-tighter text-xl shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mb-4" style="font-family: 'Bricolage Grotesque', sans-serif;">
        F
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
        Welcome back to Fabform
      </h1>
      <p class="text-sm text-[#5C6685] mt-1.5">Enter your credentials to access your workspace</p>
    </div>

    {#if error}
      <div class="mb-6 rounded-xl border border-[#F8CACA] bg-[#FEF1F1] p-3.5 flex items-start gap-3 text-sm text-[#B42424] animate-in fade-in duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0 mt-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <span class="font-medium">{error}</span>
      </div>
    {/if}

    <button
      onclick={loginGoogle}
      disabled={googleLoading || loading}
      class="w-full flex items-center justify-center gap-3 rounded-xl border border-[#E3ECFA] bg-white px-4 py-3 text-sm font-medium text-[#1B2140] hover:bg-[#FBFDFF] hover:border-[#6C63FF] active:bg-[#F5FAFF] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
    >
      {#if googleLoading}
        <svg class="animate-spin h-4 w-4 text-[#5C6685]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Connecting to Google...</span>
      {:else}
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Continue with Google</span>
      {/if}
    </button>

    <div class="my-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#97A0BC]">
      <div class="flex-1 border-t border-[#E3ECFA]"></div>
      <span>or continue with email</span>
      <div class="flex-1 border-t border-[#E3ECFA]"></div>
    </div>

    <form onsubmit={handleLogin} class="space-y-4">
      <div class="relative group">
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder=" "
          required
          class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-5 pb-1.5 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
        />
        <label
          for="email"
          class="absolute left-4 top-3.5 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
        >
          Email address
        </label>
      </div>

      <div class="relative group">
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder=" "
          required
          class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-5 pb-1.5 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
        />
        <label
          for="password"
          class="absolute left-4 top-3.5 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
        >
          Password
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || googleLoading}
        class="w-full rounded-xl bg-[#FF6B4A] text-white py-3 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
      >
        {#if loading}
          <div class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          </div>
        {:else}
          Sign in
        {/if}
      </button>
    </form>

    <p class="text-center text-sm text-[#5C6685] mt-8">
      New to Fabform?
      <a href="/signup" class="text-[#6C63FF] font-semibold hover:underline inline-flex items-center gap-0.5 ml-1">
        Create an account
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </p>
  </div>
</div>
