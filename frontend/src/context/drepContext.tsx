import { ChooseWalletModal } from '@/components/organisms';
import { NotDRepErrorModal } from '@/components/organisms/NotDRepErrorModal';
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useSharedContext } from './sharedContext';
import { SliderMenu } from '@/components/organisms/SliderMenu';
import { UserLoginModal } from '@/components/organisms/UserLoginModal';
import { decodeToken, getItemFromLocalStorage, removeItemFromLocalStorage } from '@/lib';
import Cookies from 'js-cookie';

interface DRepContext {
  step1Status: stepStatus['status'];
  step2Status: stepStatus['status'];
  step3Status: stepStatus['status'];
  step4Status: stepStatus['status'];
  step5Status: stepStatus['status'];
  isLoggedIn: boolean;
  loginModalOpen: boolean;
  isMobileDrawerOpen: boolean;
  isWalletListModalOpen: boolean;
  isNotDRepErrorModalOpen: boolean;
  currentLocale: string;
  drepId: number;
  currentRegistrationStep: number;
  setStep1Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep2Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep3Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep4Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep5Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  persistLogin: () => void;
  logout: () => void;
  setCurrentRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  setIsNotDRepErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWalletListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentLocale: React.Dispatch<React.SetStateAction<string>>;
  setNewDrepId: React.Dispatch<React.SetStateAction<number>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  children: React.ReactNode;
}
export interface stepStatus {
  status: 'success' | 'active' | 'pending' | 'update';
}
export interface currentRegistrationStep {
  step: number;
}
const DRepContext = createContext<DRepContext>({} as DRepContext);
DRepContext.displayName = 'DRepContext';

function DRepProvider(props: Props) {
  const [isWalletListModalOpen, setIsWalletListModalOpen] = useState(false);
  const { sharedState, updateSharedState } = useSharedContext();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNotDRepErrorModalOpen, setIsNotDRepErrorModalOpen] = useState(false);
  const [currentRegistrationStep, setCurrentRegistrationStep] =
    useState<currentRegistrationStep['step']>(1);
  const [drepId, setNewDrepId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [step1Status, setStep1Status] =
    useState<stepStatus['status']>('pending');
  const [step2Status, setStep2Status] =
    useState<stepStatus['status']>('pending');
  const [step3Status, setStep3Status] =
    useState<stepStatus['status']>('pending');
  const [step4Status, setStep4Status] =
    useState<stepStatus['status']>('pending');
  const [step5Status, setStep5Status] =
    useState<stepStatus['status']>('pending');
  //will fix later
  const [currentLocale, setCurrentLocale] = useState<string | null>('en');
  useEffect(() => {
    updateSharedState({
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      isMobileDrawerOpen,
    });
  }, [
    isWalletListModalOpen,
    isNotDRepErrorModalOpen,
    isMobileDrawerOpen,
  ]);
  useEffect(() => {
   persistLogin() 
  }, [])
  const persistLogin = () => {
    const token = getItemFromLocalStorage('token');
    if (token) {
      const {decoded:{ exp, ...rest }} = decodeToken(token);
      const { signature, key } = rest as any;
      //check if token is expired
      if (exp < (Date.now() / 1000)) {
        setIsLoggedIn(false);
        removeItemFromLocalStorage('token');
        return;
      }
      setIsLoggedIn(true);
      updateSharedState({ loginCredentials: { signature, key } });
    }
  };

  const logout = useCallback(async () => {
    removeItemFromLocalStorage('token');
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      currentLocale,
      drepId,
      isLoggedIn,
      step1Status,
      step2Status,
      step3Status,
      step4Status,
      step5Status,
      isMobileDrawerOpen,
      currentRegistrationStep,
      loginModalOpen,
      setStep1Status,
      setStep2Status,
      setIsLoggedIn,
      setStep3Status,
      setStep4Status,
      setStep5Status,
      setIsWalletListModalOpen,
      setIsNotDRepErrorModalOpen,
      setCurrentLocale,
      setCurrentRegistrationStep,
      setIsMobileDrawerOpen,
      setNewDrepId,
      persistLogin,
      logout,
      setLoginModalOpen,
      ...sharedState,
    }),
    [
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      currentRegistrationStep,
      currentLocale,
      drepId,
      loginModalOpen,
      step1Status,
      step2Status,
      step3Status,
      step4Status,
      step5Status,
      isMobileDrawerOpen,
      sharedState,
    ],
  );

  return (
    <DRepContext.Provider value={value}>
      {props.children}
      {sharedState.isWalletListModalOpen && (
        <div className="blur-container absolute left-0 top-0  z-50 flex h-screen w-full items-center justify-center">
          <ChooseWalletModal />
        </div>
      )}
      {sharedState.isNotDRepErrorModalOpen && (
        <div className="blur-container fixed left-0 top-0  z-50 flex h-screen w-full items-center justify-center">
          <NotDRepErrorModal />
        </div>
      )}
      {/* {sharedState.isMobileDrawerOpen && (
        <SliderMenu
          options={navOptions}
          handleClose={() => setIsMobileDrawerOpen(false)}
        />
      )} */}
      {loginModalOpen && (
        <div className="blur-container fixed left-0 top-0  z-50 flex h-screen w-full items-center justify-center">
          <UserLoginModal />
        </div>
      )}
    </DRepContext.Provider>
  );
}

function useDRepContext() {
  const context = useContext(DRepContext);

  if (!context) {
    throw new Error('useDRepContext must be used within a DRepProvider');
  }

  const logout = useCallback( async () => {
    await context.logout();
  }, [context]);

  return { ...context, logout };
}

export { DRepProvider, useDRepContext };
