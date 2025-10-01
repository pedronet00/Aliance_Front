import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { Button } from "@/components/ui/button";
import { VisitaTecnica } from "@/types/VisitaTecnica/VisitaTecnica";

export default function VisitasList() {
  const [visitas, setVisitas] = useState<VisitaTecnica[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get("/VisitasTecnicas")
      .then((res) => setVisitas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, []);

  const handleEditar = (u: VisitaTecnica) => {
    console.log("Editar", u);
  };

  const handleExcluir = (u: VisitaTecnica) => {
    console.log("Excluir", u);
  };

  const handleAtivarDesativar = (u: VisitaTecnica) => {
    console.log("Ativar/Desativar", u);
  };

  const columns = [
    { label: "cliente", key: "nomeCliente" },
    { label: "data", key: "dataVisita" },
    {
      key: "status",
      label: "Status",
      render: (c: VisitaTecnica) =>
        c.status
          ? <span className="text-green-600">Ativo</span>
          : <span className="text-red-600">Inativo</span>
    },
    {
    label: "Ações",
    render: (u: VisitaTecnica) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreDotIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleEditar(u)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAtivarDesativar(u)}>
            {u.status ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleExcluir(u)}
            className="text-destructive focus:text-destructive"
          >
            <span>Excluir</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ]

  if (loading) return <p>Carregando...</p>

  return (
    <>
      <PageMeta title="Visitas Técnicas" description="Lista de Visitas Técnicas" />
      <PageBreadcrumb pageTitle="Visitas Técnicas" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Visitas Técnicas">
          <Button 
          onClick={() => window.location.href = '/visitas/criar'} 
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Nova Visita
          </Button>
          <GenericTable columns={columns} data={visitas} />
        </ComponentCard>
      </div>
    </>
  );
}
