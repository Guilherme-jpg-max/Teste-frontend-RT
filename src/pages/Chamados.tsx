// src/pages/Chamados.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { ChamadoListItem } from "../types/chamado";
import { useAuth } from "../contexts/AuthContext";

export function ChamadosPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [chamados, setChamados] = useState<ChamadoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAtendido, setFiltroAtendido] = useState<boolean | null>(null);

  async function fetchChamados(params: {
    pesquisa?: string;
    atendido?: boolean | null;
  }) {
    try {
      setIsLoading(true);

      const payload: {
        currentPage: number;
        pageSize: number;
        pesquisa?: string;
        atendido?: boolean;
      } = {
        currentPage: 1,
        pageSize: 10,
      };

      if (params.pesquisa) {
        payload.pesquisa = params.pesquisa;
      }
      if (params.atendido !== null) {
        payload.atendido = params.atendido;
      }

      const response = await api.post("/Chamado/listagem", payload);
      setChamados(response.data.dados.dados);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
      setError("Não foi possível carregar a lista de chamados.");
      setChamados([]);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchChamados({ pesquisa: "", atendido: null });
  }, []);

  const handleFilter = () => {
    fetchChamados({ pesquisa, atendido: filtroAtendido });
  };

  const handleRowClick = (id: number) => {
    navigate(`/chamados/${id}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
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

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar por bairro, rua..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={{ padding: "8px", flexGrow: 1 }}
        />
        <select
          value={filtroAtendido === null ? "todos" : String(filtroAtendido)}
          onChange={(e) => {
            const value = e.target.value;
            setFiltroAtendido(value === "todos" ? null : value === "true");
          }}
          style={{ padding: "8px" }}
        >
          <option value="todos">Todos os Status</option>
          <option value="true">Atendidos</option>
          <option value="false">Pendentes</option>
        </select>
        <button onClick={handleFilter} style={{ padding: "8px 16px" }}>
          Filtrar
        </button>
      </div>

      {isLoading ? (
        <div>Carregando chamados...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead></thead>
          <tbody>
            {chamados.length > 0 ? (
              chamados.map((chamado) => (
                <tr
                  key={chamado.id}
                  onClick={() => handleRowClick(chamado.id)}
                  style={{ cursor: "pointer" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
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
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  Nenhum chamado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
