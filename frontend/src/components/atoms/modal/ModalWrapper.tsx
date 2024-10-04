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
      data-testid={dataTestId}
      sx={sx}
      variant={variant}
    >
      {variant !== 'popup' && !hideCloseButton && (
        <div className="absolute right-6 top-6 cursor-pointer ">
          <img
            data-testid={'close-modal-button'}
            src="/svgs/close.svg"
            onClick={onClose}
           alt='modal close icon' />
        </div>
      )}
      {children}
    </BaseWrapper>
  );
}

export const BaseWrapper = styled("div")<Pick<Props, "variant">>`
  box-shadow: 1px 2px 11px 0px #00123d5e;
  max-height: 90vh;
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  z-index: 99999;
  flex-direction: column;
  background: #fbfbff;
  border-radius: 24px;
  transform: translate(-50%, -50%);

  ${({ variant }) => {
    if (variant === "modal") {
      return `
        width: 80vw;
        max-width: 510px;
        padding: 52px 24px 34px 24px;
      `;
    }
    if (variant === "popup") {
      return `
        width: 320px;
        height: 320px;
      `;
    }
  }}
`;
