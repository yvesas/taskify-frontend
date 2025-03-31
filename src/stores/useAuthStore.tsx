import { create } from "zustand";
import { AuthService } from "@/services/AuthService";
import { globalErrorHandler } from "@/utils/globalErrorHandler";

interface AuthStore {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem("access_token"),
  isLoading: false,
  error: null,

  setToken: (token) => {
    localStorage.setItem("access_token", token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem("access_token");
    set({ token: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await AuthService.login({ email, password });
      get().setToken(access_token);
    } catch (err) {
      set({ error: (err as Error).message });
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await AuthService.register({ email, password });
      get().setToken(access_token);
    } catch (err) {
      set({ error: (err as Error).message });
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    get().clearToken();
  },
}));

export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);

export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isAuthenticated: !!state.token,
    isLoading: state.isLoading,
    error: state.error,
  }));
