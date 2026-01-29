// src/auth/auth.js
import { supabase } from "../lib/supabase";

export const authApi = {
  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email, password) {
    // Si tienes confirmación por email activada, el usuario debe confirmar.
    return supabase.auth.signUp({ email, password });
  },

  async resetPassword(email, redirectTo) {
    // redirectTo debe apuntar a tu dominio /update-password
    return supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },

  async updatePassword(newPassword) {
    return supabase.auth.updateUser({ password: newPassword });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
