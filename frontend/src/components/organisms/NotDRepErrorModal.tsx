import { Box, Typography } from '@mui/material';
import { ModalContents, ModalHeader, ModalWrapper } from '../atoms';
import { useDRepContext } from '@/context/drepContext';
import Link from 'next/link';
import { urls } from '@/constants';
export function NotDRepErrorModal() {
  const { setIsNotDRepErrorModalOpen } = useDRepContext();

  return (
    <ModalWrapper
      dataTestId="not-drep-error-modal"
      onClose={() => setIsNotDRepErrorModalOpen(false)}
    >
      <ModalHeader
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img src="/svgs/warning.png" />
      </ModalHeader>
      <ModalContents>
        <Typography
          variant="h4"
          className="mb-6 text-center text-sm font-medium"
        >
          Oops
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '31.25rem',
            overflow: 'auto',
            width: '100%',
            padding: '0.5rem',
          }}
        >
          <Typography
            color="black"
            variant="subtitle1"
            className="text-center font-semibold text-black"
            data-testid="not-a-drep-message"
          >
            Unfortunately you cannot access this feature since you are not a
            DRep...yet.
          </Typography>
          <Typography
            color="dimgray"
            variant="subtitle2"
            className="text-center font-semibold text-black"
            data-testid="not-a-drep-message"
          >
            Wanna be a DRep? Checkout{' '}
            <Link href={urls.govToolUrl} className="text-blue-300">
              here{' '}
            </Link>
          </Typography>
        </Box>
      </ModalContents>
    </ModalWrapper>
  );
}
