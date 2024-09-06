import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/system';
import './Modal.css';
interface Props {
  children: React.ReactNode;
  sx?: SxProps;
}

export function ModalHeader({ children, sx }: Props) {
  return (
    <Typography
      marginBottom="8px"
      fontSize="28px"
      fontWeight="500"
      textAlign="center"
      sx={sx}
    >
      {children}
    </Typography>
  );
}
