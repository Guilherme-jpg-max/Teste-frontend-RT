export interface ChamadoListItem {
  id: number;
  bairro: string;
  dataCadastro: string;
  status: {
    value: string;
    label: string;
    type: string;
  };
}

export interface ChamadoDetail {
  id: number;
  bairro: string;
  cidade: string;
  estado: string;
  rua: string;
  numero: string;
  cep: string;
  dataCadastro: string;
  dataRespondido: string | null;
  status: {
    label: string;
  };
  pessoaAssistida: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  dispositivo: {
    identificador: string;
    marca: string;
    modelo: string;
  };
}
