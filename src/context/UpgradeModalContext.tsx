import { createContext, useContext, useState, ReactNode } from "react";
import UpgradeModal from "@/components/auth/UpgradeModal";

interface UpgradeModalContextType {
    openUpgradeModal: () => void;
    closeUpgradeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextType | undefined>(undefined);

export const UpgradeModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openUpgradeModal = () => setIsOpen(true);
    const closeUpgradeModal = () => setIsOpen(false);

    return (
        <UpgradeModalContext.Provider value={{ openUpgradeModal, closeUpgradeModal }}>
            {children}
            <UpgradeModal isOpen={isOpen} onClose={closeUpgradeModal} />
        </UpgradeModalContext.Provider>
    );
};

export const useUpgradeModal = () => {
    const context = useContext(UpgradeModalContext);
    if (!context) {
        throw new Error("useUpgradeModal must be used within an UpgradeModalProvider");
    }
    return context;
};
