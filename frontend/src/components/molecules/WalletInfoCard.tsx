import { Box, Button, Typography } from "@mui/material";

import { useCardano } from "@/context/walletContext";
import './MoleculeStyles.css'
export const WalletInfoCard = () => {
  const { address, disconnectWallet } = useCardano();
  const onClickDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    address && (
      <Box
      data-testid='wallet-info-card'
        sx={{
          border: 1,
          borderColor: "lightBlue",
          borderRadius: 3,
          px: 1.75,
          py: 1.5,
          position: "relative",
          width:'200px'
        }}
      >
        <Typography className="text-wall-info-txt-color text-sm font-medium">
          Connected Wallet
        </Typography>
        <Box sx={{ alignItems: "center", display: "flex", justifyContent:'space-between' }}>
          <Typography  
          className="flex-1 text-sm font-normal overflow-hidden overflow-ellipsis"
          >
            {address}
          </Typography>
          <Button
            data-testid={"disconnect-button"}
            variant="text"
            onClick={onClickDisconnect}
            className="flex w-[1px] justify-end"
          >
            <img 
            src="/close.svg"
            alt="Close Icon"

            />
          </Button>
        </Box>
      </Box>
    )
  );
};
