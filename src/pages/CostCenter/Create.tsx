import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCostCenter, { CostCenterFormData } from "../Forms/FormCostCenter";
import Swal from "sweetalert2";

export default function CostCenterCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CostCenterFormData) => {
    try {
      const res = await apiClient.post("/CostCenter", data);

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
        text: "Centro de custo cadastrado com sucesso.",
      });

      navigate("/centros-de-custo");
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
          text: "Erro inesperado ao cadastrar centro de custo.",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Cadastrar Centro de Custo
      </h1>
      <FormCostCenter onSubmit={handleSubmit} />
    </div>
  );
}
