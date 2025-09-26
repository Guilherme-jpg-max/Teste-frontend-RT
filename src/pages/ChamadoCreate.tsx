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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Criar Novo Chamado</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Pessoa Assistida:
          <AsyncSelect
            cacheOptions
            loadOptions={loadPessoasAssistidas}
            defaultOptions
            value={selectedPessoa}
            onChange={(option) => setSelectedPessoa(option as OptionType)}
            placeholder="Digite para buscar uma pessoa..."
            loadingMessage={() => "Buscando..."}
            noOptionsMessage={() => "Nenhum resultado encontrado"}
          />
        </label>

        <label>
          Bairro:
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            placeholder="Digite o bairro"
          />
        </label>

        <label>
          Rua:
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            Número:
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label style={{ flex: 1 }}>
            CEP:
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 2 }}>
            Cidade:
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Estado:
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/chamados")}
            style={{ padding: "10px 20px" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: isSubmitting ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
            }}
          >
            {isSubmitting ? "Salvando..." : "Salvar Chamado"}
          </button>
        </div>
      </form>
    </div>
  );
}
