import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import NoData from "@/components/no-data";
import { Button } from "@/components/ui/button";

export default function LogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/Log/paged?pageNumber=${page}&pageSize=${pageSize}`);
      const data = res.data.result;

      setLogs(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Erro ao carregar logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const columns = [
    // { key: "id", label: "ID" },
    // { key: "action", label: "Ação" },
    // { key: "tableName", label: "Tabela" },
    { key: "description", label: "Descrição" },
    {
      key: "createdAt",
      label: "Data",
      render: (l: any) => {
        const dt = new Date(l.createdAt + "Z");

        return dt.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
}

    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Logs do Sistema" description="Registro de atividades" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Logs da igreja", path: "/logs" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Logs do Sistema">

          {logs.length > 0 ? (
            <>
              <GenericTable columns={columns} data={logs} />

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} — Total: {totalCount}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <NoData />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
