import { useEffect } from "react";
import { useAlertStore } from "@/stores/useAlertStore";
import { toast, Toaster } from "sonner";

export const GlobalAlerts = () => {
  const { alerts, dismissAlert } = useAlertStore();

  useEffect(() => {
    alerts.forEach((alert) => {
      const toastId = toast[alert.type](alert.message, {
        id: alert.id,
        onAutoClose: () => dismissAlert(alert.id!),
      });

      if (toastId !== alert.id) {
        dismissAlert(alert.id!);
      }
    });
  }, [alerts, dismissAlert]);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "inherit",
          fontSize: "0.875rem",
        },
      }}
    />
  );
};
