import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiClient from "../api/apiClient";
import { setRuntimeBranch } from "@/api/authRuntime";
import { jwtDecode } from "jwt-decode";

/* ============================
   Tipagens
============================ */

interface User {
  email: string;
  role: string | string[];
  churchId: number;
  branchId: number; // CONTROLADO FORA DO TOKEN
  subscriptionId?: string;
  totalLocations?: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  can: (roles: string[]) => boolean;
  setBranch: (branchId: number) => void;
}

/* ============================
   Context
============================ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ============================
   Provider
============================ */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ============================
     Login
  ============================ */

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/Auth/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);

    // RESET explícito da filial
    localStorage.setItem("activeBranchId", "0");

    const decoded = jwtDecode<any>(token);

    const userInfo: User = {
      email: decoded.email,
      name: decoded.unique_name,
      role: decoded.role,
      churchId: Number(decoded.churchId),
      branchId: 0, // SEM TOKEN
      totalLocations: Number(decoded.totalLocations),
      subscriptionId: decoded.subscriptionId,
    };

    setRuntimeBranch(0);
    setUser(userInfo);
  };

  /* ============================
     Logout
  ============================ */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeBranchId");
    setUser(null);
    window.location.href = "/login";
  };

  /* ============================
     Setar filial ativa
  ============================ */

  const setBranch = (branchId: number) => {
    if (!Number.isFinite(branchId)) return;

    localStorage.setItem("activeBranchId", String(branchId));
    setRuntimeBranch(branchId);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            branchId,
          }
        : prev
    );
  };

  /* ============================
     Interceptor 401
  ============================ */

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  /* ============================
     Rehidratar sessão
  ============================ */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedBranchId = Number(localStorage.getItem("activeBranchId") ?? 0);

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<any>(token);

      const branchId =
        Number.isFinite(storedBranchId) && storedBranchId > 0
          ? storedBranchId
          : 0;

      const userInfo: User = {
        email: decoded.email,
        name: decoded.unique_name,
        role: decoded.role,
        churchId: Number(decoded.churchId),
        branchId,
        totalLocations: Number(decoded.totalLocations),
        subscriptionId: decoded.subscriptionId,
      };

      setRuntimeBranch(branchId);
      setUser(userInfo);
    } catch {
      logout();
    }

    setIsLoading(false);
  }, []);

  /* ============================
     Permissões
  ============================ */

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
        logout,
        isAuthenticated: !!user,
        isLoading,
        can,
        setBranch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ============================
   Hook
============================ */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
