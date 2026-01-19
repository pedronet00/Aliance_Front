import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormPatrimony, { PatrimonyFormData } from "../Forms/FormPatrimony";
import Swal from "sweetalert2";

export default function PatrimonyCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PatrimonyFormData) => {
    try {
      const res = await apiClient.post("/Patrimony", data);

      // erro de regra de negócio / validação
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
        text: "Patrimônio cadastrado com sucesso.",
      });

      navigate("/patrimonios");
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
          text: "Erro inesperado ao cadastrar patrimônio.",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Cadastrar Patrimônio
      </h1>
      <FormPatrimony onSubmit={handleSubmit} />
    </div>
  );
}
