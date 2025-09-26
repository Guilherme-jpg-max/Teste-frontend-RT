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

  const [filtroSelecionado, setFiltroSelecionado] = useState<string>("todos");

  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    async function fetchChamados() {
      try {
        setIsLoading(true);
        const payload: {
          currentPage: number;
          pageSize: number;
          atendido?: boolean;
        } = {
          currentPage: currentPage,
          pageSize: pageSize,
        };

        if (filtroAtivo === "atendidos") {
          payload.atendido = true;
        } else if (filtroAtivo === "rejeitado") {
          payload.atendido = false;
        }

        const response = await api.post("/Chamado/listagem", payload);

        setChamados(response.data.dados.dados);
        setTotalPages(response.data.dados.totalPages);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
        setError("Não foi possível carregar a lista de chamados.");
        setChamados([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChamados();
  }, [currentPage, filtroAtivo]);

  const handleFilter = () => {
    setCurrentPage(1);
    setFiltroAtivo(filtroSelecionado);
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
        <div>
          <button
            onClick={() => navigate("/chamados/novo")}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              marginRight: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Novo Chamado
          </button>
          <button
            onClick={signOut}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            Sair
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <select
          value={filtroSelecionado}
          onChange={(e) => setFiltroSelecionado(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="todos">Todos</option>
          <option value="atendidos">Atendidos</option>
          <option value="rejeitado">Rejeitado</option>
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
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Ações
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
                      {chamado.bairro || "Não informado"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(chamado.dataCadastro).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {chamado.status.label}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => handleRowClick(chamado.id)}
                        style={{ cursor: "pointer" }}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
