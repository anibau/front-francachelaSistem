import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import apiService from "@/services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Optionally verify token with backend
          // const profile = await apiService.getProfile();
          // setUser(profile);
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // In offline mode or for demo purposes, use mock authentication
      if (email === "admin@francachela.com" && password === "admin123") {
        const mockUser: User = {
          id: "1",
          name: "Administrador",
          email: "admin@francachela.com",
          role: "administrador",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const mockToken = "mock-jwt-token";
        
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }
      
      if (email === "vendedor@francachela.com" && password === "vendedor123") {
        const mockUser: User = {
          id: "2",
          name: "Vendedor",
          email: "vendedor@francachela.com",
          role: "vendedor",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const mockToken = "mock-jwt-token-vendedor";
        
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      // For real API integration
      // const response = await apiService.login(email, password);
      // localStorage.setItem("token", response.token);
      // localStorage.setItem("user", JSON.stringify(response.user));
      // setUser(response.user);
      
      throw new Error("Credenciales inválidas");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

