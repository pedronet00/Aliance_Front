import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { UpgradeModalProvider } from "../context/UpgradeModalContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out lg:ml-[90px] ${isMobileOpen ? "ml-0" : ""} ${isMobileOpen || isExpanded ? "blur-md pointer-events-none opacity-60" : ""
          }`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <UpgradeModalProvider>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </UpgradeModalProvider>
  );
};

export default AppLayout;
