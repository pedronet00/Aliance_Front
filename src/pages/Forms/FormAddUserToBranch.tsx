import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import useGoBack from "@/hooks/useGoBack";
import Swal from "sweetalert2";

type Option = {
  value: string;
  label: string;
};

export default function FormAddUserToBranch() {
  const { branchId } = useParams<{ branchId: string }>();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Option[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/User/active");
        const list = res.data.result.map((u: any) => ({
          value: u.id,
          label: u.fullName,
        }));
        setUsers(list);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao carregar usuários.",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchId || !userId) return;

    setLoading(true);

    try {
      const res = await apiClient.post(
        `/User/${branchId}/addToBranch/${userId}`
      );

      // backend retornou notifications sem exception
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
        text: "Usuário adicionado à filial.",
      });

      goBack();
    } catch (err: any) {
      const notifications =
        err?.response?.data?.notifications;

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
          text: "Erro inesperado ao adicionar usuário.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Usuário</Label>
        <Select
          options={users}
          placeholder="Selecione o usuário"
          value={userId}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setUserId(value);
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="button" variant="secondary" onClick={goBack}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !branchId || !userId}>
          Adicionar
        </Button>
      </div>
    </form>
  );
}
