import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import UserDropdown from "../components/header/UserDropdown";
import { AppWindow, AxeIcon, Banknote, ChurchIcon, CircleDollarSign, Construction, DollarSign, FolderClosed, HandCoins, Music, Podcast, Receipt, Settings, SpotlightIcon, UserIcon } from "lucide-react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<typeof modules>([]);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = modules.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [search]);


  const modules = [
    { icon: <Podcast />, name: "Células", route: "/celulas" },
    { icon: <UserIcon />, name: "Membros", route: "/membros" },
    { icon: <CircleDollarSign />, name: "Contas a Pagar", route: "/contas-a-pagar" },
    { icon: <Banknote />, name: "Contas a Receber", route: "/contas-a-receber" },
    { icon: <ChurchIcon />, name: "Cultos", route: "/cultos" },
    { icon: <SpotlightIcon />, name: "Eventos", route: "/eventos" },
    { icon: <DollarSign />, name: "Entradas", route: "/entradas" },
    { icon: <Receipt />, name: "Saídas", route: "/saidas" },
    { icon: <AxeIcon />, name: "Orçamentos", route: "/orcamentos" },
    { icon: <HandCoins />, name: "Dízimos", route: "/dizimos" },
    { icon: <Music />, name: "Louvor", route: "/grupos-de-louvor" },
    { icon: <FolderClosed />, name: "Centros de Custo", route: "/centros-de-custo" },
    { icon: <AppWindow />, name: "Departamentos", route: "/departamentos" },
    { icon: <Settings />, name: "Patrimônios", route: "/patrimonios" },
    { icon: <Construction />, name: "Manutenções Patrimoniais", route: "/manutencoes-patrimonios" },
  ];


  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className="sticky top-0 flex w-full z-40 lg:border-b border-gray-200/50 dark:border-white/5 shadow-sm transition-all bg-white/80 backdrop-blur-md dark:bg-linear-to-r dark:from-[#0e357a] dark:to-[#061d44]"
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-white/10 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">


          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden"
              src="/images/logo/PNG PRETO CORTADO.png"
              width={180}
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="/images/logo/PNG BRANCO 2 CORTADO.png"
              width={180}
              alt="Logo"
            />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-white/70 rounded-lg z-99999 hover:bg-gray-100 dark:hover:bg-white/5 lg:hidden transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="hidden lg:block ml-4">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-400 dark:fill-white/40"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    />
                  </svg>
                </span>
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Busque páginas ou ferramentas (⌘ K)"
                    className="h-10 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 py-2.5 pl-11 pr-14 text-sm text-gray-800 dark:text-white shadow-sm dark:shadow-lg placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-blue-300 dark:focus:border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-white/5 xl:w-[450px] transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white border mt-1 rounded shadow-lg z-50">
                      {suggestions.map((mod) => (
                        <li
                          key={mod.route}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearch("");
                            setSuggestions([]);
                            window.location.href = mod.route;
                          }}
                        >
                          {mod.icon}
                          <span>{mod.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                  <span> ⌘K </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
