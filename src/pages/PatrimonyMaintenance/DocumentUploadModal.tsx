import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast, showCreatedSuccessfullyToast } from "@/components/toast/Toasts";
import apiClient from "@/api/apiClient";

interface UploadDocumentModalProps {
  maintenanceGuid: string;
  onClose: () => void;
}

const UploadDocumentModal: FC<UploadDocumentModalProps> = ({ maintenanceGuid, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return showErrorToast("Selecione um arquivo.");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await apiClient.post(`/PatrimonyMaintenance/${maintenanceGuid}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showCreatedSuccessfullyToast();
      onClose();
    } catch (err) {
      showErrorToast("Erro ao enviar documento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay de fundo escuro */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose} // Fecha o modal ao clicar fora
      ></div>

      {/* Modal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm mx-4 relative z-10">
        <h3 className="text-lg font-semibold mb-4 text-center">Anexar Documento</h3>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-6 w-full border border-gray-300 rounded px-2 py-1"
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
