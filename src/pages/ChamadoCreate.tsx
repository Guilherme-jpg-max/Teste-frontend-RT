import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ChamadoCreatePage() {
  const navigate = useNavigate();

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Formulário enviado!");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <Link
        to="/chamados"
        style={{ marginBottom: "1.5rem", display: "inline-block" }}
      >
        &larr; Voltar para a lista
      </Link>

      <h1>Criar Novo Chamado</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <p>Campo "Pessoa Assistida" (autocomplete) virá aqui.</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <p>Campo "Bairro" (autocomplete) virá aqui.</p>
        </div>

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
              backgroundColor: "#007bff",
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
