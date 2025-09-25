import { useEffect, useState } from "react";
import api from "../services/api";
import type { ChamadoListItem } from "../types/chamado";
import { useAuth } from "../contexts/AuthContext";

export function ChamadosPage() {
  const { signOut } = useAuth();
  const [chamados, setChamados] = useState<ChamadoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChamados() {
      try {
        const response = await api.post("/Chamado/listagem", {
          currentPage: 1,
          pageSize: 10,
        });

        setChamados(response.data.dados.dados);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
        setError("Não foi possível carregar a lista de chamados.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchChamados();
  }, []);

  if (isLoading) return <div>Carregando chamados...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Lista de Chamados</h1>
        <button
          onClick={signOut}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Sair
        </button>
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              ID
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Bairro
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Data Cadastro
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {chamados.length > 0 ? (
            chamados.map((chamado) => (
              <tr key={chamado.id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {chamado.id}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {chamado.bairro}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {new Date(chamado.dataCadastro).toLocaleDateString("pt-BR")}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {chamado.status.label}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                Nenhum chamado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
