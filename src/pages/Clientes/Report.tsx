import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { MoveLeft } from "lucide-react";

interface Cliente {
  id: number;
  guid: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  status: boolean;
  empresaId: number;
}

interface ClientesRelatorio {
  quantidadeClientes: number;
  clientes: Cliente[];
  quantidadeClientesUltimoMes: number;
  clienteQueMaisComprou: Cliente | null;
}

export default function ClientesRelatorio() {
  const [data, setData] = useState<ClientesRelatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await apiClient.get("/Clientes/relatorio"); // ajuste a rota conforme seu backend
        setData(response.data.result);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, []);

  if (loading) {
    return <div>Carregando relatório...</div>;
  }

  if (!data) {
    return <div>Nenhum dado encontrado.</div>;
  }

  return (
    <>
    <div className="flex items-center mb-4 gap-3 flex-wrap">
        <Button variant={"secondary"} onClick={() => navigate(-1)}>
            <MoveLeft/>Voltar
        </Button>
        <Button onClick={() => window.print()} className="m-4 bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
            Imprimir Relatório
        </Button>
    </div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Resumo */}
      <div className="p-4 grid grid-cols-3 gap-6">
        <div>
          <h3 className="text-gray-500 text-sm">Total de Clientes</h3>
          <p className="text-lg font-semibold">{data.quantidadeClientes}</p>
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">Novos clientes (último mês)</h3>
          <p className="text-lg font-semibold">
            {data.quantidadeClientesUltimoMes}
          </p>
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">Maior comprador (6 meses)</h3>
          <p className="text-lg font-semibold">
            {data.clienteQueMaisComprou
              ? data.clienteQueMaisComprou.nome
              : "Nenhum"}
          </p>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nome
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                CPF
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Telefone
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {cliente.nome}
                  </span>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {cliente.endereco}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {cliente.cpf}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {cliente.telefone}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {cliente.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={cliente.status ? "success" : "error"}>
                    {cliente.status ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </>
  );
}
