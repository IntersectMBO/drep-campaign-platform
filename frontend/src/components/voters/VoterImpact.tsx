import { useGetVoterGovActionsQuery } from '@/hooks/useGetVoterGovActions';
import { Box, Paper, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DrepVoteTimelineCard from '../atoms/DrepVoteTimelineCard';
import GovActionLoader from '../Loaders/GovActionLoader';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import Pagination from '../molecules/Pagination';

const VoterImpact = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { voterId } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('page') || 1));
  }, [searchParams]);

  const convertAddressToBech32 = (address: string) => {
    if (
      address.includes('addr') ||
      address.includes('stake') ||
      address.includes('drep')
    ) {
      return address;
    } else return Address.from_bytes(Buffer.from(address, 'hex')).to_bech32();
  };

  const { voterGovActions, isVoterGovActionsLoading } =
    useGetVoterGovActionsQuery(
      convertAddressToBech32(voterId as string),
      currentPage,
    );

  return (
    <Box className="flex flex-col gap-6">
      <Typography variant="h4" fontWeight="bold">
        Your DReps' Governance Contributions{' '}
      </Typography>
      <Typography className="px-2 leading-relaxed">
        This page displays all governance actions that have been voted on by
        DReps (Delegate Representatives) you have delegated to. It includes
        votes from DReps you've directly delegated to, as well as any predefined
        DRep options you may have selected. This comprehensive view helps you
        stay informed about how your chosen representatives are participating in
        the decision-making process.
      </Typography>
      {isVoterGovActionsLoading && (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 border-t border-green-400 py-6 lg:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <GovActionLoader />
            </li>
          ))}
        </ul>
      )}
      {!isVoterGovActionsLoading && !voterGovActions?.data?.length && (
        <Box sx={{ py: 3 }}>
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
              Your DRep(s) have not yet voted on governance actions.
            </Typography>
          </Paper>
        </Box>
      )}
      {!isVoterGovActionsLoading && voterGovActions?.data.length > 0 && (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 border-t border-green-400 py-6 lg:grid-cols-2 xl:grid-cols-3"
        >
          {voterGovActions &&
            voterGovActions?.data.length > 0 &&
            voterGovActions?.data.map((action) => (
              <li key={action?.vote_tx_hash}>
                <DrepVoteTimelineCard item={action} />
              </li>
            ))}
        </ul>
      )}
      {!isVoterGovActionsLoading &&
        voterGovActions?.data &&
        voterGovActions?.data.length > 0 && (
          <Box className="flex justify-end">
            <Pagination
              currentPage={voterGovActions.currentPage}
              totalPages={voterGovActions.totalPages}
              totalItems={voterGovActions.totalItems}
              dataType="Governance Actions"
            />
          </Box>
        )}
    </Box>
  );
};

export default VoterImpact;
