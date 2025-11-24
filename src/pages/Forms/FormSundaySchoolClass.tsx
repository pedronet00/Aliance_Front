import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import useGoBack from "@/hooks/useGoBack";
import apiClient from "@/api/apiClient";
import { SundaySchoolClassDTO } from "@/types/SundaySchoolClass/SundaySchoolClassDTO";

export type SundaySchoolClassFormData = SundaySchoolClassDTO;

type Props = {
  initialData?: SundaySchoolClassFormData;
  onSubmit: (data: SundaySchoolClassFormData) => Promise<void>;
};

export default function FormSundaySchoolClass({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [teachers, setTeachers] = useState<{ value: string; label: string }[]>([]);
  const [classrooms, setClassrooms] = useState<{ value: number; label: string }[]>([]);

  const [formData, setFormData] = useState<SundaySchoolClassFormData>({
  lesson: initialData?.lesson ?? "",
  teacherId: initialData?.teacherId ?? "",
  sundaySchoolClassroomId: initialData?.sundaySchoolClassroomId ?? 0,
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classroomsRes] = await Promise.all([
          apiClient.get("/User/paged?pageNumber=1&pageSize=500"),
          apiClient.get("/SundaySchoolClassroom/paged?pageNumber=1&pageSize=500"),
        ]);

        const teachersList = usersRes.data.result.items.map((u: any) => ({
          value: u.id,
          label: u.fullName
        }));

        const classroomList = classroomsRes.data.result.items.map((c: any) => ({
          value: Number(c.id),
          label: c.name,
        }));

        setTeachers(teachersList);
        setClassrooms(classroomList);

        if (initialData) {
          setFormData((prev) => ({
            ...prev,
            teacherId: initialData.teacherId ?? teachersList[0]?.value ?? "",
            sundaySchoolClassroomId:
              initialData.sundaySchoolClassroomId ?? classroomList[0]?.value ?? 0,
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do formulário", err);
      }
    };

    fetchData();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await onSubmit({
      guid: initialData?.guid,
      lesson: formData.lesson.trim(),
      teacherId: formData.teacherId,
      sundaySchoolClassroomId: Number(formData.sundaySchoolClassroomId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <Label>Lição</Label>
        <Input
          type="text"
          value={formData.lesson}
          onChange={(e) =>
            setFormData({ ...formData, lesson: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Professor</Label>
        <Select
          options={teachers}
          placeholder="Selecione o professor"
          value={formData.teacherId}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, teacherId: value });
          }}
        />
      </div>

      <div>
        <Label>Sala</Label>

        <select
          className="border border-gray-300 rounded p-2 w-full"
          value={formData.sundaySchoolClassroomId || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              sundaySchoolClassroomId: Number(e.target.value),
            })
          }
        >
          <option value="">Selecione a sala</option>
          {classrooms.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 mb-6">
        <Button type="button" variant="secondary" onClick={() => goBack()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
