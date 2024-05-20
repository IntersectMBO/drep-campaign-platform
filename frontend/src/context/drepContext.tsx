import { ChooseWalletModal } from '@/components/organisms';
import { NotDRepErrorModal } from '@/components/organisms/NotDRepErrorModal';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSharedContext } from './sharedContext';
import { navOptions } from '@/components/atoms/Header';
import { SliderMenu } from '@/components/organisms/SliderMenu';

interface DRepContext {
  step1Status: stepStatus['status'];
  step2Status: stepStatus['status'];
  step3Status: stepStatus['status'];
  step4Status: stepStatus['status'];
  isMobileDrawerOpen: boolean;
  isWalletListModalOpen: boolean;
  isNotDRepErrorModalOpen: boolean;
  currentLocale: string;
  drepId: number;
  setStep1Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep2Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep3Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep4Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setIsNotDRepErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWalletListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentLocale: React.Dispatch<React.SetStateAction<string>>;
  setNewDrepId: React.Dispatch<React.SetStateAction<number>>;
}

interface Props {
  children: React.ReactNode;
}
export interface stepStatus {
  status: 'success' | 'active' | 'pending';
}
const DRepContext = createContext<DRepContext>({} as DRepContext);
DRepContext.displayName = 'DRepContext';

function DRepProvider(props: Props) {
  const [isWalletListModalOpen, setIsWalletListModalOpen] = useState(false);
  const {sharedState, updateSharedState} = useSharedContext();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNotDRepErrorModalOpen, setIsNotDRepErrorModalOpen] = useState(false);
  const [drepId, setNewDrepId] = useState<number | null>(null);
  const [step1Status, setStep1Status] =
    useState<stepStatus['status']>('pending');
  const [step2Status, setStep2Status] =
    useState<stepStatus['status']>('pending');
  const [step3Status, setStep3Status] =
    useState<stepStatus['status']>('pending');
  const [step4Status, setStep4Status] =
    useState<stepStatus['status']>('pending');
  //will fix later
  const [currentLocale, setCurrentLocale] = useState<string | null>('en');
  useEffect(() => {
    updateSharedState({ isWalletListModalOpen, isNotDRepErrorModalOpen, isMobileDrawerOpen})
  },[isWalletListModalOpen, isNotDRepErrorModalOpen, isMobileDrawerOpen]);

  const value = useMemo(
    () => ({
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      currentLocale,
      drepId,
      step1Status,
      step2Status,
      step3Status,
      step4Status,
      isMobileDrawerOpen,
      setStep1Status,
      setStep2Status,
      setStep3Status,
      setStep4Status,
      setIsWalletListModalOpen,
      setIsNotDRepErrorModalOpen,
      setCurrentLocale,
      setIsMobileDrawerOpen,
      setNewDrepId,
      ...sharedState,
    }),
    [
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      currentLocale,
      drepId,
      step1Status,
      step2Status,
      step3Status,
      step4Status,
      isMobileDrawerOpen,
      sharedState,
    ],
  );

  return (
    <DRepContext.Provider value={value}>
      {props.children}
      {sharedState.isWalletListModalOpen && (
        <div className="blur-container absolute top-0 left-0  z-50 flex h-screen w-full items-center justify-center">
          hi im a modal
          <ChooseWalletModal />
        </div>
      )}
      {sharedState.isNotDRepErrorModalOpen && (
        <div className="blur-container fixed top-0 left-0  z-50 flex h-screen w-full items-center justify-center">
          <NotDRepErrorModal />
        </div>
      )}
      {sharedState.isMobileDrawerOpen && (
          <SliderMenu options={navOptions} handleClose={()=>setIsMobileDrawerOpen(false)} />
      )}
    </DRepContext.Provider>
  );
}

function useDRepContext() {
  const context = useContext(DRepContext);

  if (!context) {
    throw new Error('useDRepContext must be used within a DRepProvider');
  }

  return context;
}

export { DRepProvider, useDRepContext };
