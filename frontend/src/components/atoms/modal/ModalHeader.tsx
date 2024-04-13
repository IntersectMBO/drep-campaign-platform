import Typography from "@mui/material/Typography";
import type { SxProps } from "@mui/system";
import './Modal.css'
interface Props {
  children: React.ReactNode;
  sx?: SxProps;
}

export function ModalHeader({ children, sx }: Props) {
  return (
    <Typography
      className='modalHeader'
      sx={sx}
      
    >
      {children}
    </Typography>
  );
}
