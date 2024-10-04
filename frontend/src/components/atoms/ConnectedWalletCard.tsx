import { useCardano } from '@/context/walletContext';
import { useScreenDimension } from '@/hooks';
import { formattedAda, shortenAddress } from '@/lib';
import { Box, Typography } from '@mui/material';

export const ConnectedWalletCard = () => {
  const { address, walletState } = useCardano();
  const { isMobile } = useScreenDimension();
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      className="divide-x-2 divide-white text-white"
    >
      <Box alignItems="center" display="flex" className="px-1">
        {!isMobile ? (
          <Typography
            fontSize="0.75rem"
            fontWeight={300}
            marginRight="0.125rem"
            className="mr-1 text-xs tracking-wide"
          >
            Wallet:
          </Typography>
        ) : (
          <div className="mr-1">
            <img src="/svgs/wallet.svg" alt="wallet icon" />
          </div>
        )}
        {address && (
          <Typography
            fontWeight={600}
            fontSize="0.75rem"
            className="text-xs uppercase tracking-wide text-gray-300"
          >
            {shortenAddress(address, 5)}
          </Typography>
        )}
      </Box>
      <Box alignItems="center" display="flex" className="px-1">
        {!isMobile && (
          <Typography
            fontWeight={300}
            fontSize="0.75rem"
            marginRight="0.25rem"
            className="mr-1 text-xs tracking-wide"
          >
            Voting Power:
          </Typography>
        )}
        {walletState.balance && (
          <Typography
            fontWeight={600}
            fontSize="0.75rem"
            className="text-xs tracking-wide text-gray-300"
          >
            ₳ {formattedAda(walletState.balance, 2)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
