import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { ChamadosPage } from "../pages/Chamados";
import { ChamadoDetailPage } from "../pages/ChamadoDetailPage";
import { ChamadoCreatePage } from "../pages/ChamadoCreate";
import { AtendimentosPage } from "../pages/AtendimentosPage";
import { AtendimentoDetailPage } from "../pages/AtendimentoDetailPage";
import { AtendimentoCreatePage } from "../pages/AtendimentoCreatePage";
import { PessoaAssistidaCreatePage } from "../pages/PessoaAssistidaCreatePage";

import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return isAuthenticated ? (
    <Navigate to="/chamados" />
  ) : (
    <Navigate to="/login" />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/chamados"
        element={
          <ProtectedRoute>
            <ChamadosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atendimentos/:id"
        element={
          <ProtectedRoute>
            <AtendimentoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chamados/:id"
        element={
          <ProtectedRoute>
            <ChamadoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atendimentos"
        element={
          <ProtectedRoute>
            <AtendimentosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pessoas-assistidas/novo"
        element={
          <ProtectedRoute>
            <PessoaAssistidaCreatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/atendimentos/novo"
        element={
          <ProtectedRoute>
            <AtendimentoCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chamados/novo"
        element={
          <ProtectedRoute>
            <ChamadoCreatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
