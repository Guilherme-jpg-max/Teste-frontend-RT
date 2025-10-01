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
  const [filtroSelecionado, setFiltroSelecionado] = useState<string>("todos");
  const [filtroAtivo, setFiltroAtivo] = useState({
    texto: "",
    status: "todos",
  });

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
          pesquisa?: string;
          atendido?: boolean;
        } = {
          currentPage: currentPage,
          pageSize: pageSize,
        };

        if (filtroAtivo.texto) {
          payload.pesquisa = filtroAtivo.texto;
        }

        if (filtroAtivo.status === "atendidos") {
          payload.atendido = true;
        } else if (filtroAtivo.status === "rejeitado") {
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
    setFiltroAtivo({ texto: pesquisa, status: filtroSelecionado });
  };

  const handleClearFilters = () => {
    setPesquisa("");
    setFiltroSelecionado("todos");
    setFiltroAtivo({ texto: "", status: "todos" });
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/chamados/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <nav className="flex items-center gap-4">
              <a
                href="/chamados"
                className="font-semibold text-blue-600 border-b-2 border-blue-600 py-1"
              >
                Chamados
              </a>
              <a
                href="/atendimentos"
                className="font-semibold text-gray-500 hover:text-blue-600 transition-colors"
              >
                Atendimentos
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/pessoas-assistidas/novo")}
                className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm"
              >
                Nova Pessoa
              </button>
              <button
                onClick={() => navigate("/chamados/novo")}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm"
              >
                Novo Chamado
              </button>
              <button
                onClick={signOut}
                title="Sair do sistema"
                className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Lista de Chamados
        </h2>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              placeholder="Pesquisar por nome"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full lg:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filtroSelecionado}
              onChange={(e) => setFiltroSelecionado(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="atendidos">Atendidos</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFilter}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
              >
                Filtrar
              </button>
              <button
                onClick={handleClearFilters}
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            Carregando chamados...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-100 border border-red-400 rounded-md p-4">
            {error}
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bairro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chamados.length > 0 ? (
                    chamados.map((chamado) => (
                      <tr key={chamado.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {chamado.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {chamado.bairro || "Não informado"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(chamado.dataCadastro).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {chamado.status.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRowClick(chamado.id)}
                            className="py-1 px-3 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Nenhum chamado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="flex items-center justify-center mt-6 gap-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="py-1 px-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="py-1 px-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
