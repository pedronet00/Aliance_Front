import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormPatrimonyMaintenance, {
  PatrimonyMaintenanceFormData,
} from "../Forms/FormPatrimonyMaintenance";
import Swal from "sweetalert2";

export default function PatrimonyMaintenanceCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PatrimonyMaintenanceFormData) => {
    try {
      const res = await apiClient.post("/PatrimonyMaintenance", data);

      // erro de validação / regra de negócio
      if (res.data?.hasNotifications) {
        await Swal.fire({
          icon: "warning",
          title: "Atenção",
          html: res.data.notifications.join("<br/>"),
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Manutenção de patrimônio cadastrada com sucesso.",
      });

      navigate("/manutencoes-patrimonios");
    } catch (err: any) {
      const notifications = err?.response?.data?.notifications;

      if (notifications?.length) {
        await Swal.fire({
          icon: "error",
          title: "Erro",
          html: notifications.join("<br/>"),
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro inesperado ao cadastrar manutenção de patrimônio.",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Cadastrar Manutenção de Patrimônio
      </h1>
      <FormPatrimonyMaintenance onSubmit={handleSubmit} />
    </div>
  );
}
