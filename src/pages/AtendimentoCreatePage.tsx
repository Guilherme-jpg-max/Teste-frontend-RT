import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function AtendimentoCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    alert("Formulário enviado (lógica a ser implementada)");
  };

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-center text-gray-500 p-4 border-2 border-dashed rounded-md">
            Campo "Pessoa Assistida"
          </p>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-2">
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
