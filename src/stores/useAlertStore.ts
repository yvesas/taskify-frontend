import { create } from "zustand";

type AlertType = "error" | "warning" | "info" | "success";

interface Alert {
  message: string;
  type: AlertType;
  id?: string;
}

interface AlertState {
  alerts: Alert[];
  showAlert: (message: string, type?: AlertType, timeout?: number) => void;
  dismissAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  showAlert: (message, type = "info", timeout = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { message, type, id };

    set((state) => ({ alerts: [...state.alerts, newAlert] }));

    if (timeout > 0) {
      setTimeout(() => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        }));
      }, timeout);
    }
  },
  dismissAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }));
  },
}));
