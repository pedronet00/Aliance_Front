import { useState, useMemo } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Inicial do usuário
  const userInitial = auth.user.name?.[0].toUpperCase() ?? "?";

  // Cor de fundo aleatória (sorteada apenas na montagem do componente)
  const bgColor = useMemo(() => {
    const colors = ["#281b4eff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {/* Avatar com inicial */}
        <span
          className="flex items-center justify-center mr-3 rounded-full h-11 w-11 text-white font-semibold text-lg"
          style={{ backgroundColor: bgColor }}
        >
          {userInitial}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {auth.user.name?.toUpperCase() ?? ""}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="mb-3">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {auth.user.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {auth.user.email}
          </span>
        </div>

        {/* <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/account"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Account settings
            </DropdownItem>
          </li>
        </ul> */}

        <Button
          onClick={() => auth.logout()}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium w-full justify-center"
        >
          Sair
        </Button>
      </Dropdown>
    </div>
  );
}
