import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Skeleton,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  convertString,
} from '@/lib';
import Link from 'next/link';
import CopyToClipBoardIcon from '../atoms/svgs/CopyToClipBoardIcon';
import { useScreenDimension } from '@/hooks';
import { urls } from '@/constants';
import { VoterData } from '../../../types/api';

interface VoterDelegationHistoryProps {
  voterData: VoterData;
  isVoterDataLoading: boolean;
}

const VoterDelegationHistory: React.FC<VoterDelegationHistoryProps> = ({
  voterData,
  isVoterDataLoading,
}) => {
  const delegationHistory = voterData?.delegationHistory || [];
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isMobile, screenWidth } = useScreenDimension();

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isVoterDataLoading) {
    return (
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" gutterBottom>
          Voter Delegation History
        </Typography>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Skeleton width={'100%'} height={50} />
            <Skeleton width={'100%'} height={50} />
            <Skeleton width={'100%'} height={50} />
          </Box>
        ))}
      </Box>
    );
  }

  if (delegationHistory.length === 0) {
    return (
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" gutterBottom>
          Voter Delegation History
        </Typography>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No delegation history found.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="h5" gutterBottom>
        Voter Delegation History
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {delegationHistory.map((item: any, index: number) => (
              <TableRow
                key={index}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{
                  backgroundColor:
                    index === 0 ? 'rgba(255, 193, 157, 0.25)' : 'transparent',
                }}
              >
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ textWrap: 'nowrap' }}
                  >
                    {index === 0 && 'Current'} DRep
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">
                      <Link prefetch={false} href={`/dreps/${item.drep_id}`}>
                        {convertString(
                          item.drep_id,
                          isMobile || screenWidth < 1024,
                        )}
                      </Link>
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        right: 0,
                        display: hoveredRow === index ? 'flex' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip
                        title={
                          copiedId === item.drep_id ? 'Copied!' : 'Copy DRep ID'
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(item.drep_id)}
                          sx={{
                            ml: 1,
                            p: 0,
                            position: 'absolute',
                          }}
                        >
                          <CopyToClipBoardIcon width={18} height={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textWrap: 'nowrap',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Related Tx
                  </Typography>
                  <Link
                    prefetch={false}
                    href={`${urls.cexplorerUrl}/tx/${item.tx_hash}`}
                    target="_blank"
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {convertString(item.tx_hash, true)}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{
                          width: 30,
                        }}
                      >
                        <img src="/svgs/external-link.svg" alt="" />
                      </IconButton>
                    </Box>
                  </Link>
                </TableCell>
                <TableCell
                  sx={{
                    textWrap: 'nowrap',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Date of Delegation
                  </Typography>
                  <Typography>
                    {
                      new Date(item.time).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Epoch
                  </Typography>
                  <Typography>{item.delegation_epoch}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VoterDelegationHistory;
