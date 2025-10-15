import apiClient from "@/api/apiClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormExpense, { ExpenseFormData } from "../Forms/FormExpense";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";
import { useEffect, useState } from "react";

export default function ExpenseCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [initialData, setInitialData] = useState<ExpenseFormData>();

  useEffect(() => {
    const celula = searchParams.get("celula");
    const dataParam = searchParams.get("data");

    if (celula && dataParam) {
      // Converte para objeto Date e extrai apenas a parte da data (sem hora)
      const date = new Date(dataParam);
      const formattedDate = date.toISOString().split("T")[0]; // yyyy-MM-dd

      setInitialData({
        description: `Lanche pós-encontro da célula ${celula}, no dia ${formattedDate}`,
        amount: 0,
        date: new Date(formattedDate),
        category: "",
        churchId: 0,
      });
    } else if (dataParam) {
      const date = new Date(dataParam);
      const formattedDate = date.toISOString().split("T")[0];
      setInitialData({
        description: "",
        amount: 0,
        date: new Date(formattedDate),
        category: "",
        churchId: 0,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (data: ExpenseFormData) => {
    await apiClient.post("/Expense", data);
    showCreatedSuccessfullyToast();
    navigate("/financeiro/saidas");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar saída financeira</h1>
      <FormExpense onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
}
