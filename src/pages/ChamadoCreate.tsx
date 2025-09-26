import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import api from "../services/api";

interface OptionType {
  value: number;
  label: string;
}

export function ChamadoCreatePage() {
  const navigate = useNavigate();

  const [selectedPessoa, setSelectedPessoa] = useState<OptionType | null>(null);
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [isSubmitting] = useState(false);

  const loadPessoasAssistidas = async (
    inputValue: string
  ): Promise<OptionType[]> => {
    try {
      const response = await api.post("/PessoaAssistida/Select", {
        pesquisa: inputValue,
      });
      return response.data.dados.map(
        (pessoa: { id: number; descricao: string }) => ({
          value: pessoa.id,
          label: pessoa.descricao,
        })
      );
    } catch (error) {
      console.error("Erro ao buscar pessoas assistidas", error);
      return [];
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Formulário 'salvo' (apenas redirecionando).");
    navigate("/chamados");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Criar Novo Chamado
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pessoa Assistida
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadPessoasAssistidas}
                defaultOptions
                value={selectedPessoa}
                onChange={(option) => setSelectedPessoa(option as OptionType)}
                placeholder="Digite para buscar uma pessoa..."
                loadingMessage={() => "Buscando..."}
                noOptionsMessage={() => "Nenhum resultado encontrado"}
                // Estilos customizados para o react-select se parecer com os inputs
                classNames={{
                  control: () =>
                    "mt-1 !border !border-gray-300 !rounded-md !shadow-sm focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:!border-blue-500",
                  input: () => "text-gray-900",
                  placeholder: () => "text-gray-400",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="bairro"
                className="block text-sm font-medium text-gray-700"
              >
                Bairro
              </label>
              <input
                id="bairro"
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o bairro"
              />
            </div>

            <div>
              <label
                htmlFor="rua"
                className="block text-sm font-medium text-gray-700"
              >
                Rua
              </label>
              <input
                id="rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="numero"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número
                </label>
                <input
                  id="numero"
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="cep"
                  className="block text-sm font-medium text-gray-700"
                >
                  CEP
                </label>
                <input
                  id="cep"
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="cidade"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <input
                  id="estado"
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-2">
              <button
                type="button"
                onClick={() => navigate("/chamados")}
                className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Salvando..." : "Salvar Chamado"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
