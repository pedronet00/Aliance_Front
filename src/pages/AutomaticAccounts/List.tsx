import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AutomaticAccounts } from "@/types/AutomaticAccounts/AutomaticAccounts";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import ComponentCard from "@/components/common/ComponentCard";
import NoData from "@/components/no-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreDotIcon } from "@/icons";
import Alert from "@/components/ui/alert/Alert";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function AutomaticAccountsList() {
  const [accounts, setAccounts] = useState<AutomaticAccounts[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 5;

  const fetchAccounts = async () => {
    try {
      const res = await apiClient.get(`/AutomaticAccounts/paged?pageNumber=1&pageSize=${pageSize}`);
      setAccounts(res.data.items || []);
    } catch (error) {
      showErrorToast("Erro ao carregar contas automáticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleExcluir = async (u: AutomaticAccounts) => {
    try {
      await apiClient.delete(`/AutomaticAccounts/${u.guid}`);
      showDeletedToast();
      setAccounts((prev) => prev.filter((c) => c.guid !== u.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar conta");
    }
  };

  const handleEditar = (ac: AutomaticAccounts) => 
  {
    navigate(`/contas-automaticas/editar/${ac.guid}`);
  }

  const columns = [
    { key: "description", label: "Descrição" },
    { key: "amount", label: "Valor", render: (c: AutomaticAccounts) => "R$ " + c.amount },
    { key: "dueDay", label: "Dia do vencimento" },
    { key: "accountType", label: "Tipo", render: (c: AutomaticAccounts) => c.accountType === "Payable" ? "A Pagar" : "A Receber" },
    { key: "costCenterName", label: "Centro de Custo" },
    {
      label: "Ações",
      render: (e: Event) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleEditar(e)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem
              onClick={() => handleExcluir(e)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <PageMeta title="Contas Automáticas" description="Lista de encontros" />
      <PageBreadcrumb 
        items={[
          { label: "Início", path: "/" },
          { label: "Contas Automáticas", path: `/contas-automaticas` },
        ]}
      />
      <ComponentCard title="Contas geradas de forma automática no Aliance">
        <Alert variant="info" title="Como funciona?" message="Você deve cadastrar uma conta e informar seu dia de vencimento. O Aliance, de forma automática, vai criar um registro para Conta a Receber/Pagar 10 dias antes do vencimento da sua conta, todos os meses. Aproveite essa automação!"/>
        <div className="flex justify-start mb-4">
          <Button onClick={() => navigate("/contas-automaticas/criar")}>
            Nova conta automática
          </Button>
        </div>

        {accounts.length > 0 ? (
          <GenericTable columns={columns} data={accounts} />
        ) : (
          <NoData />
        )}
      </ComponentCard>
    </div>
  );
}
