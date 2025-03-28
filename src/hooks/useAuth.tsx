/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (
    action: "login" | "register",
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService[action]({ email, password });
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
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
