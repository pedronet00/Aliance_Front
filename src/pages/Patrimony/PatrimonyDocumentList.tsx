import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { showErrorToast } from "@/components/toast/Toasts";
import UploadDocumentModal from "./DocumentUploadModal";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importando os componentes do Table

interface PatrimonyDocument {
  id: number;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  contentType: string;
}

export default function PatrimonyDocumentsList() {
  const { guid } = useParams<{ guid: string }>();
  const [documents, setDocuments] = useState<PatrimonyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!guid) return;

    apiClient
      .get(`/Patrimony/${guid}/documents`)
      .then((res) => setDocuments(res.data))
      .catch((err) => showErrorToast("Erro ao buscar documentos: " + err))
      .finally(() => setLoading(false));
  }, [guid]);

  if (loading) return <p>Carregando documentos...</p>;

  return (
    <>
      <PageMeta title="Documentos do Patrimônio" description="Lista de documentos" />
      <PageBreadcrumb pageTitle="Documentos" />
      {openModal && (
        <UploadDocumentModal
          patrimonyGuid={guid}
          onClose={() => setOpenModal(false)}
        />
      )}
      <div className="space-y-6">
        <ComponentCard title="Documentos do Patrimônio">
            <div className="flex gap-3">
                <Button variant={"secondary"} onClick={() => navigate(-1)}>Voltar</Button>
                <Button onClick={() => setOpenModal(true)}>Anexar documento</Button>
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
                  <TableRow key={doc.id}>
                    <TableCell>{doc.fileName}</TableCell>
                    <TableCell>{new Date(doc.uploadedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => window.open(doc.filePath, "_blank")}>
                        Abrir
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
