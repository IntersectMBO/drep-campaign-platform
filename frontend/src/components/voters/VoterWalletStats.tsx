import React, { useState } from 'react';
import { Skeleton, Box, Typography, IconButton, Tooltip } from '@mui/material';
import StatusChip from '../atoms/StatusChip';
import { convertString, formattedAda } from '@/lib';
import CopyToClipBoardIcon from '../atoms/svgs/CopyToClipBoardIcon';
import { VoterData } from '../../../types/api';

type VoterWalletStatsProps = {
  voterData: VoterData;
  isVoterDataLoading: boolean;
};

const VoterWalletStats = ({
  voterData,
  isVoterDataLoading,
}: VoterWalletStatsProps) => {
  const [isAddressHovered, setIsAddressHovered] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voterData?.stake_address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Delegation information
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box>
          <Typography variant="body2">Live Stake</Typography>
          {isVoterDataLoading ? (
            <Skeleton width={200} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
              onMouseEnter={() => setIsAddressHovered(true)}
              onMouseLeave={() => setIsAddressHovered(false)}
            >
              <Typography variant="h6">
                {convertString(voterData?.stake_address, false)}
              </Typography>
              {isAddressHovered && (
                <Tooltip title={copiedAddress ? 'Copied!' : 'Copy address'}>
                  <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }}>
                    <CopyToClipBoardIcon width={18} height={18} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
          {isVoterDataLoading ? (
            <Skeleton width={150} height={60} />
          ) : (
            <Typography variant="h3">
              {voterData?.total_stake
                ? `₳ ${formattedAda(voterData?.total_stake, 2)}`
                : '-'}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Status
          </Typography>
          {isVoterDataLoading ? (
            <Skeleton width={100} height={32} />
          ) : (
            <StatusChip
              status={voterData?.isDelegated ? 'Delegated' : 'Not Delegated'}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VoterWalletStats;
