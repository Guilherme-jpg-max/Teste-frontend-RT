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

export interface AtendimentoCreateDTO {
  responsavelId: number;
  pessoaAssistidaId: number;
  chamadoId: number;
  viaturaId: number;
  atendimentoTipoId: number;
  observacao: string;
}

export interface FiltroAtendimentoDTO {
  pesquisa?: string;
  pageSize: number;
  currentPage: number;
  ativo?: boolean;
  impressao?: boolean;
  pessoaAssistidaId?: number;
  chamadoId?: number;
  viaturaId?: number;
  atendimentoTipoId?: number;
  dataInicio?: string;
  dataFim?: string;
  dataDocumentacao?: string;
}

export interface PessoaAssistidaSelect {
  id: number;
  descrcao: string;
}

export interface ChamadoSelect {
  id: number;
  bairro: string;
  rua: string;
  numero?: string;
}

export interface ViaturaSelect {
  id: number;
  descricao: string;
}

export interface UsuarioSelect {
  id: number;
  descricao: string;
}

export interface AtendimentoTipoSelect {
  id: number;
  descricao: string;
}

export interface PessoaAssistidaSelectDTO {
  pesquisa?: string;
}

export interface ChamadoSelectDTO {
  pesquisa?: string;
  pageSize?: number;
  currentPage?: number;
  ativo?: boolean;
  impressao?: boolean;
  pessoaAssistidaId?: number;
  atendido?: boolean;
  bairro?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ViaturaSelectDTO {
  pesquisa?: string;
  disponivel?: boolean;
}

export interface UsuarioSelectDTO {
  pesquisa?: string;
  perfilAcessoId?: number;
  usuarioTipo?: string;
}
