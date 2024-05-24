import { FC, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useCardano } from '@/context/walletContext';
import './MoleculeStyles.css';
export interface WalletOption {
  icon: string;
  label: string;
  name: string;
  cip95Available: boolean;
  dataTestId?: string;
}

export const WalletOptionButton: FC<WalletOption> = ({ ...props }) => {
  const { enable, isEnableLoading } = useCardano();

  const { dataTestId, icon, label, name, cip95Available } = props;

  const enableByWalletName = useCallback(async () => {
    if (isEnableLoading) return;
    const result = await enable(name);
  }, [enable, isEnableLoading]);

  return (
    <Box
      data-testid={dataTestId}
      sx={{
        alignItems: 'center',
        border: isEnableLoading ? 'none' : `1px solid blue`,
        bgcolor: isEnableLoading ? '#EAE9F0' : 'white',
        borderRadius: '100px',
        boxShadow: isEnableLoading ? undefined : '0px 0px 11px 0px #24223230',
        boxSizing: 'border-box',
        cursor: cip95Available
          ? isEnableLoading
            ? 'default'
            : 'pointer'
          : 'unset',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '12px 13px 12px 13px',
        transition: 'background .2s',
        position: 'relative',
        width: '100%',
        '&:hover': isEnableLoading
          ? undefined
          : {
              background: 'blue',
            },
      }}
      key={name}
      onClick={enableByWalletName}
    >
      <img
        alt={`${name} icon`}
        src={icon}
        className={`max-h-6 max-w-6 ${isEnableLoading && 'grayscale filter'}`}
      />
      <Typography
        className={`text-lg font-medium text-blue-800 ${isEnableLoading && 'text-gray-300'}`}
      >
        {name ?? label}
      </Typography>
      <div className="max-h-6 max-w-6" />
      {isEnableLoading === name && (
        <Box
          position="absolute"
          left={0}
          right={0}
          display="flex"
          justifyContent="center"
        >
          <CircularProgress size={26} />
        </Box>
      )}
    </Box>
  );
};
