import { AlertTriangle } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { useNavigate } from "react-router-dom";

interface PendingItems {
  lateRehearsals: number;
  lateServices: number;
  latePastoralVisits: number;
  lateEvents: number;
  total: number;
}

interface PendingItemsAlertProps {
  pendingItems: PendingItems;
}

export default function PendingItemsAlert({
  pendingItems,
}: PendingItemsAlertProps) {
  const navigate = useNavigate();

  if (pendingItems.total === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-amber-100 p-1.5 dark:bg-amber-900">
          <AlertTriangle
            size={18}
            className="text-amber-600 dark:text-amber-400"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {pendingItems.total} pendência(s) de confirmação
          </h3>

          <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
            {pendingItems.lateServices > 0 && (
              <button
                type="button"
                onClick={() => navigate("/cultos")}
                className="cursor-pointer transition-all hover:brightness-95 hover:shadow-sm hover:-translate-y-[1px]"
              >
                <Badge color="warning" className="hover:opacity-80">
                  Cultos: {pendingItems.lateServices}
                </Badge>
              </button>
            )}

            {pendingItems.lateEvents > 0 && (
              <button
                type="button"
                onClick={() => navigate("/eventos")}
                className="cursor-pointer transition-all hover:brightness-95 hover:shadow-sm hover:-translate-y-[1px]"
              >
                <Badge color="warning" className="hover:opacity-80">
                  Eventos: {pendingItems.lateEvents}
                </Badge>
              </button>
            )}

            {pendingItems.latePastoralVisits > 0 && (
              <button
                type="button"
                onClick={() => navigate("/visitas-pastorais")}
                className="cursor-pointer transition-all hover:brightness-95 hover:shadow-sm hover:-translate-y-[1px]"
              >
                <Badge color="warning" className="hover:opacity-80">
                  Visitas: {pendingItems.latePastoralVisits}
                </Badge>
              </button>
            )}

            {pendingItems.lateRehearsals > 0 && (
              <button
                type="button"
                onClick={() => navigate("/grupos-de-louvor")}
                className="cursor-pointer transition-all hover:brightness-95 hover:shadow-sm hover:-translate-y-[1px]"
              >
                <Badge color="warning" className="hover:opacity-80">
                  Ensaios: {pendingItems.lateRehearsals}
                </Badge>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
