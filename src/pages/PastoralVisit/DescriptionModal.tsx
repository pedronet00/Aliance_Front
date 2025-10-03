import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PastoralVisit } from "@/types/PastoralVisit/PastoralVisit";

interface VisitDescriptionModalProps {
  visit: PastoralVisit | null;
  onClose: () => void;
}

const VisitDescriptionModal: FC<VisitDescriptionModalProps> = ({ visit, onClose }) => {
  if (!visit) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg mx-4 relative z-10">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Detalhes da Visita
        </h3>

        <div className="space-y-3">
          <p>
            <span className="font-medium">Data:</span>{" "}
            {new Date(visit.visitDate).toLocaleString("pt-BR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p>
            <span className="font-medium">Pastor:</span> {visit.pastorName}
          </p>
          <p>
            <span className="font-medium">Membro Visitado:</span>{" "}
            {visit.visitedMemberName}
          </p>
          <p>
            <span className="font-medium">Status:</span> {visit.status}
          </p>
          <p>
            <span className="font-medium">Descrição:</span>
          </p>
          <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
            {visit.description || "Sem descrição"}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitDescriptionModal;
