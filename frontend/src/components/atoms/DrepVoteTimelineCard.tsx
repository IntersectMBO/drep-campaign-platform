import { urls } from '@/constants';
import { convertString } from '@/lib';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Box } from '@mui/material';
import axios from 'axios';

const VoteStatusChip = ({ date, vote }: { date: string; vote: string }) => {
  const [bgcolor, setBgColor] = useState('complementary-100');

  useEffect(() => {
    if (vote === 'No') setBgColor('bg-red-100');
    else if (vote === 'Yes') setBgColor('bg-green-100');
    else if (vote === 'Abstain') setBgColor('bg-complementary-100');
  }, []);
  return (
    <div className="flex flex-row items-center justify-between">
      <div
        className={`flex w-fit flex-row items-center gap-1 rounded-full ${bgcolor} px-2 py-1 text-sm`}
      >
        <img src="/svgs/file-check.svg" className="h-5 w-5" alt="Vote icon" />
        <p>{vote}</p>
      </div>
      <p className="text-sm">{new Date(date).toLocaleDateString('en-GB')}</p>
    </div>
  );
};
const DrepVoteTimelineCard = ({ item }: { item: any }) => {
  const [govActionName, setGovActionName] = useState(null);

  useEffect(() => {
    const title = item?.metadata?.body?.title;
    if (title) {
      setGovActionName(title);
      return;
    }
    axios
      .get(item.url)
      .then((response) => {
        setGovActionName(response?.data?.body?.title);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [govActionName]);

  let actionDetais: { imgSrc: string; actionName: string } = {
    imgSrc: '/svgs/exchange.svg',
    actionName: '',
  };

  switch (true) {
    case item?.description?.tag.includes('ParameterChange'):
      actionDetais = {
        imgSrc: '/svgs/exchange.svg',
        actionName: 'Protocol Parameter Changes',
      };
      break;
    case item?.description?.tag.includes('InfoAction'):
      actionDetais = {
        imgSrc: '/svgs/info-circle.svg',
        actionName: 'Info',
      };
      break;
    case item?.description?.tag.includes('HardForkInitiation'):
      actionDetais = {
        imgSrc: '/svgs/status-change.svg',
        actionName: 'Hard-Fork Initiation',
      };
      break;
    case item?.description?.tag.includes('newconstitution'):
      actionDetais = {
        imgSrc: '/svgs/notebook.svg',
        actionName: 'New Constitution or Guardrails Script',
      };
      break;
    case item?.description?.tag.includes('updatecommittee'):
      actionDetais = {
        imgSrc: '/svgs/users-group.svg',
        actionName: 'Update committee and/or threshold and/or terms',
      };
      break;
  }

  return (
    <Box
      id="epoch-card"
      className="flex w-full flex-col gap-3 rounded-xl bg-white p-3 shadow-lg"
    >
      <VoteStatusChip date={item?.time_voted} vote={item?.vote} />
      <hr />
      <Box className="flex flex-col gap-3">
        <Box>
          <p className="overflow-hidden text-ellipsis text-sm font-bold">
            {govActionName ? govActionName : '-'}
          </p>
        </Box>

        {actionDetais.actionName !== '' && (
          <Box>
            <Box
              className={`flex w-fit items-center gap-2 rounded-full bg-slate-200 p-1 px-3 py-1 text-sm`}
            >
              <img
                src={actionDetais.imgSrc}
                alt={`${actionDetais.actionName} icon`}
                className="h-5 w-5"
              />
              <p>{actionDetais.actionName}</p>
            </Box>
          </Box>
        )}

        <Box className="flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm">
          <p className="">Action ID:</p>
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
        </Box>
      </Box>
      <Box className="flex flex-col gap-1">
        <p className="text-sm">View Governance Action:</p>
        <Box className="ml-2 flex flex-col gap-1">
          <Link
            href={`${urls.govToolUrl}/governance_actions/${item?.gov_action_proposal_id}#0`}
            target="_blank"
            className="text-sm text-blue-800"
          >
            Cardano Govtool
          </Link>
          <Link
            href={`${urls.adaStatusUrl}/governances/${item?.gov_action_proposal_id}`}
            target="_blank"
            className="text-sm text-blue-800"
          >
            Ada Status
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default DrepVoteTimelineCard;
