import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { VisitaTecnicaDTO } from "@/types/VisitaTecnica/VisitaTecnicaDTO";
import { Cliente } from "@/types/Cliente/Cliente";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import TextArea from "@/components/form/input/TextArea";

type Props = {
  initialData?: VisitaTecnicaDTO;
  onSubmit: (data: VisitaTecnicaDTO) => Promise<void>;
};

export default function FormVisitaTecnica({ initialData, onSubmit }: Props) {

    const {user} = useAuth();

    const [formData, setFormData] = useState<VisitaTecnicaDTO>(
        initialData ?? {
        clienteId: 0,
        descricao: "",
        dataVisita: new Date(),
        status: 1,
        empresaId: user?.empresaId ?? 0
        }
    );

    const [clientesOptions, setClientesOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    apiClient
      .get<Cliente[]>("/Clientes")
      .then((res) =>
        setClientesOptions(
          res.data.map((f) => ({
            value: String(f.id),
            label: f.nome,
          }))
        )
      )
      .catch((err) => console.error("Erro ao carregar clientes", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Cliente</Label>
        <Select
          options={clientesOptions}
          placeholder="Selecione um cliente"
          defaultValue={formData.clienteId?.toString() || ""}
          onChange={(val) =>
            setFormData({ ...formData, clienteId: Number(val) })
          }
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <TextArea
          placeholder="Insira comentários da visita"
          value={formData.descricao}
          onChange={(val) =>
            setFormData({ ...formData, descricao: val })
          }
        />

      </div>

      <div>
        <Label>Data da visita</Label>
        <DatePicker
          id="startDate"
          placeholder="Selecione a data"
          defaultDate={new Date()}
          onChange={(selectedDates) => {
            if (selectedDates.length > 0) {
              setFormData({ ...formData, dataVisita: selectedDates[0] });
            }
          }}
      />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
