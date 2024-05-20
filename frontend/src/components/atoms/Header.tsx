import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import WalletConnectButton from '@/components/molecules/WalletConnectButton';
import { WalletInfoCard } from '@/components/molecules';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDRepContext } from '@/context/drepContext';
import TranslationBlock from '../1694.io/TranslationBlock';

const navOptions = [
  {
    name: 'DReps',
    path: '/dreps',
  },
  {
    name: 'DRep List',
    path: '/dreps/list',
  },
  {
    name: 'Notes',
    path: '/dreps/notes',
  },
  {
    name: 'Ecosystem',
    path: '/ecosystem',
  },
];
const Header = () => {
  const { isEnabled } = useCardano();
  const { currentLocale, setIsMobileDrawerOpen } = useDRepContext();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    // Setting the active link based on the current pathname
    setActiveLink(pathname);
    setIsMobile(window.innerWidth < 768);
  }, [pathname]);
  //add event listener to the window to check if the screen is mobile
  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);
  return (
    <header className="bg-white bg-opacity-50 w-full">
      <div className="base_container flex shrink-0 flex-row items-center justify-between py-6 ">
        <Link href="/" className=" sm:w-1/2">
          <img
            src="/sancho1694.svg"
            alt="Sancho logo"
            width={ '40%'}
          />
        </Link>
        <div className="flex shrink-0 items-center gap-3 text-nowrap text-sm font-bold">
          {!isMobile && (
            <div className='flex flex-row gap-6'>
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
              {navOptions.slice(0, 1).map((option, index) => (
                <Link
                  key={index + option.name + option.path + option}
                  href={option.path}
                  className={`${
                    activeLink === `/${currentLocale}${option.path}`
                      ? 'text-orange-500'
                      : 'text-gray-800'
                  }`}
                >
                  {option.name}
                </Link>
              ))}
            </div>
          )}
          <div>
            {!isEnabled ? (
              <WalletConnectButton test_name={'header'} />
            ) : (
              <WalletInfoCard />
            )}
          </div>
          {!isMobile && (
            <div className="cursor-pointer">
              <img src="/bell.svg" alt="Notifs" />
            </div>
          )}
          {isMobile && (
            <div
              className="cursor-pointer"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <img src="/drawer-icon.svg" alt="Drawer" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header, navOptions}
