import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { Usuario } from "@/types/Usuario/Usuario";
import { Button } from "@/components/ui/button";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get("/Usuario")
      .then((res) => setUsuarios(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, []);

  const handleEditar = (u: Usuario) => {
    console.log("Editar", u);
  };

  const handleExcluir = (u: Usuario) => {
    console.log("Excluir", u);
  };

  const handleAtivarDesativar = (u: Usuario) => {
    console.log("Ativar/Desativar", u);
  };

  const columns = [
    { label: "nome", key: "userName" },
    { label: "cpf", key: "cpf" },
    { label: "email", key: "email" },
    {
      key: "status",
      label: "Status",
      render: (c: Usuario) =>
        c.status
          ? <span className="text-green-600">Ativo</span>
          : <span className="text-red-600">Inativo</span>
    },
    {
    label: "Ações",
    render: (u: Usuario) => (
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
      <PageMeta title="Usuários" description="Lista de Usuários" />
      <PageBreadcrumb pageTitle="Usuários" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Usuários">
          <Button 
          onClick={() => window.location.href = '/usuarios/criar'} 
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Novo Usuário
          </Button>
          <GenericTable columns={columns} data={usuarios} />
        </ComponentCard>
      </div>
    </>
  );
}
