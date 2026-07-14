<script>
  import { authService } from '$lib/services/authService.svelte.js';
  import { clickOutside } from '$lib/utils/clickOutside.js';
  import { APP_URL } from '$lib/utils/global.js';
  import Key from '@lucide/svelte/icons/key';
  import LogOut from '@lucide/svelte/icons/log-out';
  import LogIn from '@lucide/svelte/icons/log-in';
  import User from '@lucide/svelte/icons/user';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import logo from '$lib/logo.png';
  import { goto } from '$app/navigation';
  import { fly } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  const { state: userState, logout } = authService;
  let showMenu = $state(false);

  const initial = $derived(userState.user?.email?.[0]?.toUpperCase() ?? '');
  const emailName = $derived(userState.user?.email?.split('@')[0] ?? '');

  const handleLogout = async () => {
    showMenu = false;
    await logout();
    goto('/login');
  };

  const toggleMenu = () => (showMenu = !showMenu);

  // Stops the trigger's mousedown from reaching clickOutside's document
  // listener, so a click on the trigger while open only ever runs
  // toggleMenu once, instead of clickOutside closing it and toggleMenu
  // immediately reopening it.
  const guardTrigger = (e) => e.stopPropagation();
</script>

<nav class="bg-white/80 backdrop-blur-xl border-b border-[#E3ECFA] px-6 py-3.5 font-sans sticky top-0 z-40">
  <div class="flex justify-between items-center">
    <a href="/" class="flex items-center">
      <img src="{logo}" alt="Fabform Logo" class="h-8 w-auto hover:opacity-80 transition" />
    </a>

    <div class="relative">
      <button
        onmousedown={guardTrigger}
        onclick={toggleMenu}
        class="flex items-center gap-2 pl-1.5 pr-3 h-10 rounded-full border transition-all duration-200 active:scale-95
               {showMenu
                 ? 'bg-[#F6F5FF] border-[#6C63FF]/40 ring-4 ring-[#6C63FF]/[0.08]'
                 : 'bg-white border-[#E3ECFA] hover:border-[#6C63FF]/30 hover:-translate-y-px shadow-sm hover:shadow-[0_6px_16px_-6px_rgba(108,99,255,0.22)]'}"
        aria-label="Account menu"
        aria-expanded={showMenu}
      >
        {#if userState.user}
          <span
            class="h-[30px] w-[30px] rounded-full bg-gradient-to-br from-[#7A72FF] via-[#6C63FF] to-[#5B52EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_8px_-2px_rgba(108,99,255,0.45)] flex items-center justify-center text-white text-[12.5px] font-semibold"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            {initial}
          </span>
        {:else}
          <span class="h-[30px] w-[30px] rounded-full bg-[#F5FAFF] border border-[#E3ECFA] text-[#5C6685] flex items-center justify-center">
            <User class="w-4 h-4" />
          </span>
        {/if}
        <ChevronDown class="w-3.5 h-3.5 text-[#97A0BC] transition-transform duration-200 {showMenu ? 'rotate-180 !text-[#6C63FF]' : ''}" />
      </button>

      {#if showMenu}
        <div
          use:clickOutside={() => (showMenu = false)}
          in:fly={{ y: -8, duration: 300, easing: backOut }}
          out:fly={{ y: -4, duration: 120 }}
          class="absolute right-0 mt-3 w-[280px] z-50 bg-white/97 backdrop-blur-xl border border-[#E3ECFA] rounded-2xl shadow-[0_4px_10px_-2px_rgba(108,99,255,0.08),0_20px_40px_-10px_rgba(27,33,64,0.14)] overflow-hidden"
        >
          {#if userState.user}
            <div class="flex items-center gap-3 px-4 pt-4 pb-3.5 bg-gradient-to-br from-[#6C63FF]/[0.06] to-transparent">
              <span
                class="h-11 w-11 rounded-full bg-gradient-to-br from-[#7A72FF] via-[#6C63FF] to-[#5B52EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_8px_-2px_rgba(108,99,255,0.45)] flex items-center justify-center text-white text-[16px] font-semibold shrink-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {initial}
              </span>
              <div class="min-w-0">
                <p class="text-[13.5px] font-semibold text-[#1B2140] truncate capitalize" style="font-family: 'Bricolage Grotesque', sans-serif;">
                  {emailName}
                </p>
                <p class="text-[12px] text-[#97A0BC] truncate">{userState.user.email}</p>
              </div>
            </div>

            <div class="mx-4 h-px bg-[#E3ECFA]"></div>

            <div class="p-1.5">
              <a
                href="/account/password"
                class="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#1B2140] hover:bg-[#F5FAFF] transition-colors duration-150"
                onclick={() => (showMenu = false)}
              >
                <span class="h-7 w-7 rounded-lg bg-[#EEECFF] text-[#6C63FF] flex items-center justify-center shrink-0">
                  <Key class="w-[15px] h-[15px]" />
                </span>
                Change Password
              </a>
            </div>

            <div class="mx-4 h-px bg-[#E3ECFA]"></div>

            <div class="p-1.5">
              <button
                onclick={handleLogout}
                class="flex w-full text-left items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#B42424] hover:bg-[#FEF1F1] transition-colors duration-150"
              >
                <span class="h-7 w-7 rounded-lg bg-[#FFF3EF] text-[#FF6B4A] flex items-center justify-center shrink-0">
                  <LogOut class="w-[15px] h-[15px]" />
                </span>
                Logout
              </button>
            </div>
          {:else}
            <div class="p-1.5">
              <a
                href="/login"
                class="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#1B2140] hover:bg-[#F5FAFF] transition-colors duration-150"
                onclick={() => (showMenu = false)}
              >
                <span class="h-7 w-7 rounded-lg bg-[#EEECFF] text-[#6C63FF] flex items-center justify-center shrink-0">
                  <LogIn class="w-[15px] h-[15px]" />
                </span>
                Login
              </a>
              <a
                href="/signup"
                class="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#1B2140] hover:bg-[#F5FAFF] transition-colors duration-150"
                onclick={() => (showMenu = false)}
              >
                <span class="h-7 w-7 rounded-lg bg-[#FFF3EF] text-[#FF6B4A] flex items-center justify-center shrink-0">
                  <User class="w-[15px] h-[15px]" />
                </span>
                Signup
              </a>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</nav>
