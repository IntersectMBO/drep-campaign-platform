'use client';
import { useScreenDimension } from '@/hooks';
import { ReactNode, useEffect, useState } from 'react';

export const Background = ({
  children,
  isReverted = false,
  opacity = 1,
}: {
  children: ReactNode;
  isReverted?: boolean;
  opacity?: number;
}) => {
  const {isMobile} = useScreenDimension();
  return (
    <>
      <img
        height={isMobile ? 600 : 'auto'}
        src="/img/bgorange.png"
        style={{
          bottom: isMobile ? -150 : isReverted ? 200 : -650,
          opacity: opacity,
          position: 'fixed',
          right: isMobile ? -250 : isReverted ? 450 : -650,
          zIndex: -10,
        }}
        width={isMobile ? 600 : 'auto'}
      />
      {children}
      <img
        height={isMobile ? 600 : 'auto'}
        src="/img/bgblue.png"
        style={{
          left: isMobile ? -250 : isReverted ? 400 : -400,
          opacity: opacity,
          position: 'fixed',
          top: isMobile ? -150 : isReverted ? 400 : -500,
          zIndex: -10,
        }}
        width={isMobile ? 600 : 'auto'}
      />
    </>
  );
};
