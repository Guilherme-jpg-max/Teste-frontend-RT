// src/pages/ChamadoDetailPage.tsx
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
    return <div style={{ padding: "2rem" }}>Carregando detalhes...</div>;
  if (error)
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (!chamado)
    return <div style={{ padding: "2rem" }}>Chamado não encontrado.</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Link
        to="/chamados"
        style={{ marginBottom: "1.5rem", display: "inline-block" }}
      >
        &larr; Voltar para a lista
      </Link>

      <h1>Detalhes do Chamado #{chamado.id}</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3>Informações do Chamado</h3>
        <p>
          <strong>Status:</strong> {chamado.status.label}
        </p>
        <p>
          <strong>Endereço:</strong>{" "}
          {`${chamado.rua}, ${chamado.numero || "S/N"} - ${
            chamado.bairro || "Não informado"
          }`}
        </p>
        <p>
          <strong>Cidade/Estado:</strong>{" "}
          {`${chamado.cidade} / ${chamado.estado}`}
        </p>
        <p>
          <strong>Data do Acionamento:</strong>{" "}
          {new Date(chamado.dataCadastro).toLocaleString("pt-BR")}
        </p>
        <p>
          <strong>Data da Resposta:</strong>{" "}
          {chamado.dataRespondido
            ? new Date(chamado.dataRespondido).toLocaleString("pt-BR")
            : "Aguardando resposta"}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      >
        <h3>Pessoa Assistida</h3>
        <p>
          <strong>Nome:</strong> {chamado.pessoaAssistida.nome}
        </p>
        <p>
          <strong>CPF:</strong> {chamado.pessoaAssistida.cpf}
        </p>
        <p>
          <strong>Telefone:</strong> {chamado.pessoaAssistida.telefone}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {chamado.pessoaAssistida.email || "Não informado"}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      >
        <h3>Dispositivo</h3>
        <p>
          <strong>Marca/Modelo:</strong>{" "}
          {`${chamado.dispositivo.marca} ${chamado.dispositivo.modelo}`}
        </p>
        <p>
          <strong>Identificador:</strong> {chamado.dispositivo.identificador}
        </p>
      </div>
    </div>
  );
}
