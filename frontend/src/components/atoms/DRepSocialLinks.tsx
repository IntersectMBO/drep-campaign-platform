import Link from 'next/link';
import React from 'react';

const DRepSocialLinks = ({ links }: { links: any[] }) => {
  const retrieveLink = (link: string) => {
    if (!links) return '#';
    let uri = '#';

    const matchingLink = links.find((ref) => {
      const label = (ref.label?.['@value'] || ref?.label || "") as string;
      return label.includes(link);
    });
    if (matchingLink) {
      uri = matchingLink.uri?.['@value'] || matchingLink?.uri;
    }
    return uri;
  };
  return (
    <div className="flex flex-row gap-2">
      <Link href={retrieveLink('github')}>
        <img className="w-full" src="/svgs/github-dark.svg" alt="" />
      </Link>
      <Link href={retrieveLink('x')}>
        <img className="w-full" src="/svgs/twitter.svg" alt="" />
      </Link>
      <Link href={retrieveLink('facebook')}>
        <img className="w-full" src="/svgs/fb-dark.svg" alt="" />
      </Link>
      <Link href={retrieveLink('instagram')}>
        <img className="w-full" src="/svgs/ig-dark.svg" alt="" />
      </Link>
    </div>
  );
};

export default DRepSocialLinks;
