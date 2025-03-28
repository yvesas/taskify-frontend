/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@/stores/authStore";
import { Credentials } from "@/types/credentials";

export class AuthService {
  private static API_BASE_URL = "http://localhost:3000/auth";

  static async login({ email, password }: Credentials) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer login");
      }

      const data = await response.json();
      useAuthStore.getState().setToken(data.access_token);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Erro de autenticação");
    }
  }

  static async register({ email, password }: Credentials) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar");
      }

      const data = await response.json();
      useAuthStore.getState().setToken(data.access_token);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Erro de registro");
    }
  }

  static logout() {
    useAuthStore.getState().clearToken();
  }
}
