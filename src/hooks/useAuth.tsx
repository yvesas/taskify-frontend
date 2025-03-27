import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken, clearToken } = useAuthStore();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        navigate("/tasks");
      } else {
        setError(data.message || "Erro ao fazer login.");
      }
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        navigate("/tasks");
      } else {
        setError(data.message || "Erro ao registrar.");
      }
    } catch (error: any) {
      setError(error.message || "Erro ao registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return { login, register, logout, isLoading, error };
};
