import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { LayoutDashboard, ChevronDown, ChevronUp, Calendar, GraduationCap, Church, SquareChartGantt, Ellipsis, UsersRound, DollarSign, Check } from "lucide-react";
import apiClient from "@/api/apiClient";
import { Branch } from "@/types/Branch/Branch";
import { showErrorToast } from "@/components/toast/Toasts";
import Select from "@/components/form/Select";
import Swal from 'sweetalert2';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


const othersItems: NavItem[] = [];

const BranchSwitcher = ({
  branches,
  activeBranchId,
  onChange,
  isExpanded,
  isHovered,
  isMobileOpen,
}: {
  branches: Branch[];
  activeBranchId?: number;
  onChange: (id: number) => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const showFull = isExpanded || isHovered || isMobileOpen;

  const activeBranch =
    branches.find(b => b.id === activeBranchId) ?? {
      id: 0,
      name: "Sede",
    };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="mt-auto px-3 pb-4">
      {showFull ? (
        /* SIDEBAR EXPANDIDA */
        <div className="relative">
          <span className="text-[10px] uppercase tracking-wide text-gray-400 mb-2 block">
            Filial ativa
          </span>

          <button
            onClick={() => setOpen(v => !v)}
            className="
              w-full flex items-center gap-3
              rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-semibold">
              {activeBranch.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {activeBranch.name}
              </div>
              <div className="text-xs text-gray-400">Trocar filial</div>
            </div>

            <ChevronUp
              className={`w-4 h-4 text-gray-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              className="
                absolute bottom-[calc(100%+8px)] left-0 w-full
                rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                shadow-lg z-50 overflow-hidden
              "
            >
              {[{ id: 0, name: "Sede" }, ...branches].map(branch => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onChange(branch.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition
                    ${
                      branch.id === activeBranchId
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-semibold">
                    {branch.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">
                    {branch.name}
                  </span>

                  {branch.id === activeBranchId && (
                    <Check className="w-4 h-4 text-brand-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* SIDEBAR RECOLHIDA */
        <div className="flex justify-center">
          <button
            title={`Filial: ${activeBranch.name}`}
            onClick={() => setOpen(true)}
            className="
              w-11 h-11 flex items-center justify-center
              hover:bg-gray-200 dark:hover:bg-gray-700 
              transition
            "
          >
            <Church className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
};


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user, setBranch } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  useEffect(() => {
  if (!user) {
    console.log("user ainda não carregado");
    return;
  }

  console.log("branch persistida:", user.branchId);
  console.log("localStorage:", localStorage.getItem("activeBranchId"));
}, [user]);


  
  // função utilitária p/ verificar se o usuário possui um dos roles
  const can = (roles: string[]) => {
    const userRoles = Array.isArray(user?.role) ? user.role : [user?.role];
    return userRoles.some((r: string) => roles.includes(r));
  };

 const fetchBranches = async () => {
    try {
      const res = await apiClient.get(
        `/Branch/paged?pageNumber=1&pageSize=1000`
      );
      const data = res.data;

      setBranches(data.result.items || []);
    } catch (err) {
      showErrorToast("Erro ao carregar filiais");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

   const branchOptions = [
  { value: 0, label: "Sede" },
  ...branches.map(branch => ({
    value: branch.id,
    label: branch.name,
  })),
];


  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard />,
      name: "Dashboard",
      path: '/',
    },

    {
      name: "Administração & Gestão",
      icon: <SquareChartGantt />,
      subItems: [
        ...(can(["Admin", "Pastor", "Department Leader", "Cell Leader"])
          ? [{ name: "Centros de Custo", path: "/centros-de-custo" }]
          : []),

        { name: "Departamentos", path: "/departamentos" },

        ...(can(["Admin", "Pastor", "Department Leader"])
          ? [{ name: "Manutenção Patrimonial", path: "/manutencoes-patrimonios" }]
          : []),

        ...(can(["Admin", "Pastor", "Department Leader", "Cell Leader"])
          ? [{ name: "Patrimônios", path: "/patrimonios" }]
          : []),
      ],
    },
    {
      name: "Discipulado & Ensino",
      icon: <GraduationCap />,
      subItems: [
        { name: "Células", path: "/celulas" },
        { name: "Aulas de EBD", path: "/aulas-ebd" },
      ],
    },

    {
      name: "Eventos & Filiais",
      icon: <Calendar />,
      subItems: [
        { name: "Campanhas de Missões", path: "/campanhas-de-missoes" },
        { name: "Eventos", path: "/eventos" },
        { name: "Filiais", path: "/filiais" },
      ],
    },

    {
      name: "Financeiro",
      icon: <DollarSign />,
      subItems: [
        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Contas Automáticas", path: "/contas-automaticas" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Contas a Pagar", path: "/contas-a-pagar" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Contas a Receber", path: "/contas-a-receber" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Dízimos", path: "/dizimos" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Entradas", path: "/financeiro/entradas" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Orçamentos", path: "/orcamentos" }]
          : []),

        ...(can(["Admin", "Pastor", "Financeiro"])
          ? [{ name: "Saídas", path: "/financeiro/saidas" }]
          : []),
      ],
    },
    {
      name: "Membros & Pastoral",
      icon: <UsersRound />,
      subItems: [
        { name: "Membros", path: "/membros" },

        ...(can(["Admin", "Pastor"])
          ? [{ name: "Visitas Pastorais", path: "/visitas-pastorais" }]
          : []),
      ],
    },
    {
      name: "Serviço eclesiástico",
      icon: <Church />,
      subItems: [
        { name: "Cultos", path: "/cultos" },
        { name: "Louvor", path: "/grupos-de-louvor" },
      ],
    },
    {
      name: "Outros",
      icon: <Ellipsis />,
      subItems: [
        { name: "Classes de EBD", path: "/classes-ebd" },
        { name: "Locais", path: "/locais" },
        ...(can(["Admin", "Financeiro", "Pastor"])
          ? [{ name: "Relatórios", path: "/relatorios" }]
          : []),
      ],
    },
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0 h-[calc(100vh-4rem)]" : "-translate-x-full h-screen"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/PNG PRETO CORTADO.png"
                alt="Logo"
                width={240}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/PNG BRANCO 2 CORTADO.png"
                alt="Logo"
                width={240}
                height={40}
              />
            </>
          ) : (
            <>
            <img
              className="dark:hidden"
              src="/images/logo/PNG PRETO.png"
              alt="Logo"
              width={50}
              height={32}
            />
            <img
              className="hidden dark:block"
              src="/images/logo/PNG BRANCO.png"
              alt="Logo"
              width={50}
              height={32}
            />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
              </h2>
              {renderMenuItems(othersItems, "others")}
              
            </div>
          </div>
          <BranchSwitcher
        branches={branches}
        activeBranchId={user?.branchId}
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
        onChange={(branchId) => {
          setBranch(branchId);

          Swal.fire({
            icon: "success",
            title: "Filial alterada",
            text: "A filial ativa foi atualizada.",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => window.location.reload());
        }}
      />
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
