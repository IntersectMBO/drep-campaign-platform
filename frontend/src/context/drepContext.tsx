import { ChooseWalletModal } from '@/components/organisms';
import { NotDRepErrorModal } from '@/components/organisms/NotDRepErrorModal';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useSharedContext } from './sharedContext';
import { SliderMenu } from '@/components/organisms/SliderMenu';
import { UserLoginModal } from '@/components/organisms/UserLoginModal';
import {
  decodeToken,
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from '@/lib';
import { processExternalMetadata } from '@/lib/metadataProcessor';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { getItemFromIndexedDB } from '@/lib/indexedDb';
import { getDRepRegStatus } from '@/services/requests/getDRepRegStatus';

interface DRepContext {
  step1Status: stepStatus['status'];
  step2Status: stepStatus['status'];
  step3Status: stepStatus['status'];
  step4Status: stepStatus['status'];
  isLoggedIn: boolean;
  loginModalOpen: boolean;
  isWalletListModalOpen: boolean;
  isNotDRepErrorModalOpen: boolean;
  currentLocale: string;
  drepId: number;
  currentRegistrationStep: number;
  isDRepRegistered: boolean;
  setStep1Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep2Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep3Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setStep4Status: React.Dispatch<React.SetStateAction<stepStatus['status']>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  persistLogin: () => void;
  logout: () => void;
  setCurrentRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  setIsNotDRepErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWalletListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentLocale: React.Dispatch<React.SetStateAction<string>>;
  setNewDrepId: React.Dispatch<React.SetStateAction<number>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  metadataJsonLd: any;
  setMetadataJsonLd: React.Dispatch<React.SetStateAction<any>>;
  metadataJsonHash: any;
  setMetadataJsonHash: React.Dispatch<React.SetStateAction<any>>;
  handleRefresh: () => Promise<void>;
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
  const [isNotDRepErrorModalOpen, setIsNotDRepErrorModalOpen] = useState(false);
  const [metadataJsonLd, setMetadataJsonLd] = useState(null);
  const [metadataJsonHash, setMetadataJsonHash] = useState(null);
  const [isDRepRegistered, setIsDRepRegistered] = useState(false);
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
  //will fix later
  const [currentLocale, setCurrentLocale] = useState<string | null>('en');
  useEffect(() => {
    updateSharedState({
      isWalletListModalOpen,
      isNotDRepErrorModalOpen,
      isLoggedIn,
      isLoginModalOpen: loginModalOpen,
    });
  }, [isWalletListModalOpen, isNotDRepErrorModalOpen, isLoggedIn, loginModalOpen]);
  useEffect(() => {
    persistLogin();
  }, []);
  useEffect(() => {
    handleDrepProfileCreationState();
  }, [sharedState?.dRepIDBech32]);

  const handleRefresh = async () => {
    const locallySavedJsonld = await getItemFromIndexedDB('metadataJsonLd');
    const locallySavedHash = await getItemFromIndexedDB('metadataJsonHash');
    if (locallySavedHash) {
      setMetadataJsonHash(locallySavedHash);
    }
    if (locallySavedJsonld) {
      setMetadataJsonLd(locallySavedJsonld);
    }
  };

  const handleDrepProfileCreationState = async () => {
    try {
      let metadataJsonLd = null;
      const drepId = sharedState?.dRepIDBech32;
      if (!drepId) return;

      const isDRepRegistered = await getDRepRegStatus(drepId);
      if (!isDRepRegistered) return;

      setIsDRepRegistered(true);

      const drep = await getSingleDRepViaVoterId(drepId);
      if (drep?.drep_id) {
        setNewDrepId(drep?.drep_id);
      }
      if (drep?.signature_drepSignature) {
        setStep2Status('success');
      }
      //check for metadata locally first
      const locallySavedJsonld = await getItemFromIndexedDB('metadataJsonLd');
      const locallySavedHash = await getItemFromIndexedDB('metadataJsonHash');
      if (locallySavedHash) {
        setMetadataJsonHash(locallySavedHash);
      }
      if (locallySavedJsonld) {
        metadataJsonLd = locallySavedJsonld;
        setMetadataJsonLd(locallySavedJsonld);
      } else {
        //else get the metadata from the blockchain
        if (drep?.cexplorerDetails?.metadata_url) {
          const { jsonLdData, jsonHash } = await processExternalMetadata({
            metadataUrl: drep?.cexplorerDetails?.metadata_url,
          });
          if (!jsonLdData) return;
          metadataJsonLd = jsonLdData;
          setMetadataJsonLd(jsonLdData);
          setMetadataJsonHash(jsonHash);
        }
      }
      // if metadata is not found ignore
      if (!metadataJsonLd) return;
      const metadataBody = metadataJsonLd?.body;
      // else set the metadata to the context
      // depending on the content set the status

      //set steps accordingly
      if (metadataBody?.givenName || metadataBody?.bio || metadataBody?.email) {
        setStep1Status('success');
      }
      if (
        metadataBody?.references &&
        Array.isArray(metadataBody?.references) &&
        metadataBody?.references.length > 0
      ) {
        const currentSocialLinks = ['x', 'github', 'instagram', 'facebook'];
        const hasSocialLinks = metadataBody?.references.some((ref: any) =>
          currentSocialLinks.includes(ref?.label?.['@value'] || ref?.label),
        );
        if (hasSocialLinks) setStep3Status('success');
      }
      if (metadataBody) setStep4Status('success');
    } catch (error) {
      console.log(error);
    }
  };

  const persistLogin = () => {
    const token = getItemFromLocalStorage('token');
    if (token) {
      const {
        decoded: { exp, ...rest },
      } = decodeToken(token);
      const { signature, key } = rest as any;
      //check if token is expired
      if (exp < Date.now() / 1000) {
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
      metadataJsonLd,
      isDRepRegistered,
      setMetadataJsonLd,
      metadataJsonHash,
      setMetadataJsonHash,
      currentRegistrationStep,
      loginModalOpen,
      setStep1Status,
      setStep2Status,
      setIsLoggedIn,
      setStep3Status,
      setStep4Status,
      setIsWalletListModalOpen,
      setIsNotDRepErrorModalOpen,
      setCurrentLocale,
      setCurrentRegistrationStep,
      handleRefresh,
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
      sharedState,
      metadataJsonLd,
      isDRepRegistered,
      metadataJsonHash,
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

  const logout = useCallback(async () => {
    await context.logout();
  }, [context]);

  return { ...context, logout };
}

export { DRepProvider, useDRepContext };
