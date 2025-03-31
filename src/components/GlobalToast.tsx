import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useErrorStore } from "@/stores/useErrorStore";

export const GlobalToast = () => {
  const { error, clearError } = useErrorStore();

  useEffect(() => {
    if (!error) return;

    const toastOptions = {
      position: "top-right" as const,
      onAutoClose: clearError,
    };

    switch (error.type) {
      case "error":
        toast.error(error.message, {
          ...toastOptions,
          duration: 4000,
        });
        break;
      case "warning":
        toast.warning(error.message, {
          ...toastOptions,
          duration: 3000,
        });
        break;
      case "info":
        toast.info(error.message, {
          ...toastOptions,
          duration: 2000,
        });
        break;
      default:
        toast(error.message, toastOptions);
    }
  }, [error, clearError]);

  return <Toaster richColors closeButton />;
};
