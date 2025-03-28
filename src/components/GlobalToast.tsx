import React, { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useErrorStore } from "@/stores/errorStore";

export const GlobalToast: React.FC = () => {
  const { error, clearError } = useErrorStore();

  useEffect(() => {
    if (error) {
      switch (error.type) {
        case "error":
          toast.error(error.message, {
            position: "top-right",
            duration: 4000,
            onAutoClose: clearError,
          });
          break;
        case "warning":
          toast.warning(error.message, {
            position: "top-right",
            duration: 3000,
            onAutoClose: clearError,
          });
          break;
        case "info":
          toast.info(error.message, {
            position: "top-right",
            duration: 2000,
            onAutoClose: clearError,
          });
          break;
      }
    }
  }, [error, clearError]);

  return <Toaster richColors closeButton />;
};
