import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { ModalContents, ModalHeader, ModalWrapper } from '../atoms';
import type { WalletOption } from '../molecules';
import { WalletOptionButton } from '../molecules';
import { useDRepContext } from '@/context/drepContext';
export function ChooseWalletModal() {
  const { setIsWalletListModalOpen } = useDRepContext();
  const walletOptions: WalletOption[] = useMemo(() => {
    if (!window.cardano) return [];
    const keys = Object.keys(window.cardano);
    const resultWallets: WalletOption[] = [];
    keys.forEach((k: string) => {
      const { icon, name, supportedExtensions } = window.cardano[k];
      if (icon && name && supportedExtensions) {
        // Check if the name already exists in resultWallets
        const isNameDuplicate = resultWallets.some(
          (wallet) => wallet.label === name,
        );
        // Check if the supportedExtensions array contains an entry with cip === 95
        const isCip95Available = Boolean(
          supportedExtensions?.find((i) => i.cip === 95),
        );
        // If the name is not a duplicate and cip === 95 is available, add it to resultWallets
        if (!isNameDuplicate && isCip95Available) {
          resultWallets.push({
            icon,
            label: name,
            name: k,
            cip95Available: true,
          });
        }
      }
    });
    return resultWallets;
  }, [window]);

  return (
    <ModalWrapper
      dataTestId="connect-your-wallet-modal"
      onClose={() => setIsWalletListModalOpen(false)}
    >
      <ModalHeader>Connect Your Wallet</ModalHeader>
      <ModalContents>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Choose Wallet
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
          {!walletOptions.length ? (
            <Typography
              color="primary"
              variant="body2"
              className="text-center font-semibold text-blue-800"
              data-testid="no-wallets-message"
            >
              No wallets to Connect
            </Typography>
          ) : (
            walletOptions.map(({ icon, label, name, cip95Available }) => {
              return (
                <WalletOptionButton
                  dataTestId={name + '-wallet-button'}
                  key={name}
                  icon={icon}
                  label={label}
                  name={name}
                  cip95Available={cip95Available}
                />
              );
            })
          )}
        </Box>
      </ModalContents>
    </ModalWrapper>
  );
}
