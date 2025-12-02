import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../api/apiClient";
import { jwtDecode } from "jwt-decode";

interface User {
  email: string;
  role: string | string[];
  churchId: number;
  subscriptionId?: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;

  // <<< ADICIONADO
  can: (roles: string[]) => boolean;
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
    const userInfo: User = {
      email: decoded.email,
      name: decoded.unique_name,
      subscriptionId: decoded.subscriptionId,
      role: decoded.role,
      churchId: parseInt(decoded.churchId),
    };

    setUser(userInfo);
  };

  const baseLogout = (toastType: "sessionExpired" | null) => {
    localStorage.removeItem("token");
    setUser(null);

    if (toastType === "sessionExpired") {
      localStorage.setItem("toastType", "sessionExpired");
    } else {
      localStorage.removeItem("toastType");
    }

    window.location.href = "/login";
  };

  const manualLogout = () => {
    baseLogout(null);
  };

  // Interceptor 401
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (error.config?.url?.includes("/Auth/login")) {
            return Promise.reject(error);
          }

          baseLogout("sessionExpired");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  // Carregar user do token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        const userInfo: User = {
          email: decoded.email,
          role: decoded.role,
          subscriptionId: decoded.subscriptionId,
          name: decoded.unique_name,
          churchId: parseInt(decoded.churchId),
        };

        setUser(userInfo);
      } catch {
        baseLogout("sessionExpired");
      }
    }
    setIsLoading(false);
  }, []);

  // <<< ADICIONADO: função can()
  const can = (roles: string[]) => {
    if (!user) return false;
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    return userRoles.some((r) => roles.includes(r));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: manualLogout,
        isAuthenticated: !!user,
        isLoading,
        can, // <<< disponibilizado no contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pronto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
