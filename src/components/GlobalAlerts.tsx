import { useEffect } from "react";
import { useAlertStore } from "@/stores/useAlertStore";
import { toast } from "sonner";

export const GlobalAlerts = () => {
  const { alerts, dismissAlert } = useAlertStore();

  useEffect(() => {
    alerts.forEach((alert) => {
      switch (alert.type) {
        case "error":
          toast.error(alert.message, { id: alert.id });
          break;
        case "warning":
          toast.warning(alert.message, { id: alert.id });
          break;
        case "success":
          toast.success(alert.message, { id: alert.id });
          break;
        default:
          toast.info(alert.message, { id: alert.id });
      }
      dismissAlert(alert.id!);
    });
  }, [alerts, dismissAlert]);

  return null;
};
