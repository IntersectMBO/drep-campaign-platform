import { urls } from '@/constants';
import { useGetProposalsQuery } from '@/hooks/useGetProposalByHashQuery';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const SubmittedChip = ({ date }: { date: string }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex w-fit rounded-full bg-blue-800 px-3 py-1 text-white">
        <p className="text-xs font-light">Submitted a Governance Action</p>
      </div>
      <p>
        {date
          ? new Date(date).toLocaleDateString('en-GB')
          : new Date().toLocaleDateString('en-GB')}
      </p>
    </div>
  );
};
const SkeletonLoader = () => (
  <div className="flex max-w-md animate-pulse flex-col gap-3 rounded-xl border-2 bg-white p-3 shadow-xl">
    <div className="h-6 w-3/4 rounded bg-gray-200"></div>
    <hr />
    <div className="h-10 w-1/4 rounded bg-gray-200"></div>
    <div className="h-6 w-1/2 rounded bg-gray-200"></div>
    <div className="h-4 w-1/3 rounded bg-gray-200"></div>
  </div>
);
const NotFoundState = () => (
  <div className="flex max-w-md flex-col gap-3 rounded-xl border-2 border-red-300 bg-white p-3 shadow-xl">
    <p className="text-lg font-medium text-red-500">Proposal not found</p>
  </div>
);

const ViewActionLink = ({ hash }: { hash: string }) => (
  <Link
    href={`${urls.govToolUrl}/governance_actions/${hash}#0`}
    target="_blank"
    className="text-sm text-blue-800"
  >
    View Governance Action
  </Link>
);

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DrepGovActionSubmitCard = ({
  actionTypeParam = '',
  hash = '',
  item,
}: {
  actionTypeParam?: string;
  hash?: string;
  item?: any;
}) => {
  const [cardData, setCardData] = useState(item);
  const [actionType, setActionType] = useState(actionTypeParam);
  const { Proposals, isProposalsLoading } =
    useGetProposalsQuery({
      hashQueryString: hash,
    });

  useEffect(() => {
    if (Proposals) {
      setCardData(Proposals[0]);
      setActionType(Proposals[0].description.tag.toLowerCase());
    }
  }, [Proposals]);

  let style: any = {
    borderColor: 'border-[#D19471]',
    bgColor: 'bg-[#D19471]',
    imgSrc: '/svgs/exchange.svg',
    actionName: '',
  };

  switch (true) {
    case actionType.includes('protocolparameter'):
      style = {
        borderColor: 'border-[#D19471]',
        bgColor: 'bg-[#D19471]',
        imgSrc: '/svgs/exchange.svg',
        actionName: 'Protocol Parameter Changes',
      };
      break;
    case actionType.includes('info'):
      style = {
        borderColor: 'border-[#BB7AEE]',
        bgColor: 'bg-[#BB7AEE]',
        imgSrc: '/svgs/info-circle.svg',
        actionName: 'Info',
      };
      break;
    case actionType.includes('hardfork'):
      style = {
        borderColor: 'border-[#A3D96C]',
        bgColor: 'bg-[#A3D96C]',
        imgSrc: '/svgs/status-change.svg',
        actionName: 'Hard-Fork Initiation',
      };
      break;
    case actionType.includes('newconstitution'):
      style = {
        borderColor: 'border-[#D96CAE]',
        bgColor: 'bg-[#D96CAE]',
        imgSrc: '/svgs/notebook.svg',
        actionName: 'New Constitution or Guardrails Script',
      };
      break;
    case actionType.includes('updatecommittee'):
      style = {
        borderColor: 'border-[#6FDF8E]',
        bgColor: 'bg-[#6FDF8E]',
        imgSrc: '/svgs/users-group.svg',
        actionName: 'Update committee and/or threshold and/or terms',
      };
      break;
    default:
      style = {
        borderColor: 'border-[#6FDF8E]',
        bgColor: 'bg-[#6FDF8E]',
        imgSrc: '/svgs/users-group.svg',
        actionName: capitalizeFirstLetter(actionType),
      };
      break;
  }

  if (isProposalsLoading) {
    return <SkeletonLoader />;
  }

  if (!cardData) {
    return <NotFoundState />;
  }

  return (
    <div
      id="epoch-card"
      className={`flex max-w-md flex-col gap-3 rounded-xl border-2 bg-white p-3 shadow-xl ${style.borderColor}`}
    >
      <SubmittedChip date={cardData?.prop_inception_time} />
      <hr />
      <div className="flex flex-col gap-1">
        <div className={`rounded-full p-1 ${style.bgColor} w-fit`}>
          <img src={style.imgSrc} alt="" className="h-5 w-5" />
        </div>
        <p className="text-wrap text-lg font-medium">{style.actionName}</p>
      </div>
      <ViewActionLink hash={hash} />
    </div>
  );
};

export default DrepGovActionSubmitCard;
