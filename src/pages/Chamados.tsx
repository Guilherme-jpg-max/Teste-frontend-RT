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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  async function fetchChamados(
    page: number,
    params: { pesquisa?: string; atendido?: boolean | null }
  ) {
    try {
      setIsLoading(true);

      const payload: {
        currentPage: number;
        pageSize: number;
        pesquisa?: string;
        atendido?: boolean;
      } = {
        currentPage: page,
        pageSize: pageSize,
      };

      if (params.pesquisa) {
        payload.pesquisa = params.pesquisa;
      }
      if (params.atendido !== null) {
        payload.atendido = params.atendido;
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

  useEffect(() => {
    fetchChamados(currentPage, { pesquisa, atendido: filtroAtendido });
  }, [currentPage, pesquisa, filtroAtendido]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchChamados(1, { pesquisa, atendido: filtroAtendido });
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
          placeholder="Pesquisar por nome da pessoa assistida..."
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
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                    width: "120px",
                  }}
                >
                  Ações
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
                      <button
                        onClick={() => handleRowClick(chamado.id)}
                        style={{ cursor: "pointer" }}
                      >
                        Ver detalhes
                      </button>
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
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
