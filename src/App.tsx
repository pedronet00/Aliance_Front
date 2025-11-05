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
import UsuariosList from "./pages/Usuarios/List";
import UsuariosCreate from "./pages/Usuarios/Create";
import PastoralVisitCreate from "./pages/PastoralVisit/Create";
import PastoralVisitList from "./pages/PastoralVisit/List";
import PastoralVisitEdit from "./pages/PastoralVisit/Edit";
import IncomeCreate from "./pages/Income/Create";
import IncomeList from "./pages/Income/List";
import ExpenseList from "./pages/Expense/List";
import ExpenseCreate from "./pages/Expense/Create";
import AccountReceivableList from "./pages/AccountReceivable/List";
import AccountPayableCreate from "./pages/AccountPayable/Create";
import AccountReceivableCreate from "./pages/AccountReceivable/Create";
import CellMeetingList from "./pages/CellMeeting/List";
import CellMeetingCreate from "./pages/CellMeeting/Create";
import CellMeetingEdit from "./pages/CellMeeting/Edit";
import CellCreate from "./pages/Cell/Create";
import CellEdit from "./pages/Cell/Edit";
import CellMemberCreate from "./pages/CellMember/Create";
import CellMemberList from "./pages/CellMember/List";
import EventList from "./pages/Event/List";
import EventCreate from "./pages/Event/Create";
import EventEdit from "./pages/Event/Edit";
import TitheList from "./pages/Tithe/List";
import TitheCreate from "./pages/Tithe/Create";
import ServiceCreate from "./pages/Service/Create";
import ServiceList from "./pages/Service/List";
import ServiceRoleCreate from "./pages/ServiceRole/Create";
import ServiceRoleList from "./pages/ServiceRole/List";
import ServiceEdit from "./pages/Service/Edit";
import LocationList from "./pages/Location/List";
import LocationCreate from "./pages/Location/Create";
import DefinePassword from "./pages/AuthPages/DefinePassword";
import UsuariosImport from "./pages/Usuarios/Import";
import WorshipTeamList from "./pages/WorshipTeam/List";
import WorshipTeamCreate from "./pages/WorshipTeam/Create";
import WorshipTeamEdit from "./pages/WorshipTeam/Edit";
import WorshipTeamMemberList from "./pages/WorshipTeamMember/List";
import WorshipTeamMemberCreate from "./pages/WorshipTeamMember/Create";
import WorshipTeamRehearsalCreate from "./pages/WorshipTeamRehearsal/Create";
import WorshipTeamRehearsalList from "./pages/WorshipTeamRehearsal/List";
import WorshipTeamRehearsalEdit from "./pages/WorshipTeamRehearsal/Edit";
import MissionCampaignList from "./pages/MissionCampaign/List";
import MissionCampaignCreate from "./pages/MissionCampaign/Create";
import MissionCampaignEdit from "./pages/MissionCampaign/Edit";
import MissionCampaignDonationCreate from "./pages/MissionCampaignDonation/Create";
import MissionCampaignDonationList from "./pages/MissionCampaignDonation/List";
import AutomaticAccountsList from "./pages/AutomaticAccounts/List";
import AutomaticAccountsCreate from "./pages/AutomaticAccounts/Create";
import AutomaticAccountsEdit from "./pages/AutomaticAccounts/Edit";

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
          <Route path="/definir-senha" element={<DefinePassword />} />

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/dizimos" element={<TitheList />} />
              <Route path="/dizimos/criar" element={<TitheCreate />} />
              <Route path="/cultos" element={<ServiceList />} />
              <Route path="/cultos/:serviceGuid/escalas" element={<ServiceRoleList />} />
              <Route path="/cultos/:serviceGuid/escalas/criar" element={<ServiceRoleCreate />} />
              <Route path="/cultos/criar" element={<ServiceCreate />} />
              <Route path="/cultos/editar/:guid" element={<ServiceEdit />} />
              <Route path="/eventos" element={<EventList />} />
              <Route path="/eventos/criar" element={<EventCreate />} />
              <Route path="/eventos/editar/:guid" element={<EventEdit />} />
              <Route path="/celulas" element={<CellList />} />
              <Route path="/locais" element={<LocationList />} />
              <Route path="/campanhas-de-missoes/:campaignGuid/doacoes" element={<MissionCampaignDonationList />} />
              <Route path="/campanhas-de-missoes/:campaignGuid/doacoes/criar" element={<MissionCampaignDonationCreate />} />
              <Route path="/campanhas-de-missoes" element={<MissionCampaignList />} />
              <Route path="/campanhas-de-missoes/criar" element={<MissionCampaignCreate />} />
              <Route path="/campanhas-de-missoes/editar/:guid" element={<MissionCampaignEdit />} />
              <Route path="/locais/criar" element={<LocationCreate />} />
              <Route path="/celulas/criar" element={<CellCreate />} />
              <Route path="/celulas/editar/:guid" element={<CellEdit/>} />
              <Route path="/celulas/:cellGuid/membros" element={<CellMemberList/>} />
              <Route path="/celulas/:cellGuid/membros/criar" element={<CellMemberCreate/>} />
              <Route path="/celulas/:guid/encontros" element={<CellMeetingList/>} />
              <Route path="/celulas/:guid/encontros/criar" element={<CellMeetingCreate/>} />
              <Route path="/celulas/:guidCelula/encontros/:guidEncontro/editar" element={<CellMeetingEdit/>} />
              <Route path="/centros-de-custo" element={<CostCenterList />} />
              <Route path="/centros-de-custo/criar" element={<CostCenterCreate />} />
              <Route path="/centros-de-custo/editar/:id" element={<CostCenterEdit />} />
              <Route path="/grupos-de-louvor" element={<WorshipTeamList />} />
              <Route path="/grupos-de-louvor/:guidEquipe/ensaios" element={<WorshipTeamRehearsalList />} />
              <Route path="/grupos-de-louvor/:guidEquipe/ensaios/criar" element={<WorshipTeamRehearsalCreate />} />
              <Route path="/grupos-de-louvor/:guidEquipe/ensaios/:guidEnsaio/editar" element={<WorshipTeamRehearsalEdit />} />
              <Route path="/grupos-de-louvor/:teamGuid/membros" element={<WorshipTeamMemberList />} />
              <Route path="/grupos-de-louvor/:teamGuid/membros/criar" element={<WorshipTeamMemberCreate />} />
              <Route path="/grupos-de-louvor/criar" element={<WorshipTeamCreate />} />
              <Route path="/grupos-de-louvor/editar/:guid" element={<WorshipTeamEdit />} />
              <Route path="/departamentos" element={<DepartmentList />} />
              <Route path="/departamentos/criar" element={<DepartmentCreate />} />
              <Route path="/departamentos/editar/:id" element={<DepartmentEdit />} />
              <Route path="/financeiro/entradas" element={<IncomeList />} />
              <Route path="/financeiro/entradas/criar" element={<IncomeCreate />} />
              <Route path="/financeiro/saidas" element={<ExpenseList />} />
              <Route path="/financeiro/saidas/criar" element={<ExpenseCreate />} />
              <Route path="/contas-automaticas" element={<AutomaticAccountsList />} />
              <Route path="/contas-automaticas/criar" element={<AutomaticAccountsCreate />} />
              <Route path="/contas-automaticas/editar/:guid" element={<AutomaticAccountsEdit />} />
              <Route path="/contas-a-pagar" element={<AccountPayableList />} />
              <Route path="/contas-a-pagar/criar" element={<AccountPayableCreate />} />
              <Route path="/contas-a-receber" element={<AccountReceivableList />} />
              <Route path="/contas-a-receber/criar" element={<AccountReceivableCreate />} />
              <Route path="/patrimonios" element={<PatrimonyList />} />
              <Route path="/membros" element={<UsuariosList />} />
              <Route path="/membros/criar" element={<UsuariosCreate />} />
              <Route path="/membros/importar" element={<UsuariosImport />} />
              <Route path="/visitas-pastorais" element={<PastoralVisitList />} />
              <Route path="/visitas-pastorais/criar" element={<PastoralVisitCreate />} />
              <Route path="/visitas-pastorais/editar/:guid" element={<PastoralVisitEdit />} />
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
