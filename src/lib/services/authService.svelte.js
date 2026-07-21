import { supabase } from '$lib/supabaseClient';

export const authService = (() => {
  const state = $state({
    user: null,
    loading: true,
    error: null,
    initialized: false
  });

  const setUser = (user) => {
    state.user = user;
    state.loading = false;
  };

  const setError = (err) => {
    state.error = err?.message || String(err);
    state.loading = false;
  };

  // --------------------------------------------------
  // INIT
  // --------------------------------------------------
  const init = async () => {
    if (state.initialized) return;

    state.loading = true;

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const user = data.session?.user || null;
      setUser(user);

      // Fire welcome email on FIRST session load (OAuth fix)
      if (user && !user.user_metadata?.welcome_email_sent) {
        await supabase.functions.invoke('welcome-email', {
          body: { userId: user.id }
        });

        await supabase.auth.updateUser({
          data: { welcome_email_sent: true }
        });
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user || null;
        setUser(user);

        if (!user) return;

        const alreadySent = user.user_metadata?.welcome_email_sent === true;

        if (event === 'SIGNED_IN' && !alreadySent) {
          await supabase.functions.invoke('welcome-email', {
            body: { userId: user.id }
          });

          await supabase.auth.updateUser({
            data: { welcome_email_sent: true }
          });
        }
      });

      state.initialized = true;
    } catch (err) {
      setError(err);
    } finally {
      state.loading = false;
    }
  };

  // --------------------------------------------------
  // GOOGLE LOGIN
  // --------------------------------------------------
  const loginWithGoogle = async () => {
    state.loading = true;
    state.error = null;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) setError(error);
  };

  // --------------------------------------------------
  // EMAIL LOGIN
  // --------------------------------------------------
  const loginWithEmail = async (email, password) => {
    state.loading = true;
    state.error = null;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setUser(data.session?.user || data.user || null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  // --------------------------------------------------
  // SIGNUP
  // --------------------------------------------------
  const createUser = async (email, password) => {
    state.loading = true;
    state.error = null;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      setUser(data.session?.user || null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  // --------------------------------------------------
  // LOGOUT (SUPABASE ONLY)
  // --------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

const getUser = async () => {
	if (!state.initialized) await init();
	return state.user;
};

  return {
    state,
    init,
    getUser,
    loginWithGoogle,
    loginWithEmail,
    createUser,
    logout,
    supabase
  };
})();

