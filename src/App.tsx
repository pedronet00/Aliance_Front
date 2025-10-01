import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./routes/PrivateRoute";
import {ToastContainer} from 'react-toastify';
import AccountPayableList from "./pages/AccountPayable/List";
import BudgetList from "./pages/Budget/List";
import BudgetCreate from "./pages/Budget/Create";
import BudgetEdit from "./pages/Budget/Edit";
import CellList from "./pages/Cell/List";
import CostCenterList from "./pages/CostCenter/List";
import CostCenterCreate from "./pages/CostCenter/Create";
import CostCenterEdit from "./pages/CostCenter/Edit";
import DepartmentList from "./pages/Department/List";
import DepartmentCreate from "./pages/Department/Create";
import DepartmentEdit from "./pages/Department/Edit";
import PatrimonyList from "./pages/Patrimony/List";
import PatrimonyCreate from "./pages/Patrimony/Create";
import PatrimonyEdit from "./pages/Patrimony/Edit";
import PatrimonyDocumentsList from "./pages/Patrimony/PatrimonyDocumentList";
import PatrimonyMaintenanceCreate from "./pages/PatrimonyMaintenance/Create";
import PatrimonyMaintenanceList from "./pages/PatrimonyMaintenance/List";
import PatrimonyMaintenanceDocumentList from "./pages/PatrimonyMaintenance/PatrimonyMaintenanceDocumentList";
import PatrimonyMaintenanceEdit from "./pages/PatrimonyMaintenance/Edit";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Rotas públicas - fora do PrivateRoute */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/registrar" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/celulas" element={<CellList />} />
              <Route path="/centros-de-custo" element={<CostCenterList />} />
              <Route path="/centros-de-custo/criar" element={<CostCenterCreate />} />
              <Route path="/centros-de-custo/editar/:id" element={<CostCenterEdit />} />
              <Route path="/departamentos" element={<DepartmentList />} />
              <Route path="/departamentos/criar" element={<DepartmentCreate />} />
              <Route path="/departamentos/editar/:id" element={<DepartmentEdit />} />
              <Route path="/contas-a-pagar" element={<AccountPayableList />} />
              <Route path="/patrimonios" element={<PatrimonyList />} />
              <Route path="/patrimonios/criar" element={<PatrimonyCreate />} />
              <Route path="/patrimonios/editar/:guid" element={<PatrimonyEdit />} />
              <Route path="/patrimonios/:guid/documentos" element={<PatrimonyDocumentsList />} />
              <Route path="/manutencoes-patrimonios" element={<PatrimonyMaintenanceList />} />
              <Route path="/manutencoes-patrimonios/:guid/documentos" element={<PatrimonyMaintenanceDocumentList />} />
              <Route path="/manutencoes-patrimonios/editar/:guid" element={<PatrimonyMaintenanceEdit />} />
              <Route path="/manutencoes-patrimonios/criar" element={<PatrimonyMaintenanceCreate />} />
              <Route path="/orcamentos" element={<BudgetList />} />
              <Route path="/orcamentos/criar" element={<BudgetCreate />} />
              <Route path="/orcamentos/editar/:id" element={<BudgetEdit />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="bottom-right"  // posição do toast
        autoClose={2500}      // fecha automaticamente em 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
    </>
  );
}
