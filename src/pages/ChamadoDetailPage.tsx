import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import type { ChamadoDetail } from "../types/chamado";

export function ChamadoDetailPage() {
  const { id } = useParams<{ id: string }>();

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

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando detalhes...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!chamado)
    return (
      <div className="p-8 text-center text-gray-500">
        Chamado não encontrado.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/chamados"
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

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Detalhes do Chamado #{chamado.id}
        </h1>

        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
              Informações do Chamado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.status.label}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                <dd className="mt-1 text-sm text-gray-900">{`${chamado.rua}, ${
                  chamado.numero || "S/N"
                } - ${chamado.bairro || "Não informado"}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Cidade/Estado
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{`${chamado.cidade} / ${chamado.estado}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CEP</dt>
                <dd className="mt-1 text-sm text-gray-900">{chamado.cep}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Data do Acionamento
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(chamado.dataCadastro).toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Data da Resposta
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.dataRespondido
                    ? new Date(chamado.dataRespondido).toLocaleString("pt-BR")
                    : "Aguardando resposta"}
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
                  {chamado.pessoaAssistida.nome}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CPF</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.pessoaAssistida.cpf}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.pessoaAssistida.telefone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.pessoaAssistida.email || "Não informado"}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
              Dispositivo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Marca/Modelo
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{`${chamado.dispositivo.marca} ${chamado.dispositivo.modelo}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Identificador
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {chamado.dispositivo.identificador}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
