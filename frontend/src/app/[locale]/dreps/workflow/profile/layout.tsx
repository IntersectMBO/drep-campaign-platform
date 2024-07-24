'use client';
import SetupProgressBar from '@/components/atoms/SetupProgressBar';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDRepContext } from '@/context/drepContext';
interface Props {
  children?: React.ReactNode;
}

const layout = ({ children }: Props) => {
  const pathname = usePathname();
  const { currentLocale, isLoggedIn, setLoginModalOpen, loginModalOpen } =
    useDRepContext();
  useEffect(() => {
    if (
      !isLoggedIn &&
      pathname.includes(`/${currentLocale}/dreps/workflow/profile/update`)
    ) {
      setLoginModalOpen(true);
    }
    if (isLoggedIn && loginModalOpen) setLoginModalOpen(false);
  }, [loginModalOpen, isLoggedIn]);
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

export default layout;
