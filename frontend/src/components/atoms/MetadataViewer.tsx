import { Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
export const renderJsonldValue = (value: any) => {
  if (typeof value === 'object') {
    return value['@value'] ? value['@value'] : 'Empty';
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
};
const MetadataViewer = ({
  isMetadataLoading,
  metadataError,
  metadata,
  metadataUrl,
}: {
  isMetadataLoading: boolean;
  metadataError: any;
  metadata: any;
  metadataUrl?: string;
}) => {
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const hiddenKeys = ['image', 'paymentAddress'];

  const renderContent = () => {
    if (isMetadataLoading) {
      return <p className="text-sm animate-pulse">Loading...</p>;
    }

    if (metadataError) {
      return <p className="text-sm text-red-400">{metadataError}</p>;
    }

    if (!metadata || !metadata.body) {
      return <p className="text-sm">No metadata found</p>;
    }

    return Object.entries(metadata.body)
      .filter(([key, value]) => !hiddenKeys.includes(key))
      .map(([key, value]: any[]) => {
        const valueString = renderJsonldValue(value);
        if (key === 'references') {
          const linksArr = value as any[];
          const links =
            Array.isArray(linksArr) && linksArr.length
              ? linksArr.map((link, index) => {
                const linkLabel = link?.label?.['@value'] || link?.label ;
                const linkUri = link?.uri?.['@value'] || link?.uri ;
                  return (
                    <div
                      key={index}
                      className="flex w-full flex-col items-start gap-1 text-sm"
                    >
                      <p className="font-bold ">{capitalizeFirstLetter(linkLabel)}</p>
                      <Link
                        className="w-full break-words font-light"
                        href={
                          linkUri
                            ? linkUri || '#'
                            : '#'
                        }
                        target="_blank"
                      >
                        {linkUri}
                      </Link>
                    </div>
                  );
                })
              : [];
          return (
            <div
              key={key}
              className="flex flex-col items-start justify-center gap-1 text-sm"
            >
              <Typography variant="h6">References</Typography>
              <div className="w-full pl-2 space-y-1">
                {links.length > 0 ? links : 'Empty'}
              </div>
            </div>
          );
        }
        return (
          <div
            key={key}
            className="flex flex-col items-start justify-center gap-1 text-sm w-full"
          >
            <Typography variant="h6">{capitalizeFirstLetter(key)}</Typography>
            <p className="pl-2 w-full break-words">{valueString}</p>
          </div>
        );
      });
  };

  return (
    <div className="flex flex-col gap-2">
      {renderContent()}
      {metadataUrl && (
        <Link href={metadataUrl} target="_blank">
          <div className="flex items-center gap-1 text-sm">
            <p className="font-semibold text-gray-600 hover:text-gray-800">
              View External Link
            </p>
            <img src="/svgs/external-link.svg" alt="" />
          </div>
        </Link>
      )}
    </div>
  );
};

export default MetadataViewer;
