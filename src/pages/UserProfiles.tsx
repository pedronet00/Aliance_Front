import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import GenericTable from "@/components/tables/GenericTable";
import NoData from "@/components/no-data";
import { showErrorToast } from "@/components/toast/Toasts";
import { Presence } from "@/types/Presence/Presence";
import { RehearsalPresence } from "@/types/Presence/RehearsalPresence";
import { MapPin, Phone, Mail, User2, Briefcase, Heart, BookOpen } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

export default function UserProfiles() {
  const { userId } = useParams<{ userId: string }>();

  const [userData, setUserData] = useState<any>(null);
  const [services, setServices] = useState<Presence[]>([]);
  const [rehearsals, setRehearsals] = useState<RehearsalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [serviceRes, rehearsalRes, userRes] = await Promise.all([
        apiClient.get(
          `/Presence/service/by-user/${userId}?pageNumber=1&pageSize=1000`
        ),
        apiClient.get(
          `/Presence/rehearsal/by-user/${userId}?pageNumber=1&pageSize=1000`
        ),
        apiClient.get(
          `/User/${userId}/data`
        ),
      ]);

      setServices(serviceRes.data.result?.items || []);
      setRehearsals(rehearsalRes.data.result?.items || []);
      setUserData(userRes.data?.result || null);
    } catch (err) {
      showErrorToast("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const serviceColumns = [
    {
      key: "serviceDate",
      label: "Data do Culto",
      render: (p: Presence) =>
        new Date(p.serviceDate).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "serviceGuid",
      label: "Culto (ID)",
    },
  ];

  const rehearsalColumns = [
    {
      key: "serviceDate",
      label: "Data do Ensaio",
      render: (p: RehearsalPresence) =>
        new Date(p.serviceDate).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "rehearsalGuid",
      label: "Ensaio (ID)",
    },
  ];

  const maskPhone = (v?: string) => {
    if (!v) return "";
    return v.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  const maskCEP = (v?: string) => {
    if (!v) return "";
    return v.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const maskCPF = (v?: string) => {
    if (!v) return "";
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <>
      <PageMeta title="Perfil do Usuário" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Usuários", path: "/membros" },
          { label: "Perfil" },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-10">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Perfil Completo
        </h3>

        {loading && <p>Carregando perfil...</p>}
        {!loading && !userData && <NoData />}
        {!loading && userData && (
          <div className="space-y-6">

            {/* Header: Foto e Resumo */}
            <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden border-4 border-white dark:border-gray-700 rounded-full shadow-md bg-gray-200 shrink-0">
                  {userData.imageUrl ? (
                    <img src={getImageUrl(userData.imageUrl)} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      <User2 size={48} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 px-2">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {userData.userName}
                  </h2>
                  <div className="flex flex-col items-start gap-2 text-sm text-gray-500 dark:text-gray-400 lg:flex-row lg:gap-4 lg:items-center">
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} className="text-brand-500" />
                      {userData.roles?.join(", ") || "Sem perfil"}
                    </span>
                    <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 lg:block"></div>
                    <span className="flex items-center gap-1">
                      <Mail size={16} className="text-brand-500" />
                      {userData.email}
                    </span>
                    <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 lg:block"></div>
                    <span className="flex items-center gap-1">
                      <Phone size={16} className="text-brand-500" />
                      {maskPhone(userData.phone) || "Não informado"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                      Admissão: {userData.admissionType || "N/A"}
                    </span>
                    {userData.admissionDate && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Desde: {new Date(userData.admissionDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                      <Heart size={12} /> {userData.maritalStatus || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* Card 1: Pessoal */}
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 hover:shadow-sm transition-shadow">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b dark:border-gray-700">
                  <User2 size={20} className="text-brand-500" />
                  Sobre
                </h4>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Gênero</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.gender ? "Masculino" : "Feminino"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">CPF</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{maskCPF(userData.cpf) || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">RG</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.rg || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Nome do Pai</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.fathersName || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Nome da Mãe</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.mothersName || "N/A"}</dd>
                  </div>
                </dl>
              </div>

              {/* Card 2: Endereço & Profissão */}
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 hover:shadow-sm transition-shadow">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b dark:border-gray-700">
                  <MapPin size={20} className="text-brand-500" />
                  Localização & Carreira
                </h4>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Profissão</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.profession || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Escolaridade</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.education || "N/A"}</dd>
                  </div>
                  <div className="pt-2">
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Endereço</dt>
                    <dd className="font-medium text-gray-800 dark:text-white mt-1">
                      {userData.streetAdress ? `${userData.streetAdress}, ${userData.streetNumber || "S/N"}` : "Rua não informada"}<br />
                      {userData.streetComplement && <span className="text-xs text-gray-500 block">{userData.streetComplement}</span>}
                      {userData.streetNeighborhood || "Bairro não informado"}<br />
                      {userData.currentCity} - {userData.state}<br />
                      <span className="text-gray-500">CEP: {maskCEP(userData.cep) || "N/A"}</span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Card 3: Eclesiástico */}
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 hover:shadow-sm transition-shadow">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b dark:border-gray-700">
                  <BookOpen size={20} className="text-brand-500" />
                  Registro Eclesiástico
                </h4>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Religião Anterior</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{userData.previousReligion || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Batismo</dt>
                    <dd className="font-medium text-gray-800 dark:text-white flex flex-col mt-0.5 gap-0.5">
                      {userData.baptismDate && <span className="text-brand-600 block">{new Date(userData.baptismDate).toLocaleDateString('pt-BR')}</span>}
                      <span className="text-gray-600 text-xs">{(userData.baptismChurch || userData.baptismPastor) ? `Na ${userData.baptismChurch || '?'} (Pr. ${userData.baptismPastor || '?'})` : "Não informado"}</span>
                    </dd>
                  </div>
                  <div className="pt-1">
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Profissão de Fé</dt>
                    <dd className="font-medium text-gray-800 dark:text-white flex flex-col mt-0.5 gap-0.5">
                      {userData.professionOfFaithDate && <span className="text-brand-600 block">{new Date(userData.professionOfFaithDate).toLocaleDateString('pt-BR')}</span>}
                      <span className="text-gray-600 text-xs">{(userData.professionOfFaithChurch || userData.professionOfFaithPastor) ? `Na ${userData.professionOfFaithChurch || '?'} (Pr. ${userData.professionOfFaithPastor || '?'})` : "Não informado"}</span>
                    </dd>
                  </div>
                </dl>
              </div>

            </div>

            {/* Vínculos (Celulas, Departamentos)  */}
            <ComponentCard title="Vínculos Vigentes">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Departamentos */}
                <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                  <h5 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Departamentos</h5>
                  {userData.userDepartments?.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {userData.userDepartments.map((u: any, i: number) => <li key={i} className="text-gray-800 dark:text-white">{u.departmentName || u.name || `Dep ${i + 1}`}</li>)}
                    </ul>
                  ) : <span className="text-gray-400 text-sm">Nenhum vínculo</span>}
                </div>
                {/* Células */}
                <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                  <h5 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Células</h5>
                  {userData.userCells?.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {userData.userCells.map((u: any, i: number) => <li key={i} className="text-gray-800 dark:text-white">{u.cellName || u.name || `Célula ${i + 1}`}</li>)}
                    </ul>
                  ) : <span className="text-gray-400 text-sm">Nenhum vínculo</span>}
                </div>
                {/* Classes EBD */}
                <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                  <h5 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Escola Bíblica (EBD)</h5>
                  {userData.userSundaySchoolClassrooms?.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {userData.userSundaySchoolClassrooms.map((u: any, i: number) => <li key={i} className="text-gray-800 dark:text-white">{u.classroomName || u.name || `Classe ${i + 1}`}</li>)}
                    </ul>
                  ) : <span className="text-gray-400 text-sm">Nenhum vínculo</span>}
                </div>
                {/* Louvor */}
                <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                  <h5 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Equipes de Louvor</h5>
                  {userData.userWorshipTeams?.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {userData.userWorshipTeams.map((u: any, i: number) => <li key={i} className="text-gray-800 dark:text-white">{u.teamName || u.name || `Equipe ${i + 1}`}</li>)}
                    </ul>
                  ) : <span className="text-gray-400 text-sm">Nenhum vínculo</span>}
                </div>
              </div>
            </ComponentCard>


            {/* PRESENÇAS ANTIGAS REAPROVEITADAS DO CÓDIGO */}
            <ComponentCard title="Histórico de Presenças">
              <div className="space-y-6">
                {/* Cultos */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-700 dark:text-white/80">
                    Cultos
                  </h4>
                  {services.length > 0 ? (
                    <GenericTable
                      columns={serviceColumns}
                      data={services}
                    />
                  ) : (
                    <NoData />
                  )}
                </div>

                {/* Ensaios */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-700 dark:text-white/80">
                    Ensaios
                  </h4>
                  {rehearsals.length > 0 ? (
                    <GenericTable
                      columns={rehearsalColumns}
                      data={rehearsals}
                    />
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </ComponentCard>
          </div>
        )}
      </div>
    </>
  );
}
