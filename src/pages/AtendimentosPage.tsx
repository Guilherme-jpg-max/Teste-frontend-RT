import { useNavigate } from "react-router-dom";

export function AtendimentosPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Lista de Atendimentos
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/chamados")}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            Chamados
          </button>
        </div>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600">
          A funcionalidade de listagem de atendimentos será implementada aqui.
        </p>
      </div>
    </div>
  );
}
