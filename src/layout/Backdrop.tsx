import { useSidebar } from "../context/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar, isExpanded, toggleSidebar } = useSidebar();

  if (!isMobileOpen && !isExpanded) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-[2px]"
      onClick={() => {
        if (isMobileOpen) toggleMobileSidebar();
        if (isExpanded) toggleSidebar();
      }}
    />
  );
};

export default Backdrop;
