import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
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
import SundaySchoolClassroomList from "./pages/SundaySchoolClassroom/List";
import SundaySchoolClassroomCreate from "./pages/SundaySchoolClassroom/Create";
import UsuariosEdit from "./pages/Usuarios/Edit";
import DepartmentMemberList from "./pages/DepartmentMember/List";
import DepartmentMemberCreate from "./pages/DepartmentMember/Create";
import SubscriptionDetails from "./pages/AsaasPanel/SubscriptionDetails";
import TitheReceiptPage from "./components/tithe/titheReceiptPage";
import SundaySchoolClassList from "./pages/SundaySchoolClass/List";
import SundaySchoolClassCreate from "./pages/SundaySchoolClass/Create";
import SundaySchoolClassEdit from "./pages/SundaySchoolClass/Edit";
import LocationEdit from "./pages/Location/Edit";
import SundaySchoolClassroomEdit from "./pages/SundaySchoolClassroom/Edit";
import ReportsList from "./pages/Report/ReportsList";
import LogList from "./pages/Log/LogList";
import RoleRoute from "./components/auth/RoleRoute";
import SundaySchoolClassDocumentList from "./pages/SundaySchoolClass/SundaySchoolClassDocumentList";

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
              <Route path="/aulas-ebd" element={<SundaySchoolClassList />} />
              <Route path="/classes-ebd" element={<SundaySchoolClassroomList />} />
              <Route path="/cultos" element={<ServiceList />} />
              <Route path="/locais" element={<LocationList />} />
              <Route path="/cultos/:serviceGuid/escalas" element={<ServiceRoleList />} />
              <Route path="/eventos" element={<EventList />} />
              <Route path="/celulas" element={<CellList />} />
              <Route path="/grupos-de-louvor/:teamGuid/membros" element={<WorshipTeamMemberList />} />
              <Route path="/grupos-de-louvor" element={<WorshipTeamList />} />
              <Route path="/departamentos" element={<DepartmentList />} />
              <Route path="/departamentos/:departmentGuid/membros" element={<DepartmentMemberList/>} />
              <Route path="/campanhas-de-missoes" element={<MissionCampaignList />} />
              <Route path="/celulas/:cellGuid/membros" element={<CellMemberList/>} />
              <Route path="/membros" element={<UsuariosList />} />
              <Route path="/celulas/:guid/encontros" element={<CellMeetingList/>} />
              <Route path="/grupos-de-louvor/:guidEquipe/ensaios" element={<WorshipTeamRehearsalList />} />

              {/* ADMIN */}
              <Route element={<RoleRoute roles={["Admin", "Secretaria"]} />}>
                <Route path="/locais/criar" element={<LocationCreate />} />
                <Route path="/locais/editar/:guid" element={<LocationEdit />} />
                <Route path="/departamentos/criar" element={<DepartmentCreate />} />
                <Route path="/departamentos/editar/:guid" element={<DepartmentEdit />} />
                <Route path="/departamentos/:departmentGuid/membros/criar" element={<DepartmentMemberCreate/>} />
                <Route path="/log" element={<LogList />} />
                <Route path="/relatorios" element={<ReportsList />} />
                <Route path="/detalhes-assinatura" element={<SubscriptionDetails />} />
              </Route>

              {/* FINANCEIRO */}
              <Route element={<RoleRoute roles={["Admin", "Financeiro", "Pastor", "Secretaria"]} />}>
                <Route path="/campanhas-de-missoes/:campaignGuid/doacoes" element={<MissionCampaignDonationList />} />
                <Route path="/campanhas-de-missoes/:campaignGuid/doacoes/criar" element={<MissionCampaignDonationCreate />} />
                <Route path="/campanhas-de-missoes/criar" element={<MissionCampaignCreate />} />
                <Route path="/campanhas-de-missoes/editar/:guid" element={<MissionCampaignEdit />} />
                <Route path="/patrimonios" element={<PatrimonyList />} />
                <Route path="/patrimonios/criar" element={<PatrimonyCreate />} />
                <Route path="/patrimonios/editar/:guid" element={<PatrimonyEdit />} />
                <Route path="/aulas-ebd/:guid/documentos" element={<SundaySchoolClassDocumentList />} />
                <Route path="/patrimonios/:guid/documentos" element={<PatrimonyDocumentsList />} />
                <Route path="/manutencoes-patrimonios" element={<PatrimonyMaintenanceList />} />
                <Route path="/manutencoes-patrimonios/:guid/documentos" element={<PatrimonyMaintenanceDocumentList />} />
                <Route path="/manutencoes-patrimonios/editar/:guid" element={<PatrimonyMaintenanceEdit />} />
                <Route path="/manutencoes-patrimonios/criar" element={<PatrimonyMaintenanceCreate />} />
                <Route path="/dizimos" element={<TitheList />} />
                <Route path="/dizimos/:guid/comprovante" element={<TitheReceiptPage />} />
                <Route path="/dizimos/criar" element={<TitheCreate />} />
                <Route path="/centros-de-custo" element={<CostCenterList />} />
                <Route path="/centros-de-custo/criar" element={<CostCenterCreate />} />
                <Route path="/centros-de-custo/editar/:id" element={<CostCenterEdit />} />
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
                <Route path="/orcamentos" element={<BudgetList />} />
                <Route path="/orcamentos/criar" element={<BudgetCreate />} />
                <Route path="/orcamentos/editar/:id" element={<BudgetEdit />} />
              </Route>

              {/* DISCIPULADO E ENSINO */}
              <Route element={<RoleRoute roles={["Admin", "Professor", "Pastor", "Secretaria"]} />}>
                <Route path="/aulas-ebd/criar" element={<SundaySchoolClassCreate />} />
                <Route path="/aulas-ebd/editar/:guid" element={<SundaySchoolClassEdit />} />
                <Route path="/classes-ebd/criar" element={<SundaySchoolClassroomCreate />} />
                <Route path="/classes-ebd/editar/:guid" element={<SundaySchoolClassroomEdit />} />
                <Route path="/celulas/criar" element={<CellCreate />} />
                <Route path="/celulas/:cellGuid/membros/criar" element={<CellMemberCreate/>} />
                <Route path="/celulas/:guid/encontros/criar" element={<CellMeetingCreate/>} />
                <Route path="/celulas/:guid/encontros/:guidEncontro/editar" element={<CellMeetingEdit/>} />
                <Route path="/celulas/editar/:guid" element={<CellEdit/>} />
              </Route>
              
              {/* SERVIÇO ECLESIÁSTICO */}
              <Route element={<RoleRoute roles={["Admin", "Pastor", "Secretaria"]} />}>
                <Route path="/cultos/:serviceGuid/escalas/criar" element={<ServiceRoleCreate />} />
                <Route path="/cultos/criar" element={<ServiceCreate />} />
                <Route path="/cultos/editar/:guid" element={<ServiceEdit />} />
              </Route>

              {/* EVENTOS */}
              <Route element={<RoleRoute roles={["Admin", "Eventos", "Pastor", "Secretaria"]} />}>  
                <Route path="/eventos/criar" element={<EventCreate />} />
                <Route path="/eventos/editar/:guid" element={<EventEdit />} />
              </Route>

              {/* MEMBROS E PASTORAL */}
              <Route element={<RoleRoute roles={["Admin", "Pastor", "Secretaria"]} />}>
                <Route path="/membros/criar" element={<UsuariosCreate />} />
                <Route path="/membros/editar/:id" element={<UsuariosEdit />} />
                <Route path="/membros/importar" element={<UsuariosImport />} />
                <Route path="/visitas-pastorais" element={<PastoralVisitList />} />
                <Route path="/visitas-pastorais/criar" element={<PastoralVisitCreate />} />
                <Route path="/visitas-pastorais/editar/:guid" element={<PastoralVisitEdit />} />
              </Route>

              {/* LOUVOR */}
              <Route element={<RoleRoute roles={["Admin", "Musico", "Pastor", "Secretaria"]} />}>
                <Route path="/grupos-de-louvor/:guidEquipe/ensaios/criar" element={<WorshipTeamRehearsalCreate />} />
                <Route path="/grupos-de-louvor/:guidEquipe/ensaios/:guidEnsaio/editar" element={<WorshipTeamRehearsalEdit />} />
                <Route path="/grupos-de-louvor/:teamGuid/membros/criar" element={<WorshipTeamMemberCreate />} />
                <Route path="/grupos-de-louvor/criar" element={<WorshipTeamCreate />} />
                <Route path="/grupos-de-louvor/editar/:guid" element={<WorshipTeamEdit />} />
              </Route>
              
              <Route path="/profile" element={<UserProfiles />} />
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
