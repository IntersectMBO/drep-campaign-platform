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
    <BaseWrapper className={`base-wrapper ${variant}-variant z-[999]`} data-testid={dataTestId} sx={sx}>
      {variant !== "popup" && !hideCloseButton && (
        <FontAwesomeIcon
          className="close-button"
          size="xl"
          data-testid={"close-modal-button"}
          icon={faTimes}
          onClick={onClose}
        />
      )}
      {children}
    </BaseWrapper>
  );
}

export const BaseWrapper = styled("div")`
  /* Styles moved to CSS file, no changes needed here */
`;

export const CloseButton = styled("img")`
  /* Styles moved to CSS file, no changes needed here */
`;
