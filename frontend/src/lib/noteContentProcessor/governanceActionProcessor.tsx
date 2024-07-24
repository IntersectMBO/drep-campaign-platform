import React from 'react';
import DrepGovActionSubmitCard from '@/components/atoms/DrepGovActionSubmitCard';

export const governanceActionProcessor = (content: string) => {
  
  const regex = /\[gov_action hash='(.+?)'\]/g;
  const parts: (string | object)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const hash = match[1];
    const startIndex = match.index;
    const endIndex = regex.lastIndex;
  
    parts.push(content.substring(lastIndex, startIndex));

    const govActionData = {
      gov_action_proposal_id: '0x1a2b3c4d5e6f7g8h9i0j',
      description: {
        tag: 'Protocol Parameter Changes',
      },
      createdAt: '2024-03-15T09:23:14Z',
    };

    parts.push(
      <DrepGovActionSubmitCard
        key={hash}
        item={govActionData}
        actionType={govActionData.description.tag}
      />
    );

    lastIndex = endIndex;
  }

  parts.push(content.substring(lastIndex));

  return parts;
};
