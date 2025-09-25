import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Credentials {
  email: string;
  senha: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  signIn: (credentials: Credentials) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("@App:token");
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const signIn = async ({ email, senha }: Credentials) => {
    try {
      const response = await api.put("/Auth/login", {
        email,
        senha,
      });

      const jwtToken = response.data.dados.token;

      if (jwtToken) {
        setToken(jwtToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
        localStorage.setItem("@App:token", jwtToken);
        navigate("/chamados");
      } else {
        alert("Login bem-sucedido, mas o token não foi fornecido.");
      }
    } catch (error) {
      console.error("Falha na autenticação", error);
      alert("Email ou senha incorretos!");
    }
  };

  const value = {
    isAuthenticated: !!token,
    token,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
