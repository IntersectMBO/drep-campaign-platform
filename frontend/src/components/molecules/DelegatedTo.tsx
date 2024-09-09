import { useCardano } from '@/context/walletContext';
import { useGetAdaHolderCurrentDelegationQuery } from '@/hooks/useGetAdaHolderCurrentDelegationQuery';
import { useGetSingleDRepViaVoterIdQuery } from '@/hooks/useGetSingleDRepViaVoterIdQuery';
import { formattedAda, handleCopyText, shortenAddress } from '@/lib';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ViewDRepTableBtn from './ViewDRepTableButton';
import Button from '../atoms/Button';
import Link from 'next/link';
import CopyToClipBoardIcon from '../atoms/svgs/CopyToClipBoardIcon';

type DelegatedToProps = {
  className?: string;
};

export const DelegatedTo = ({ className }: DelegatedToProps) => {
  const { stakeKey } = useCardano();
  const { currentDelegation } = useGetAdaHolderCurrentDelegationQuery(stakeKey);
  const { DRep } = useGetSingleDRepViaVoterIdQuery(
    currentDelegation?.drep_view,
  );

  return (
    <Box
      className={`flex flex-col space-y-2 bg-blue-800 px-3 py-3 text-white md:px-3 ${className}`}
    >
      <Box className="flex w-full justify-start">
        <Typography
          fontSize="0.85rem"
          fontWeight={500}
          className="w-auto rounded-3xl bg-gray-800 px-2 py-1"
        >
          {!!currentDelegation?.drep_view ? 'Delegating' : 'Not Delegating'}
        </Typography>
      </Box>
      <Box>
        {currentDelegation && DRep && (
          <>
            <Box>
              {/* Disabled due to model changes */}
              {/* <Typography fontSize="0.85rem" fontWeight={600}>
                Delegated to: {DRep?.drep_name ? `(${DRep.drep_name})` : ''}
              </Typography> */}
              <Typography fontSize="0.85rem" fontWeight={600}>
                Delegated
              </Typography>
              <Box className="flex items-center overflow-hidden text-gray-300">
                <Link href={`/dreps/${currentDelegation?.drep_view}`}>
                  <Typography fontSize="0.75rem" fontWeight={600}>
                    {shortenAddress(currentDelegation?.drep_view, 12)}
                  </Typography>
                </Link>
                <Tooltip title="Copy DRep ID">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyText(currentDelegation?.drep_view)}
                  >
                    <CopyToClipBoardIcon
                      color="#d1d5db"
                      width={14}
                      height={14}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box>
              <Typography fontSize="0.85rem" fontWeight={600}>
                Voting Power
              </Typography>

              <Typography
                fontSize="0.75rem"
                fontWeight={600}
                className="overflow-hidden text-gray-300"
              >
                ₳ {formattedAda(DRep?.cexplorerDetails?.amount, 2)}
              </Typography>
            </Box>
          </>
        )}
        {!currentDelegation && (
          <Box className="space-y-2">
            <Box className="space-y-1">
              <Typography
                fontSize="0.75rem"
                fontWeight={600}
                className="w-full text-wrap tracking-wide text-gray-300"
              >
                You have not yet delegated to a DRep, consider selecting one on
                the GovTool website.
              </Typography>
            </Box>
            <Box className="flex justify-end">
              <Link href="/dreps/list">
                <ViewDRepTableBtn size="small"></ViewDRepTableBtn>
              </Link>
            </Box>
          </Box>
        )}
      </Box>
      {currentDelegation && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: 'white',
            borderColor: 'white',
          }}
        >
          View Profile
        </Button>
      )}
    </Box>
  );
};
