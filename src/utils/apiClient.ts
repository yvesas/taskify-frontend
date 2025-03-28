/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@/stores/authStore";
import { useErrorStore } from "@/stores/errorStore";
import { z } from "zod";

class ApiClient {
  private static BASE_URL = "http://localhost:3000";

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodType<T>
  ): Promise<T> {
    const token = useAuthStore.getState().getToken();
    const errorStore = useErrorStore.getState();

    const headers = new Headers(options.headers);

    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    headers.append("Content-Type", "application/json");

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        useAuthStore.getState().clearToken();
        errorStore.setError({
          message: "Sessão expirada. Faça login novamente.",
          type: "error",
        });
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição");
      }

      const data = await response.json();

      if (schema) {
        try {
          return schema.parse(data);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            errorStore.setError({
              message: "Erro de validação dos dados",
              type: "warning",
            });
            throw validationError;
          }
          throw validationError;
        }
      }

      return data;
    } catch (error) {
      errorStore.setError({
        message: error instanceof Error ? error.message : "Erro desconhecido",
        type: "error",
      });
      throw error;
    }
  }

  static get<T>(endpoint: string, schema?: z.ZodType<T>) {
    return this.request<T>(endpoint, { method: "GET" }, schema);
  }

  static post<T>(endpoint: string, body: any, schema?: z.ZodType<T>) {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      schema
    );
  }

  static patch<T>(endpoint: string, body: any, schema?: z.ZodType<T>) {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      schema
    );
  }

  static delete<T>(endpoint: string, schema?: z.ZodType<T>) {
    return this.request<T>(endpoint, { method: "DELETE" }, schema);
  }
}

export default ApiClient;
