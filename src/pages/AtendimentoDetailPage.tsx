import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import api from "../services/api";
import type { AtendimentoDetail } from "../types/atendimento";

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        {title}
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {children}
      </dl>
    </div>
  </div>
);

const InfoItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900">
      {children || "Não informado"}
    </dd>
  </div>
);

export function AtendimentoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

      await api.get(`/Atendimento/Finalizar?AtendimentoId=${Number(id)}`);

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

  const renderContent = () => {
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

    const isAtendimentoFinalizado =
      !!atendimento.dataFim || atendimento.status?.label === "Finalizado";
    const podeFinalizar =
      !isAtendimentoFinalizado &&
      atendimento.status?.label !== "Aguardando documentação";

    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Detalhes do Atendimento #{atendimento.id}
          </h1>
          {podeFinalizar ? (
            <button
              onClick={handleFinalizar}
              disabled={isFinalizando}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isFinalizando ? "Finalizando..." : "Finalizar Atendimento"}
            </button>
          ) : (
            <span className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md text-sm">
              {isAtendimentoFinalizado
                ? "Finalizado"
                : atendimento.status?.label}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <InfoCard title="Informações Gerais">
            <InfoItem label="Status">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isAtendimentoFinalizado
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {atendimento.status?.label}
              </span>
            </InfoItem>
            <InfoItem label="Responsável">
              {atendimento.responsavel?.nome}
            </InfoItem>
            <InfoItem label="Data de Início">
              {new Date(atendimento.dataInicio).toLocaleString("pt-BR")}
            </InfoItem>
            <InfoItem label="Data de Fim">
              {atendimento.dataFim
                ? new Date(atendimento.dataFim).toLocaleString("pt-BR")
                : "Em andamento"}
            </InfoItem>
            <InfoItem label="Viatura">
              {`${atendimento.viatura?.placa || ""} (${
                atendimento.viatura?.identificador || ""
              })`}
            </InfoItem>
            <div className="sm:col-span-2">
              <InfoItem label="Observação">
                {atendimento.observacao || "Nenhuma"}
              </InfoItem>
            </div>
          </InfoCard>

          <InfoCard title="Pessoa Assistida">
            <InfoItem label="Nome">
              {atendimento.pessoaAssistida?.nome}
            </InfoItem>
            <InfoItem label="CPF">{atendimento.pessoaAssistida?.cpf}</InfoItem>
            <InfoItem label="Telefone">
              {atendimento.pessoaAssistida?.telefone}
            </InfoItem>
          </InfoCard>

          <InfoCard title={`Chamado #${atendimento.chamado?.id}`}>
            <InfoItem label="Bairro">{atendimento.chamado?.bairro}</InfoItem>
            <InfoItem label="Rua">{atendimento.chamado?.rua}</InfoItem>
          </InfoCard>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/atendimentos")}
            className="inline-flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            Voltar à Lista
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {showToast && (
        <div className="fixed top-5 right-5 flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Atendimento finalizado com sucesso!
        </div>
      )}

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
