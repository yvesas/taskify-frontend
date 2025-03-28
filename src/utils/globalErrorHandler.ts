import { z } from "zod";
import { useErrorStore } from "@/stores/errorStore";
import { useAuthStore } from "@/stores/authStore";

export const globalErrorHandler = (error: unknown) => {
  const errorStore = useErrorStore.getState();
  const authStore = useAuthStore.getState();

  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((err) => err.message).join(", ");
    errorStore.setError({
      message: `Erro de validação: ${formattedErrors}`,
      type: "warning",
    });
    return;
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "Unauthorized":
        authStore.clearToken();
        errorStore.setError({
          message: "Sessão expirada. Faça login novamente.",
          type: "error",
        });
        break;
      case "Network Error":
        errorStore.setError({
          message: "Erro de conexão. Verifique sua internet.",
          type: "error",
        });
        break;
      default:
        errorStore.setError({
          message: error.message || "Erro desconhecido",
          type: "error",
        });
    }
  }
};
