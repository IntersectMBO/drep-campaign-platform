import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import './Modal.css';

interface Props {
  variant?: 'modal' | 'popup';
  onClose?: () => void;
  hideCloseButton?: boolean;
  children: React.ReactNode;
  dataTestId?: string;
  sx?: any;
}

export function ModalWrapper({
  children,
  onClose,
  variant = 'modal',
  hideCloseButton = false,
  dataTestId = 'modal',
  sx,
}: Props) {
  useEffect(() => {
    if (variant === 'modal') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [variant]);
  return (
    <BaseWrapper
      className={`fixed left-1/2 top-1/2 flex max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-stone-50 shadow-lg  ${variant}-variant z-50`}
      data-testid={dataTestId}
      sx={sx}
    >
      {variant !== 'popup' && !hideCloseButton && (
        <div className="absolute right-6 top-6 cursor-pointer ">
          <img
            data-testid={'close-modal-button'}
            src="/close.svg"
            onClick={onClose}
          />
        </div>
      )}
      {children}
    </BaseWrapper>
  );
}

export const BaseWrapper = styled('div')`
  /* Styles moved to CSS file, no changes needed here */
`;
