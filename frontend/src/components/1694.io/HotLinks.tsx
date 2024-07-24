import React from 'react';

interface HotLinksProps {
  seethrough?: boolean;
}
const HotLinks = ({ seethrough }: HotLinksProps) => {
  const links = [
    {
      title: 'The Cardano Constitution',
      link: '#the-cardano-constitution',
    },
    {
      title: 'The constitutional committee',
      link: '#the-constitutional-committee',
    },
    {
      title: 'State of no-confidence',
      link: '#state-of-no-confidence',
    },
    {
      title: 'Replacing the constitutional committee',
      link: '#replacing-the-constitutional-committee',
    },
    {
      title: 'Size of the constitutional committee ',
      link: '#size-of-the-constitutional-committee',
    },
    {
      title: 'Terms',
      link: '#terms',
    },
    {
      title: 'Guardrails Script',
      link: '#guardrails-script',
    },
    {
      title: 'Delegated representatives (DReps)',
      link: '#delegated-representatives-dreps',
    },
    {
      title: 'Pre-defined Voting Options',
      link: '#pre-defined-voting-options',
    },
    {
      title: 'Registered DReps',
      link: '#registered-dreps',
    },
    {
      title: 'New stake distribution for DReps',
      link: '#new-stake-distribution-for-dreps',
    },
    {
      title: 'DRep incentives',
      link: '#drep-incentives',
    },
    {
      title: 'Governance actions',
      link: '#governance-actions',
    },
    {
      title: 'Ratification',
      link: '#ratification',
    },
    {
      title: 'Requirements',
      link: '#requirements',
    },
    {
      title: 'Restrictions',
      link: '#restrictions',
    },
    {
      title: 'Enactment',
      link: '#enactment',
    },
    {
      title: 'Lifecycle',
      link: '#lifecycle',
    },
    {
      title: 'Content',
      link: '#content',
    },
    {
      title: 'Protocol parameter groups',
      link: '#protocol-parameter-groups',
    },
    {
      title: 'Votes',
      link: '#votes',
    },
    {
      title: 'Governance state',
      link: '#governance-state',
    },
    {
      title: 'Changes to the stake snapshot',
      link: '#changes-to-the-stake-snapshot',
    },
    {
      title: 'Definitions relating to voting stake',
      link: '#definitions-relating-to-voting-stake',
    },
  ];
  return (
    <div
      className={`my-5 bg-white ${seethrough ? 'bg-opacity-50' : ''}  w-screen`}
    >
      <div
        className={`flex w-full flex-row flex-wrap items-center justify-center gap-3 p-8`}
      >
        {links
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <div
              key={item.title}
              className="flex w-fit items-center justify-center rounded-2xl bg-blue-100 px-2 py-1"
            >
              <a href={item.link} className="text-nowrap text-sm text-black">
                {item.title}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HotLinks;
