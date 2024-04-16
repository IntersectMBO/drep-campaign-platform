import React from "react";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './Modal.css'

interface Props {
  variant?: "modal" | "popup";
  onClose?: () => void;
  hideCloseButton?: boolean;
  children: React.ReactNode;
  dataTestId?: string;
  sx?: any;
}

export function ModalWrapper({
  children,
  onClose,
  variant = "modal",
  hideCloseButton = false,
  dataTestId = "modal",
  sx,
}: Props) {

  return (
    <BaseWrapper className={`fixed shadow-lg max-h-[90vh] top-1/2 left-1/2 flex flex-col bg-base-wrapper-bg-color rounded-md -translate-x-1/2 -translate-y-1/2  ${variant}-variant z-50`} data-testid={dataTestId} sx={sx}>
      {variant !== "popup" && !hideCloseButton && (
        <div className="cursor-pointer absolute top-6 right-6 ">
          <img         
          data-testid={"close-modal-button"}
          src="/close.svg"
          onClick={onClose}
        />
        </div>
        
      )}
      {children}
    </BaseWrapper>
  );
}

export const BaseWrapper = styled("div")`
  /* Styles moved to CSS file, no changes needed here */
`;
