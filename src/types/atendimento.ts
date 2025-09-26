export interface AtendimentoListItem {
  id: number;
  dataInicio: string;
  pessoaAssistida: {
    nome: string;
  };
  chamado: {
    id: number;
  };
  viatura: {
    placa: string;
  };
  status: {
    label: string;
  };
}

export interface AtendimentoDetail {
  id: number;
  dataInicio: string;
  dataFim: string | null;
  observacao: string;
  status: {
    label: string;
  };
  pessoaAssistida: {
    nome: string;
    cpf: string;
    telefone: string;
  };
  chamado: {
    id: number;
    bairro: string;
    rua: string;
  };
  viatura: {
    identificador: string;
    placa: string;
  };
  responsavel: {
    nome: string;
  };
}
