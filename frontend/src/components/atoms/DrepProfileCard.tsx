import React from 'react';
import Button from './Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Typography, Skeleton } from '@mui/material';
import Link from 'next/link';
import { convertString } from '@/lib';
import { useScreenDimension } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useCardano } from '@/context/walletContext';

interface StatusProps {
  status:
    | 'Verified'
    | 'Unverified'
    | 'Claimed'
    | 'Active'
    | 'Inactive'
    | 'Not claimed';
}
const StatusChip = ({ status }: StatusProps) => {
  let statusClass = '';
  switch (status) {
    case 'Verified':
      statusClass = 'bg-blue-800 text-white';
      break;
    case 'Unverified':
      statusClass = 'bg-gray-800 text-white';
      break;
    case 'Not claimed':
      statusClass = 'bg-orange-500 text-white';
      break;
    case 'Claimed':
      statusClass = 'bg-teal-100 text-zinc-800';
      break;
    case 'Active':
      statusClass = 'bg-teal-100 text-zinc-800';
      break;
    case 'Inactive':
      statusClass = 'bg-gray-800 text-white';
      break;
    default:
      statusClass = 'bg-gray-800 text-white'; // Default to gray if status is not recognized
  }

  return (
    <div
      className={`text-nowrap rounded-full px-2 py-1 text-center text-sm font-normal ${statusClass}`}
    >
      {status}
    </div>
  );
};

const DrepProfileCard = ({ drep, state }: { drep: any; state: boolean }) => {
  const { isMobile } = useScreenDimension();
  const { dRepIDBech32 } = useCardano();
  const router = useRouter()
  return (
    <div className="flex w-full flex-col gap-5 bg-white bg-opacity-50 px-5 py-10">
      <div className="flex max-w-52 items-center justify-center rounded-md">
        {state ? (
          <Skeleton
            animation={'wave'}
            variant="circular"
            width={150}
            height={150}
          />
        ) : (
          <img
            className="w-full"
            src={`${drep?.attachment_url ? drep.attachment_url : '/svgs/user-circle.svg'}`}
            alt=""
          />
        )}
      </div>
      <div>
        <Typography variant="h4">
          {state ? (
            <Skeleton
              animation={'wave'}
              variant="text"
              width={200}
              height={50}
            />
          ) : (
            drep &&
            (drep?.drep_name
              ? drep.drep_name
              : drep?.cexplorerDetails?.view &&
                convertString(drep?.cexplorerDetails?.view, isMobile))
          )}
        </Typography>
      </div>
      <div className="flex flex-row gap-2">
        <StatusChip status="Active" />
        <StatusChip status="Verified" />
      </div>
      <div>
        <Typography variant="h6">Voting power</Typography>
        <p className="flex items-center gap-3 font-normal">
          ₳{' '}
          {state ? (
            <Skeleton animation={'wave'} width={50} height={20} />
          ) : (
            drep?.cexplorerDetails?.amount || 0
          )}
        </p>
      </div>
      <div>
        <Typography variant="h6">Total delegation</Typography>
        <p>
          {' '}
          {state ? (
            <Skeleton animation={'wave'} width={100} height={20} />
          ) : (
            `${drep?.cexplorerDetails?.delegation_vote_count || 0} ${drep?.cexplorerDetails?.delegation_vote_count > 1 ? 'Delegators' : 'Delegator'}`
          )}
        </p>
      </div>
      <div className="flex w-fit flex-row gap-2 rounded-full border border-blue-100 px-4 py-2">
        <p className="flex w-full items-center gap-3 ">
          ID{' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.cexplorerDetails?.view &&
            convertString(drep?.cexplorerDetails?.view, true)
          )}
        </p>
        <CopyToClipboard
          text={drep?.cexplorerDetails?.view}
          onCopy={() => {
            console.log('copied!');
          }}
          className="clipboard-text cursor-pointer"
        >
          <img src="/svgs/copy.svg" alt="copy" />
        </CopyToClipboard>
      </div>
      <div className="flex flex-row gap-2">
        <Link href={drep ? drep?.drep_social?.github || '#' : '#'}>
          <img className="w-full" src="/svgs/github-dark.svg" alt="" />
        </Link>
        <Link href={drep ? drep?.drep_social?.x || '#' : '#'}>
          <img className="w-full" src="/svgs/twitter.svg" alt="" />
        </Link>
        <Link href={drep ? drep?.drep_social?.facebook || '#' : '#'}>
          <img className="w-full" src="/svgs/fb-dark.svg" alt="" />
        </Link>
        <Link href={drep ? drep?.drep_social?.instagram || '#' : '#'}>
          <img className="w-full" src="/svgs/ig-dark.svg" alt="" />
        </Link>
      </div>
      <div>
        <Typography variant="h6">Bio</Typography>
        <p>
          {' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.drep_bio || 'Empty'
          )}
        </p>
      </div>
      <div>
        <Typography variant="h6">Statement</Typography>
        <p>
          {' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.drep_platform_statement || 'Empty'
          )}
        </p>
      </div>
      <div>
        <Typography variant="h6">Metadata</Typography>
        <p>None</p>
      </div>
      {(drep?.cexplorerDetails?.view == dRepIDBech32 ||
        drep?.signature_drepVoterId == dRepIDBech32) && (
        <div className="flex max-w-prose flex-col gap-2">
          <Button>Set up Metadata</Button>
          <Button
            variant="outlined"
            bgColor="transparent"
            handleClick={() => {
              router.push(`/dreps/workflow/profile/update/step1`);
            }}
          >
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default DrepProfileCard;
