import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCellMeeting, {CellMeetingFormData} from "../Forms/FormCellMeeting";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function CellMeetingCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CellMeetingFormData) => {
    await apiClient.post("/CellMeeting", data);
    showCreatedSuccessfullyToast();
    navigate("/"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar saída financeira</h1>
      <FormCellMeeting onSubmit={handleSubmit} />
    </div>
  );
}
