import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import WalletConnectButton from '@/components/molecules/WalletConnectButton';
import { WalletInfoCard } from '@/components/molecules';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDRepContext } from '@/context/drepContext';
import { useScreenDimension } from '@/hooks';
import VoltaireMenu from '../molecules/VoltaireMenu';
import DRepMenu from '../molecules/DRepMenu';
import { SliderMenu } from '../organisms/SliderMenu';
import NotificationDrawer from "@/components/molecules/NotificationDrawer";

const Header = () => {
  const { isEnabled } = useCardano();
  const { currentLocale } = useDRepContext();
  const { isMobile } = useScreenDimension();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(null);
  useEffect(() => {
    // Setting the active link based on the current pathname
    setActiveLink(pathname);
  }, [pathname]);
  //add event listener to the window to check if the screen is mobile
  return (
    <header className="w-full bg-white bg-opacity-50">
      <div className="base_container flex shrink-0 flex-row items-center justify-between py-6 ">
        <Link href="/">
          <img
            src="/svgs/sancho1694.svg"
            alt="Sancho logo"
            width={isMobile ? 100 : 150}
          />
        </Link>
        <div className="flex shrink-0 items-center gap-3 text-nowrap text-sm font-bold">
          {!isMobile && (
            <div className="flex flex-row items-center gap-6">
              <Link
                href={'/'}
                className={`${
                  activeLink === `/${currentLocale}`
                    ? 'text-orange-500'
                    : 'text-gray-800'
                }`}
              >
                CIP
              </Link>

              <DRepMenu />

              <VoltaireMenu />
            </div>
          )}
          <div>
            {!isEnabled ? (
              <WalletConnectButton test_name={'header'} />
            ) : (
              <WalletInfoCard test_name={'header'} />
            )}
          </div>
          {!isMobile && (
            <NotificationDrawer />
          )}
          {isMobile && (
            <div
              className="cursor-pointer"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <img src="/svgs/drawer-icon.svg" alt="Drawer" />
            </div>
          )}
          {isMobileDrawerOpen && (
            <SliderMenu
              isOpen={isMobileDrawerOpen}
              handleClose={() => setIsMobileDrawerOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
