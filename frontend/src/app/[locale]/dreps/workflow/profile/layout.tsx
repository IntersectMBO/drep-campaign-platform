'use client';
import SetupProgressBar from '@/components/atoms/SetupProgressBar';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDRepContext } from '@/context/drepContext';
import { useGlobalNotifications } from '@/context/globalNotificationContext';

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const {
    currentLocale,
    isLoggedIn,
    setLoginModalOpen,
    loginModalOpen,
    isWalletListModalOpen,
    setHideCloseButtonOnLoginModal,
    setHideCloseButtonOnWalletListModal,
  } = useDRepContext();
  const { addWarningAlert } = useGlobalNotifications();
  
  useEffect(() => {
    if (
      !isLoggedIn && !isWalletListModalOpen &&
      pathname.includes(`/${currentLocale}/dreps/workflow/profile/update`)
    ) {
      setLoginModalOpen(true);
      setHideCloseButtonOnLoginModal(true);
    }
    if ((isLoggedIn && loginModalOpen) || isWalletListModalOpen) {
      setLoginModalOpen(false);
      setHideCloseButtonOnWalletListModal(true);
      setHideCloseButtonOnLoginModal(false);
    }
  }, [loginModalOpen, isLoggedIn, isWalletListModalOpen]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      addWarningAlert(
        'Changes made will be stored locally, until you submit onchain',
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="form_container bg-white px-2 py-10 lg:px-5">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {pathname !== `/${currentLocale}/dreps/workflow/profile/success` && (
          <SetupProgressBar />
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
