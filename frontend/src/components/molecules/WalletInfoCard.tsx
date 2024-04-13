import { Box, Button, Typography } from "@mui/material";

import { useCardano } from "@/context/walletContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './MoleculeStyles.css'
export const WalletInfoCard = () => {
  const { address, disconnectWallet } = useCardano();
  const onClickDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    address && (
      <Box
      data-testId='wallet-info-card'
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
        <Typography sx={{ color: "#ADAEAD", fontSize: 12, fontWeight: 500 }}>
          Connected Wallet
        </Typography>
        <Box sx={{ alignItems: "center", display: "flex" }}>
          <Typography
          className="walletAddrText"
           
          >
            {address}
          </Typography>
          <Button
            data-testid={"disconnect-button"}
            variant="text"
            onClick={onClickDisconnect}
            
            className="disconnect-btn"
          >
            <FontAwesomeIcon icon={faTimes} size="xl"/>
          </Button>
        </Box>
      </Box>
    )
  );
};
