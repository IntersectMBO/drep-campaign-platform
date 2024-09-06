import React from 'react';
import Button from './Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StatusChip from './StatusChip';
import Link from 'next/link';
import { Skeleton } from '@mui/material';
import { convertString } from '@/lib';

const DrepClaimProfileCard = ({
  drep,
  state,
}: {
  drep: any;
  state: boolean;
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white bg-opacity-50 px-5 py-10 ">
      <div className="flex max-w-52 items-center justify-center rounded-md">
        {state ? (
          <Skeleton animation={'wave'} variant="circular" width={150} height={150} />
        ) : (
          <img
            className="w-full"
            src={`${drep?.attachment_url ? drep.attachment_url : '/svgs/user-circle.svg'}`}
            alt=""
          />
        )}
      </div>
      <Button>Claim this profile</Button>
      <div className="flex flex-row gap-2">
        <StatusChip status="Not claimed" />
        <StatusChip status="Unverified" />
      </div>
      <div>
        <p className="font-bold">Voting power</p>
        <p className="flex items-center gap-3 font-normal">
          ₳{' '}
          {state ? (
            <Skeleton animation={'wave'} width={100} height={20} />
          ) : (
            drep?.cexplorerDetails?.amount || 0
          )}
        </p>
      </div>
      <div>
        <p className="font-bold">Total delegation</p>
        <p>
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            `${drep?.cexplorerDetails?.delegation_vote_count || 0} ${drep?.cexplorerDetails?.delegation_vote_count > 1 ? 'Delegators' : 'Delegator'}`
          )}
        </p>
      </div>
      <div className="flex flex-row gap-2 rounded-full border border-blue-100 px-5 py-2 w-fit">
        <p className="flex items-center gap-3 w-full">
          ID{' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            convertString(drep?.cexplorerDetails?.view || "", true)
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
        <p className="font-bold">Bio</p>
        <p>
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.drep_bio || 'Empty'
          )}
        </p>
      </div>
      <div>
        <p className="font-bold">Statement</p>
        <p>
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.drep_platform_statement || 'Empty'
          )}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button disabled>Set up Metadata</Button>
        <Button disabled variant="outlined" bgColor="transparent">
          Update Metadata
        </Button>
      </div>
    </div>
  );
};

export default DrepClaimProfileCard;
