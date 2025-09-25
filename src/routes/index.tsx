import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { ChamadosPage } from "../pages/Chamados";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chamados" element={<ChamadosPage />} />
    </Routes>
  );
}
