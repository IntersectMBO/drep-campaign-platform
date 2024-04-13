import {Box, Typography} from "@mui/material";
import {useMemo} from "react";
import {ModalContents, ModalHeader, ModalWrapper} from "../atoms"
import type {WalletOption} from "../molecules";
import {WalletOptionButton} from "../molecules";
import './OrgStyles.css'

export function ChooseWalletModal({handleClose}) {
    const walletOptions: WalletOption[] = useMemo(() => {
        if (!window.cardano) return [];
        const keys = Object.keys(window.cardano);
        const resultWallets: WalletOption[] = [];
        keys.forEach((k: string) => {
            const {icon, name, supportedExtensions} = window.cardano[k];
            if (icon && name && supportedExtensions) {
                // Check if the name already exists in resultWallets
                const isNameDuplicate = resultWallets.some(
                    (wallet) => wallet.label === name
                );
                // Check if the supportedExtensions array contains an entry with cip === 95
                const isCip95Available = Boolean(
                    supportedExtensions?.find((i) => i.cip === 95)
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
        <ModalWrapper dataTestId="connect-your-wallet-modal" onClose={handleClose}>
            <ModalHeader>Connect Your Wallet</ModalHeader>
            <ModalContents>
                <Typography
                    className="chooseWalletText"
                >
                    Choose Wallet
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "500px",
                        overflow: "auto",
                        width: "100%",
                        padding: "8px",
                    }}
                >
                    {!walletOptions.length ? (
                        <Typography
                            color="primary"
                            variant="body2"
                            className="walletNoOptionsText"
                        >
                            No wallets to Connect
                        </Typography>
                    ) : (
                        walletOptions.map(({icon, label, name, cip95Available}) => {
                            return (
                                <WalletOptionButton
                                    dataTestId={name + "-wallet-button"}
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
