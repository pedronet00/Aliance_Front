import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreDotIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import { Tithe } from "@/types/Tithe/Tithe";

export default function TitheList() {
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Tithe")
      .then((res) => {
        const data = res.data.result || res.data;
        setTithes(data);
      })
      .catch((err) => showErrorToast("Erro ao carregar dízimos: " + err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (tithe: Tithe) => {
    try {
      await apiClient.delete(`/Tithe/${tithe.guid}`);
      showDeletedToast();
      setTithes((prev) => prev.filter((t) => t.guid !== tithe.guid));
    } catch (error) {
      showErrorToast("Erro ao excluir dízimo: " + error);
    }
  };

  const columns = [
    { key: "userName", label: "Membro", render: (t: Tithe) => t.userName ?? t.userId },
    { key: "amount", label: "Valor", render: (t: Tithe) => `R$ ${t.amount.toFixed(2)}` },
    { key: "date", label: "Data", render: (t: Tithe) => new Date(t.date).toLocaleDateString() },
    {
      label: "Ações",
      render: (t: Tithe) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate(`/dizimos/editar/${t.guid}`)}>
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(t)}
              className="text-destructive focus:text-destructive"
            >
              <span>Excluir</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Dízimos" description="Lista de dízimos registrados" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Dízimos", path: "/dizimos" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Dízimos">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate(-1)}>Voltar</Button>
            <Button onClick={() => navigate("/dizimos/criar")}>Registrar Dízimo</Button>
          </div>

          <GenericTable columns={columns} data={tithes} />
        </ComponentCard>
      </div>
    </>
  );
}
