import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { showErrorToast } from "@/components/toast/Toasts";
import UploadDocumentModal from "./DocumentUploadModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  guid: string;
  fileName: string;
  contentType: string;
  fileUrl: string;
  uploadedAt: string;
}

export default function SundaySchoolClassDocumentList() {
  const { guid } = useParams<{ guid: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!guid) return;

    apiClient
      .get(`/SundaySchoolClass/${guid}/documents`)
      .then((res) => setDocuments(res.data))
      .catch((err) => showErrorToast("Erro ao buscar documentos: " + err))
      .finally(() => setLoading(false));
  }, [guid]);

  const downloadDocument = async (doc: Document) => {
    try {
      const response = await apiClient.get(doc.fileUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: doc.contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      showErrorToast("Erro ao baixar documento: " + err);
    }
  };

  if (loading) return <p>Carregando documentos...</p>;

  return (
    <>
      <PageMeta title="Documentos da Aula" description="Lista de documentos" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Aulas de EBD", path: "/aulas-ebd" },
          { label: "Documentos da Aula", path: `/aulas-ebd/${guid}/documentos` },
        ]}
      />

      {openModal && (
        <UploadDocumentModal guid={guid} onClose={() => setOpenModal(false)} />
      )}

      <div className="space-y-6">
        <ComponentCard title="Documentos da Aula">

          <div className="flex gap-3 mb-4">
            <Button variant={"secondary"} onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={() => setOpenModal(true)}>
              Anexar documento
            </Button>
          </div>

          {documents.length === 0 ? (
            <p>Nenhum documento encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do arquivo</TableHead>
                  <TableHead>Data de upload</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.guid}>
                    <TableCell>{doc.fileName}</TableCell>

                    <TableCell>
                      {new Date(doc.uploadedAt).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Button size="sm" onClick={() => downloadDocument(doc)}>
                        Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

        </ComponentCard>
      </div>
    </>
  );
}
