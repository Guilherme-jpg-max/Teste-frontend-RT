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
