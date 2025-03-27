import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    set({ token });
    localStorage.setItem("token", token);
  },
  clearToken: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));
