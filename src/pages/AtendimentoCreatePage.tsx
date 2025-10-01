import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type {
  AtendimentoCreateDTO,
  PessoaAssistidaSelect,
  ChamadoSelect,
  ChamadoSelectDTO,
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
    if (response?.data?.dados?.dados) return response.data.dados.dados;
    if (response?.data?.dados) return response.data.dados;
    if (response?.data) return response.data;
    return [];
  };

  useEffect(() => {
    async function loadSelectData() {
      try {
        setIsLoading(true);
        setError(null);

        try {
          const pessoasResponse = await api.post("/PessoaAssistida/Select", {});
          setPessoasAssistidas(extractData(pessoasResponse));
        } catch (err) {
          console.error("Erro ao carregar pessoas:", err);
          setPessoasAssistidas([]);
        }

        try {
          const chamadoDTO: ChamadoSelectDTO = {
            pesquisa: "",
            pageSize: 1000,
            currentPage: 1,
            ativo: true,
            atendido: false,
            pessoaAssistidaId: 0,
            impressao: false,
            bairro: "",
            dataInicio: "2000-01-01T00:00:00Z",
            dataFim: "2100-01-01T00:00:00Z",
          };
          const chamadosResponse = await api.post(
            "/Chamado/listagem",
            chamadoDTO
          );
          setChamados(extractData(chamadosResponse));
        } catch (err) {
          console.error("Erro ao carregar chamados:", err);
          setChamados([]);
        }

        try {
          const viaturasResponse = await api.post("/Viatura/Select", {
            pesquisa: "",
            disponivel: false,
          });
          setViaturas(extractData(viaturasResponse));
        } catch (err) {
          console.error("Erro ao carregar viaturas:", err);
          setViaturas([]);
        }

        try {
          const usuariosResponse = await api.post("/Usuario/Select", {});
          setUsuarios(extractData(usuariosResponse));
        } catch (err) {
          console.error("Erro ao carregar usuários:", err);
          setUsuarios([]);
        }

        try {
          const tiposResponse = await api.post("/AtendimentoTipo/select", {
            pesquisa: "",
          });
          setAtendimentoTipos(extractData(tiposResponse));
        } catch (err) {
          console.error("Erro ao carregar tipos:", err);
          setAtendimentoTipos([]);
        }
      } catch (err) {
        console.error("Erro geral ao carregar selects:", err);
        setError("Erro ao carregar dados do formulário.");
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        Carregando formulário...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Criar Novo Atendimento
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pessoaAssistida"
              className="font-medium text-gray-700"
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
              {pessoasAssistidas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.descricao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="chamado" className="font-medium text-gray-700">
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
              {chamados.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} - {c.bairro || "Não informado"},{" "}
                  {c.rua || "Não informado"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="viatura" className="font-medium text-gray-700">
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
              {viaturas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.descricao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="responsavel" className="font-medium text-gray-700">
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
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.descricao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="atendimentoTipo"
              className="font-medium text-gray-700"
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
              {atendimentoTipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.descricao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="observacao" className="font-medium text-gray-700">
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
              className="py-2 px-6 border rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Salvando..." : "Salvar Atendimento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
