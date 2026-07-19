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
  // INIT (CALL ON APP START)
  // --------------------------------------------------
  const init = async () => {
    if (state.initialized) return;

    state.loading = true;

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      setUser(data.session?.user || null);

      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      state.initialized = true;
    } catch (err) {
      setError(err);
    } finally {
      state.loading = false;
    }
  };

  // --------------------------------------------------
  // GOOGLE LOGIN (PKCE)
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

    const userId = data.user?.id;

    // --------------------------------------------------
    // SEND WELCOME EMAIL (EDGE FUNCTION)
    // --------------------------------------------------
    if (userId) {
      await supabase.functions.invoke("welcome-email", {
        body: { userId }
      });
    }

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
  // LOGOUT
  // --------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

const getUser = () => {
  return state.user;
};
  // --------------------------------------------------
  // GOOGLE CALLBACK HANDLED AUTOMATICALLY (NO NEED)
  // --------------------------------------------------

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
