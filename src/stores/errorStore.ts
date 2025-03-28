import { create } from "zustand";

interface ErrorState {
  error: {
    message: string;
    type: "error" | "warning" | "info";
  } | null;
  setError: (error: {
    message: string;
    type?: "error" | "warning" | "info";
  }) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (errorInfo) =>
    set({
      error: {
        message: errorInfo.message,
        type: errorInfo.type || "error",
      },
    }),
  clearError: () => set({ error: null }),
}));

// Usage example
// const { error, setError, clearError } = useErrorStore();
// setError({ message: "An error occurred", type: "error" });
// clearError();
// console.log(error); // { message: "An error occurred", type: "error" }
// console.log(error); // null
