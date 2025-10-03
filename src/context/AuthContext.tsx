import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../api/apiClient";
import { jwtDecode } from "jwt-decode";
import { showLogoffToast, showSessionExpiredToast } from "@/components/toast/Toasts";
import { useNavigate } from "react-router";

interface User {
  email: string;
  role: string;
  churchId: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/Auth/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);

    const decoded = jwtDecode<any>(token);
    const userInfo = {
      email: decoded.email,
      name: decoded.unique_name,
      role: decoded.role,
      churchId: parseInt(decoded.churchId),
    };

    setUser(userInfo);
  };

  const logout = (redirect: boolean = true) => {
    localStorage.removeItem("token");
    setUser(null);
    showLogoffToast();
    if (redirect) {
      window.location.href = "/login"; // Redireciona para a página de login
    }
  };

  // Interceptor para capturar 401 e deslogar
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout(true);
          showSessionExpiredToast();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  // Carregar user se já existir token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        const userInfo = {
          email: decoded.email,
          role: decoded.role,
          name: decoded.unique_name,
          churchId: parseInt(decoded.churchId),
        };
        setUser(userInfo);
      } catch (err) {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
