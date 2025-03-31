/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { globalErrorHandler } from "@/utils/globalErrorHandler";
import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken, clearToken } = useAuthStore.getState();
  const navigate = useNavigate();

  const handleAuth = async (
    action: "login" | "register",
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AuthService[action]({ email, password });
      setToken(token.access_token);
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message);
      globalErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    //AuthService.logout();
    clearToken();
    navigate("/login");
  };

  return {
    login: (email: string, password: string) =>
      handleAuth("login", email, password),
    register: (email: string, password: string) =>
      handleAuth("register", email, password),
    logout,
    isLoading,
    error,
  };
};
