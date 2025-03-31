import { z } from "zod";
import { useAlertStore } from "@/stores/useAlertStore";
import { useAuthStore } from "@/stores/useAuthStore";

type CustomError = Error & {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

export const globalAlertHandler = (error: unknown) => {
  const { showAlert } = useAlertStore.getState();
  const { clearToken } = useAuthStore.getState();

  console.error("[globalAlertHandler]:", error);

  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((err) => err.message).join(", ");
    showAlert(`Erro de validação: ${formattedErrors}`, "warning");
    return;
  }

  const err = error as CustomError;
  const message =
    err.response?.data?.message || err.message || "Erro desconhecido";

  switch (err.message) {
    case "Unauthorized":
    case "Token expired":
      clearToken();
      showAlert("Sessão expirada. Faça login novamente.", "error");
      break;
    case "Network Error":
      showAlert("Erro de conexão. Verifique sua internet.", "error");
      break;
    default:
      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
            clearToken();
            showAlert("Acesso não autorizado", "error");
            break;
          case 403:
            showAlert("Você não tem permissão para esta ação", "warning");
            break;
          case 404:
            showAlert("Recurso não encontrado", "warning");
            break;
          case 500:
            showAlert("Erro interno no servidor", "error");
            break;
          default:
            showAlert(message, "error");
        }
      } else {
        showAlert(message, "error");
      }
  }
};
