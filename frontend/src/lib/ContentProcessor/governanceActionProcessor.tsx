import React from 'react';
import DrepGovActionSubmitCard from '@/components/atoms/DrepGovActionSubmitCard';

export const governanceActionProcessor = (content: string) => {
  const regex = /\[gov_action hash='(.+?)'\]/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const hash = match[1];
    const startIndex = match.index;
    const endIndex = regex.lastIndex;

    const textBefore = content.substring(lastIndex, startIndex);
    if (textBefore) {
      parts.push(textBefore);
    }

    parts.push(<DrepGovActionSubmitCard key={hash} hash={hash} />);

    lastIndex = endIndex;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter) {
    parts.push(textAfter);
  }

  return parts;
};
