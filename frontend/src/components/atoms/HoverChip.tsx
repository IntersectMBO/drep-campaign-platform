import { useState } from 'react';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from '@emotion/styled';

interface HoverChipProps {
  icon?: string;
  text?: string;
  handleClick?: () => void;
  position?: 'top' | 'bottom';
  textToCopy?: string;
  children?: React.ReactElement;
}

const HoverChip = ({
  icon,
  text,
  handleClick,
  position = 'top',
  textToCopy,
  children,
}: HoverChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip
      title={text}
      placement={position === 'top' ? 'top' : 'bottom'}
      arrow
      onClick={handleClick}
      className="cursor-pointer"
      enterDelay={100}
      leaveDelay={100}
    >
      {children}
    </Tooltip>
  );
};

export default HoverChip;

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({});
export { HtmlTooltip };
