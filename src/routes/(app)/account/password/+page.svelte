<script>
  import { authService } from '$lib/services/authService.svelte.js';

  let newPassword = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    error = '';
    success = '';
    if (!newPassword || !confirmPassword) {
      error = 'All fields are required.';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }
    loading = true;
    try {
      const ok = await authService.updatePassword(newPassword);
      if (ok) {
        success = 'Password updated successfully!';
        newPassword = '';
        confirmPassword = '';
      }
    } catch (err) {
      error = err?.message || 'Failed to update password.';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[#F5FAFF] p-4 sm:p-6 font-sans">
  <div class="relative w-full max-w-[440px] bg-white border border-[#E3ECFA] shadow-[0_8px_30px_rgb(27,33,64,0.06)] rounded-2xl p-8 sm:p-10">
    <span class="absolute -top-[5px] left-10 w-[10px] h-[10px] rounded-full bg-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></span>

    <div class="flex flex-col items-center text-center mb-8">
      <div
        class="h-11 w-11 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold tracking-tighter text-xl shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mb-4"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >
        F
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-[#1B2140]" style="font-family: 'Bricolage Grotesque', sans-serif;">
        Change your password
      </h1>
      <p class="text-sm text-[#5C6685] mt-1.5">Choose a new password for your account</p>
    </div>

    {#if error}
      <div class="mb-6 rounded-xl border border-[#F8CACA] bg-[#FEF1F1] p-3.5 flex items-start gap-3 text-sm text-[#B42424]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0 mt-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <span class="font-medium">{error}</span>
      </div>
    {/if}

    {#if success}
      <div class="mb-6 rounded-xl border border-[#B8E8CF] bg-[#EEFAF3] p-3.5 flex items-start gap-3 text-sm text-[#1D8A4F]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0 mt-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        <span class="font-medium">{success}</span>
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="relative group">
        <input
          type="password"
          id="newPassword"
          bind:value={newPassword}
          placeholder=" "
          class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-5 pb-1.5 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
        />
        <label
          for="newPassword"
          class="absolute left-4 top-3.5 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
        >
          New password
        </label>
      </div>

      <div class="relative group">
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          placeholder=" "
          class="peer w-full rounded-xl border border-[#E3ECFA] bg-white px-4 pt-5 pb-1.5 text-sm text-[#1B2140] placeholder-transparent outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all duration-200"
        />
        <label
          for="confirmPassword"
          class="absolute left-4 top-3.5 text-xs font-medium text-[#97A0BC] origin-[0] -translate-y-2 scale-95 transform transition-all duration-200 pointer-events-none
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-95 peer-focus:-translate-y-2 peer-focus:text-[#6C63FF]"
        >
          Confirm new password
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-xl bg-[#FF6B4A] text-white py-3 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 shadow-[0_4px_14px_-4px_rgba(255,107,74,0.5)] mt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B4A]"
      >
        {#if loading}
          <div class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Updating...</span>
          </div>
        {:else}
          Update password
        {/if}
      </button>
    </form>
  </div>
</div>
