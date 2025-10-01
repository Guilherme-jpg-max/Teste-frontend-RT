import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import type {
  AtendimentoCreateDTO,
  PessoaAssistidaSelect,
  ChamadoSelect,
  ViaturaSelect,
  UsuarioSelect,
  AtendimentoTipoSelect,
} from "../types/atendimento";

export function AtendimentoCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AtendimentoCreateDTO>({
    responsavelId: 0,
    pessoaAssistidaId: 0,
    chamadoId: 0,
    viaturaId: 0,
    atendimentoTipoId: 0,
    observacao: "",
  });

  const [pessoasAssistidas, setPessoasAssistidas] = useState<
    PessoaAssistidaSelect[]
  >([]);
  const [chamados, setChamados] = useState<ChamadoSelect[]>([]);
  const [viaturas, setViaturas] = useState<ViaturaSelect[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSelect[]>([]);
  const [atendimentoTipos, setAtendimentoTipos] = useState<
    AtendimentoTipoSelect[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractData = (response: any) => {
    if (response?.data?.dados) return response.data.dados;
    if (response?.data) return response.data;
    return [];
  };

  useEffect(() => {
    async function loadSelectData() {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Iniciando carregamento dos selects...");

        try {
          const pessoasResponse = await api.post("/PessoaAssistida/Select", {});
          const pessoasData = extractData(pessoasResponse);
          setPessoasAssistidas(Array.isArray(pessoasData) ? pessoasData : []);
          console.log("Pessoas carregadas:", pessoasData);
        } catch (err) {
          console.error("Erro ao carregar pessoas:", err);
          setPessoasAssistidas([]);
        }

        try {
          const chamadosResponse = await api.post("/Chamado/listagem", {
            pageSize: 1000,
            currentPage: 1,
            ativo: true,
          });
          let chamadosData = extractData(chamadosResponse);
          if (chamadosData?.dados) {
            chamadosData = chamadosData.dados;
          }
          setChamados(Array.isArray(chamadosData) ? chamadosData : []);
          console.log("Chamados carregados:", chamadosData);
        } catch (err) {
          console.error("Erro ao carregar chamados:", err);
          setChamados([]);
        }

        try {
          const viaturasResponse = await api.post("/Viatura/Select", {
            disponivel: true,
          });
          const viaturasData = extractData(viaturasResponse);
          setViaturas(Array.isArray(viaturasData) ? viaturasData : []);
          console.log("Viaturas carregadas:", viaturasData);
        } catch (err) {
          console.error("Erro ao carregar viaturas:", err);
          setViaturas([]);
        }

        try {
          const usuariosResponse = await api.post("/Usuario/Select", {});
          const usuariosData = extractData(usuariosResponse);
          setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
          console.log("Usuários carregados:", usuariosData);
        } catch (err) {
          console.error("Erro ao carregar usuários:", err);
          setUsuarios([]);
        }

        try {
          const tiposResponse = await api.post("/AtendimentoTipo/select", {
            pesquisa: "",
          });
          const tiposData = extractData(tiposResponse);
          setAtendimentoTipos(Array.isArray(tiposData) ? tiposData : []);
          console.log("Tipos carregados:", tiposData);
        } catch (err) {
          console.error("Erro ao carregar tipos:", err);
          setAtendimentoTipos([]);
        }

        console.log("Carregamento concluído!");
      } catch (err) {
        console.error("Erro geral ao carregar dados dos selects:", err);
        setError("Erro ao carregar dados necessários para o formulário.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSelectData();
  }, []);

  const handleInputChange = (
    field: keyof AtendimentoCreateDTO,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.pessoaAssistidaId ||
      !formData.chamadoId ||
      !formData.viaturaId ||
      !formData.responsavelId ||
      !formData.atendimentoTipoId
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log("Enviando dados:", formData);
      await api.post("/Atendimento", formData);

      navigate("/atendimentos");
    } catch (err) {
      console.error("Erro ao criar atendimento:", err);
      setError("Erro ao criar atendimento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-10 text-gray-500">
          Carregando formulário...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Criar Novo Atendimento
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pessoaAssistida"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pessoa Assistida *
            </label>
            <select
              id="pessoaAssistida"
              value={formData.pessoaAssistidaId}
              onChange={(e) =>
                handleInputChange("pessoaAssistidaId", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecione uma pessoa assistida</option>
              {pessoasAssistidas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.descricao}
                </option>
              ))}
            </select>
            {pessoasAssistidas.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Nenhuma pessoa assistida encontrada
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="chamado"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chamado *
            </label>
            <select
              id="chamado"
              value={formData.chamadoId}
              onChange={(e) =>
                handleInputChange("chamadoId", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecione um chamado</option>
              {chamados.map((chamado) => (
                <option key={chamado.id} value={chamado.id}>
                  #{chamado.id} - {chamado.bairro}, {chamado.rua}
                </option>
              ))}
            </select>
            {chamados.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Nenhum chamado encontrado
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="viatura"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Viatura *
            </label>
            <select
              id="viatura"
              value={formData.viaturaId}
              onChange={(e) =>
                handleInputChange("viaturaId", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecione uma viatura</option>
              {viaturas.map((viatura) => (
                <option key={viatura.id} value={viatura.id}>
                  {viatura.placa} - {viatura.identificador}
                </option>
              ))}
            </select>
            {viaturas.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Nenhuma viatura encontrada
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="responsavel"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Responsável *
            </label>
            <select
              id="responsavel"
              value={formData.responsavelId}
              onChange={(e) =>
                handleInputChange("responsavelId", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecione um responsável</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.descricao}
                </option>
              ))}
            </select>
            {usuarios.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Nenhum usuário encontrado
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="atendimentoTipo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Atendimento *
            </label>
            <select
              id="atendimentoTipo"
              value={formData.atendimentoTipoId}
              onChange={(e) =>
                handleInputChange("atendimentoTipoId", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecione um tipo de atendimento</option>
              {atendimentoTipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descricao}
                </option>
              ))}
            </select>
            {atendimentoTipos.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Nenhum tipo de atendimento encontrado
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="observacao"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Observação
            </label>
            <textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => handleInputChange("observacao", e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite observações sobre o atendimento..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={() => navigate("/atendimentos")}
              className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : "Salvar Atendimento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
