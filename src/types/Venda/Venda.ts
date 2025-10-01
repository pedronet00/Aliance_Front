export type Venda =
{
    id: number;
    guid: string;
    clienteId: number;
    nomeCliente: string;
    dataVenda: Date;
    valorOriginal: number;
    descontoPercentual: number;
    valorTotal: number;
    empresaId: number;
    status: string;
}