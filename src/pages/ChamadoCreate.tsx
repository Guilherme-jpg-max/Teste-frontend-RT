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
  const [selectedBairro, setSelectedBairro] = useState<OptionType | null>(null);

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔽 --- NOVOS ESTADOS PARA LOCALIZAÇÃO --- 🔽
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 🔹 Buscar pessoas assistidas
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

  // 🔹 Buscar bairros
  const loadBairros = async (inputValue: string): Promise<OptionType[]> => {
    try {
      const response = await api.post("/Chamado/select/bairro", {
        pesquisa: inputValue,
      });
      return response.data.dados.map(
        (bairro: { id: number; descricao: string }) => ({
          value: bairro.id,
          label: bairro.descricao,
        })
      );
    } catch (error) {
      console.error("Erro ao buscar bairros", error);
      return [];
    }
  };

  // 🔽 --- NOVA FUNÇÃO PARA OBTER LOCALIZAÇÃO --- 🔽
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Acesso à localização negado. Por favor, habilite nas configurações do seu navegador."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Informação de localização indisponível.");
            break;
          case error.TIMEOUT:
            setLocationError("Tempo esgotado para obter a localização.");
            break;
          default:
            setLocationError("Ocorreu um erro ao obter a localização.");
            break;
        }
        setIsGettingLocation(false);
      }
    );
  };

  // 🔹 Submeter formulário (VERSÃO FINAL CORRIGIDA)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPessoa) {
      alert("Selecione uma pessoa assistida");
      return;
    }
    // A validação do bairro continua sendo importante para garantir que o label exista
    if (!selectedBairro || !selectedBairro.label) {
      alert("Selecione um bairro");
      return;
    }
    if (!latitude || !longitude) {
      alert("É necessário obter la localização para criar o chamado.");
      return;
    }

    try {
      setIsSubmitting(true);

      // --- MONTANDO O PAYLOAD CORRETO DE ACORDO COM O DTO ---
      const payload = {
        pessoaAssistidaId: selectedPessoa.value,
        // MUDANÇA 1: Usar o NOME do bairro (label) e a chave "bairro"
        bairro: selectedBairro.label,
        rua,
        // MUDANÇA 2: Enviar o número como string (remover o parseInt)
        numero,
        cep,
        cidade,
        estado,
        // MUDANÇA 3: Converter latitude para string
        latitude: latitude.toString(),
        // MUDANÇA 4: Converter longitude para string
        longitude: longitude.toString(),
      };

      console.log("Enviando payload final para a API:", payload);

      await api.post("/Chamado", payload);

      // Esta linha já está correta, de acordo com o fluxo que você mencionou
      navigate("/chamados");
    } catch (error: any) {
      console.error("Erro ao salvar chamado", error);
      const errorMessage =
        error.response?.data?.mensagem ||
        "Erro ao salvar chamado. Verifique os dados.";
      alert(errorMessage.replace(/<br\s*\/?>/gi, "\n"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Criar Novo Chamado
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... Campos Pessoa Assistida e Bairro (sem alterações) ... */}
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
                classNames={{
                  control: () =>
                    "mt-1 !border !border-gray-300 !rounded-md !shadow-sm focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:!border-blue-500",
                  input: () => "text-gray-900",
                  placeholder: () => "text-gray-400",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadBairros}
                defaultOptions
                value={selectedBairro}
                onChange={(option) => setSelectedBairro(option as OptionType)}
                placeholder="Digite para buscar um bairro..."
                loadingMessage={() => "Buscando..."}
                noOptionsMessage={() => "Nenhum resultado encontrado"}
                classNames={{
                  control: () =>
                    "mt-1 !border !border-gray-300 !rounded-md !shadow-sm focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:!border-blue-500",
                  input: () => "text-gray-900",
                  placeholder: () => "text-gray-400",
                }}
              />
            </div>

            {/* ... Campos de Endereço (sem alterações) ... */}
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
                required
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
                  required
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
                  required
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
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 🔽 --- NOVA SEÇÃO DE LOCALIZAÇÃO --- 🔽 */}
            <div className="p-4 border border-gray-200 rounded-md space-y-3">
              <h3 className="text-lg font-medium text-gray-800">
                Geolocalização
              </h3>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {isGettingLocation ? "Obtendo..." : "Obter Localização Atual"}
              </button>
              {locationError && (
                <p className="text-sm text-red-600">{locationError}</p>
              )}
              {latitude && longitude && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  <p>
                    <strong>Localização obtida com sucesso!</strong>
                  </p>
                  <p>Latitude: {latitude}</p>
                  <p>Longitude: {longitude}</p>
                </div>
              )}
            </div>

            {/* Botões */}
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
