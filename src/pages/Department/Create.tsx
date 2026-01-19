import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormDepartment, { DepartmentFormData } from "../Forms/FormDepartment";
import Swal from "sweetalert2";

export default function DepartmentCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: DepartmentFormData) => {
    try {
      const res = await apiClient.post("/Department", data);

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
        text: "Departamento cadastrado com sucesso.",
      });

      navigate("/departamentos");
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
          text: "Erro inesperado ao cadastrar departamento.",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Cadastrar Departamento
      </h1>
      <FormDepartment onSubmit={handleSubmit} />
    </div>
  );
}
