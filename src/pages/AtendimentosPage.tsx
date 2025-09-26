import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { AtendimentoListItem } from "../types/atendimento";
import { useAuth } from "../contexts/AuthContext";

interface Filtros {
  pesquisa: string;
}

export function AtendimentosPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [atendimentos, setAtendimentos] = useState<AtendimentoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<Filtros>({ pesquisa: "" });
  const [filtrosAtivos, setFiltrosAtivos] = useState<Filtros>(filtros);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    async function fetchAtendimentos() {
      try {
        setIsLoading(true);
        const payload: any = {
          currentPage: currentPage,
          pageSize: pageSize,
        };

        if (filtrosAtivos.pesquisa) {
          payload.pesquisa = filtrosAtivos.pesquisa;
        }

        const response = await api.post("/Atendimento/listagem", payload);

        setAtendimentos(response.data.dados.dados);
        setTotalPages(response.data.dados.totalPages);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar atendimentos:", err);
        setError("Não foi possível carregar a lista de atendimentos.");
        setAtendimentos([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAtendimentos();
  }, [currentPage, filtrosAtivos]);

  const handleFilter = () => {
    setCurrentPage(1);
    setFiltrosAtivos(filtros);
  };

  const handleClearFilters = () => {
    const filtrosVazios = { pesquisa: "" };
    setFiltros(filtrosVazios);
    setFiltrosAtivos(filtrosVazios);
    setCurrentPage(1);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/atendimentos/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Lista de Atendimentos
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/chamados")}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            Chamados
          </button>
          <button
            onClick={signOut}
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={filtros.pesquisa}
            onChange={(e) =>
              setFiltros({ ...filtros, pesquisa: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFilter}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilters}
            className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150"
          >
            Limpar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">
          Carregando atendimentos...
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
                    ID Atend.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa Assistida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Chamado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Início
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
                {atendimentos.length > 0 ? (
                  atendimentos.map((atendimento) => (
                    <tr key={atendimento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {atendimento.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.pessoaAssistida?.nome || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.chamado?.id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.viatura?.placa || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(atendimento.dataInicio).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.status?.label || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(atendimento.id)}
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
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nenhum atendimento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
}
