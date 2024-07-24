import { urls } from '@/constants';
import { convertString } from '@/lib';
import Link from 'next/link';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const VoteStatusChip = ({ date }: { date: string }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-purple-500 px-3 py-1 text-sm">
        <img src="/svgs/file-check.svg" alt="" />
        <p>Voted</p>
      </div>
      <p>{new Date(date).toLocaleDateString('en-GB')}</p>
    </div>
  );
};
const DrepVoteTimelineCard = ({ item }: { item: any }) => {
  return (
    <div id='epoch-card' className="flex max-w-md flex-col gap-3 rounded-xl bg-white p-3 shadow-lg">
      <VoteStatusChip date={item.time_voted} />
      <hr />
      <div className="flex max-w-52 flex-col gap-1">
        <p className="text-lg font-bold">
          For {item?.description?.tag || null}
        </p>
        <p className="text-sm">Governance Action ID:</p>
        <div className="flex gap-1 w-fit items-center rounded-full border px-3 py-1 text-sm">
          <p>{convertString(item?.gov_action_proposal_id, true) || null}</p>
          <CopyToClipboard
            text={item?.gov_action_proposal_id}
            onCopy={() => {
              console.log('copied!');
            }}
            className="clipboard-text cursor-pointer"
          >
            <img src="/svgs/copy.svg" alt="copy" />
          </CopyToClipboard>
        </div>
      </div>
      <Link
        href={`${urls.govToolUrl}/governance_actions/${item?.gov_action_proposal_id}`}
        target="_blank"
        className="text-blue-800"
      >
        View Governance Action
      </Link>
    </div>
  );
};

export default DrepVoteTimelineCard;
