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

<div class="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
  <h2 class="text-2xl font-semibold mb-4 text-gray-800">Change Password</h2>

  {#if error}
    <div class="text-sm text-red-600 bg-red-50 p-2.5 rounded border border-red-100 mb-4">{error}</div>
  {/if}
  {#if success}
    <div class="text-sm text-green-600 bg-green-50 p-2.5 rounded border border-green-100 mb-4">{success}</div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
      <input
        type="password"
        bind:value={newPassword}
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
      <input
        type="password"
        bind:value={confirmPassword}
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
        required
      />
    </div>

    <button
      type="submit"
      class="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
      disabled={loading}
    >
      {#if loading}Updating...{:else}Update Password{/if}
    </button>
  </form>
</div>
