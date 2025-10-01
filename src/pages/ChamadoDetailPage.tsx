import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import api from "../services/api";
import type { ChamadoDetail } from "../types/chamado";

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

export function ChamadoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState<ChamadoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchChamadoDetail() {
      try {
        setIsLoading(true);
        const response = await api.get(`/Chamado/${id}`);
        setChamado(response.data.dados);
        setError(null);
      } catch (err) {
        console.error(`Erro ao buscar detalhes do chamado ${id}:`, err);
        setError("Não foi possível carregar os detalhes do chamado.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchChamadoDetail();
  }, [id]);

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

    if (!chamado) {
      return (
        <div className="p-8 text-center text-gray-500">
          Chamado não encontrado.
        </div>
      );
    }

    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Detalhes do Chamado #{chamado.id}
          </h1>
        </div>

        <div className="space-y-6">
          <InfoCard title="Informações do Chamado">
            <InfoItem label="Status">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  chamado.status.label === "Atendido"
                    ? "bg-green-100 text-green-800"
                    : chamado.status.label === "Rejeitado"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {chamado.status.label}
              </span>
            </InfoItem>
            <InfoItem label="Endereço">
              {`${chamado.rua}, ${chamado.numero || "S/N"} - ${
                chamado.bairro || ""
              }`}
            </InfoItem>
            <InfoItem label="Cidade/Estado">{`${chamado.cidade} / ${chamado.estado}`}</InfoItem>
            <InfoItem label="CEP">{chamado.cep}</InfoItem>
            <InfoItem label="Data do Acionamento">
              {new Date(chamado.dataCadastro).toLocaleString("pt-BR")}
            </InfoItem>
            <InfoItem label="Data da Resposta">
              {chamado.dataRespondido
                ? new Date(chamado.dataRespondido).toLocaleString("pt-BR")
                : "Aguardando resposta"}
            </InfoItem>
          </InfoCard>

          <InfoCard title="Pessoa Assistida">
            <InfoItem label="Nome">{chamado.pessoaAssistida.nome}</InfoItem>
            <InfoItem label="CPF">{chamado.pessoaAssistida.cpf}</InfoItem>
            <InfoItem label="Telefone">
              {chamado.pessoaAssistida.telefone}
            </InfoItem>
            <InfoItem label="Email">{chamado.pessoaAssistida.email}</InfoItem>
          </InfoCard>

          <InfoCard title="Dispositivo">
            <InfoItem label="Marca/Modelo">{`${chamado.dispositivo.marca} ${chamado.dispositivo.modelo}`}</InfoItem>
            <InfoItem label="Identificador">
              {chamado.dispositivo.identificador}
            </InfoItem>
          </InfoCard>
        </div>
        <div className="mt-8">
          <button
            onClick={() => navigate("/chamados")}
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
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
