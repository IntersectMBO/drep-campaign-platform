import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface DRepContext {
  isWalletListModalOpen: boolean;
  activeTab: string;
  setIsWalletListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  toggleModal: () => void;
}

interface Props {
  children: React.ReactNode;
}

const DRepContext = createContext<DRepContext>({} as DRepContext);
DRepContext.displayName = "DRepContext";

function DRepProvider(props: Props) {
  const [isWalletListModalOpen, setIsWalletListModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('/dreps');
  const toggleModal = () => {
    setIsWalletListModalOpen((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      isWalletListModalOpen,
      activeTab,
      setIsWalletListModalOpen,
      setActiveTab,
      toggleModal,
    }),
    [isWalletListModalOpen, activeTab]
  );

  return <DRepContext.Provider value={value} {...props} />;
}

function useDRepContext() {
  const context = useContext(DRepContext);

  if (!context) {
    throw new Error("useDRepContext must be used within a DRepProvider");
  }

  return context;
}

export { DRepProvider, useDRepContext };
