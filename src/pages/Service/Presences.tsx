import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Button } from "@/components/ui/button";
import NoData from "@/components/no-data";
import { showErrorToast } from "@/components/toast/Toasts";
import { Presence } from "@/types/Presence/Presence";

export default function ServicePresences() {
  const { serviceGuid } = useParams<{ serviceGuid: string }>();
  const navigate = useNavigate();

  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 5;

  const fetchPresences = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Presence/service/by-service/${serviceGuid}?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data.result;

      setPresences(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error(err);
      showErrorToast("Erro ao carregar presenças");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceGuid) {
      fetchPresences(currentPage);
    }
  }, [serviceGuid, currentPage]);

  const columns = [
    {
      key: "userName",
      label: "Membro",
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta
        title="Presenças do Culto"
        description="Listagem de presenças registradas no culto"
      />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Cultos", path: "/cultos" },
          { label: "Presenças" },
        ]}
      />

      <ComponentCard title="Presenças do Culto">
        <div className="flex justify-between mb-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
                Voltar
            </Button>
            <Button
                onClick={() =>
                navigate(`/cultos/${serviceGuid}/presencas/adicionar`)
                }
            >
                Adicionar
            </Button>

        </div>


        {presences.length > 0 ? (
          <>
            <GenericTable columns={columns} data={presences} />

            {/* Paginação */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-600 text-center md:text-left">
                Página {currentPage} de {totalPages} — Total: {totalCount}
              </p>

              <div className="flex justify-center gap-2 md:justify-end">
                <Button
                  variant="secondary"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </Button>

                <Button
                  variant="secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
    </>
  );
}
