import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import type { AtendimentoDetail } from "../types/atendimento";

export function AtendimentoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [atendimento, setAtendimento] = useState<AtendimentoDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinalizando, setIsFinalizando] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchAtendimentoDetail() {
      try {
        setIsLoading(true);
        const response = await api.get(`/Atendimento/${id}`);
        setAtendimento(response.data.dados);
        setError(null);
      } catch (err) {
        console.error(`Erro ao buscar detalhes do atendimento ${id}:`, err);
        setError("Não foi possível carregar os detalhes do atendimento.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAtendimentoDetail();
  }, [id]);

  const handleFinalizar = async () => {
    if (!id || !atendimento) return;

    try {
      setIsFinalizando(true);
      setError(null);

      await api.get(`/Atendimento/Finalizar?AtendimentoId=${id}`);

      const response = await api.get(`/Atendimento/${id}`);
      setAtendimento(response.data.dados);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Erro ao finalizar atendimento:", err);
      setError("Erro ao finalizar atendimento. Tente novamente.");
    } finally {
      setIsFinalizando(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando detalhes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 border border-red-400 rounded-md">
        {error}
      </div>
    );
  }

  if (!atendimento) {
    return (
      <div className="p-8 text-center text-gray-500">
        Atendimento não encontrado.
      </div>
    );
  }

  const isAtendimentoFinalizado = !!atendimento.dataFim;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Atendimento finalizado com sucesso!
        </div>
      )}

      <Link
        to="/atendimentos"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar para a lista
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Detalhes do Atendimento #{atendimento.id}
        </h1>

        {!isAtendimentoFinalizado && (
          <button
            onClick={handleFinalizar}
            disabled={isFinalizando}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinalizando ? "Finalizando..." : "Finalizar Atendimento"}
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
            Informações Gerais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isAtendimentoFinalizado
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {atendimento.status?.label || "N/A"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Responsável</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.responsavel?.nome || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Data de Início
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(atendimento.dataInicio).toLocaleString("pt-BR")}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Fim</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.dataFim
                  ? new Date(atendimento.dataFim).toLocaleString("pt-BR")
                  : "Em andamento"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Viatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.viatura?.placa || "N/A"} (
                {atendimento.viatura?.identificador})
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Observação</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.observacao || "Nenhuma"}
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
            Pessoa Assistida
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.pessoaAssistida?.nome}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CPF</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.pessoaAssistida?.cpf}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.pessoaAssistida?.telefone}
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
            Chamado #{atendimento.chamado?.id}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Bairro</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.chamado?.bairro || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rua</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {atendimento.chamado?.rua || "N/A"}
              </dd>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Link
            to="/atendimentos"
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Voltar à Lista de Atendimentos
          </Link>
        </div>
      </div>
    </div>
  );
}
