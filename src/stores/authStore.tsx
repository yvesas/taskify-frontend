import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("access_token"),
  setToken: (token) => {
    set({ token });
    localStorage.setItem("access_token", token);
  },
  clearToken: () => {
    set({ token: null });
    localStorage.removeItem("access_token");
  },
  getToken: () => localStorage.getItem("access_token"),
}));
