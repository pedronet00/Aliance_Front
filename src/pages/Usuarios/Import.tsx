import { useState } from "react";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useNavigate } from "react-router";

export default function UsuariosImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith(".xlsx")) {
      setFile(selected);
    } else {
      toast.error("Envie um arquivo Excel válido (.xlsx).");
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("File", file);

    try {
      setIsUploading(true);
      const response = await apiClient.post("/User/importar-usuarios", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.hasNotifications) {
        toast.warning("Importação concluída com avisos. Verifique logs.");
      } else {
        navigate("/membros");
        toast.success(response.data?.result || "Usuários importados com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.errors?.[0] || "Erro ao importar usuários.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageMeta title="Importar Usuários" description="Importação de usuários via Excel" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Membros", path: "/membros" },
          { label: "Importar Usuários", path: "/membros/importar" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Importação de Usuários">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecione o arquivo Excel (.xlsx)
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Importando..." : "Importar Usuários"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => (window.location.href = "/membros")}
              >
                Voltar
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
