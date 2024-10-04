import React, { useEffect, useState } from 'react';
import Button from './Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StatusChip from './StatusChip';
import Link from 'next/link';
import { Skeleton } from '@mui/material';
import { convertString, formattedAda } from '@/lib';
import MetadataViewer from './MetadataViewer';
import { isActive } from '../molecules/DRepsTable';
import { getExternalMetadata } from '@/services/requests/postExternalMetadataUrl';
import DRepSocialLinks from './DRepSocialLinks';
import DRepAvatarCard from './DRepAvatarCard';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { getDRepMetadata } from '@/services/requests/getDRepMetadata';

const DrepClaimProfileCard = ({
  drep,
  state,
}: {
  drep: any;
  state: boolean;
}) => {
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<any>('Inactive');
  const { dRepIDBech32 } = useCardano();
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const { isLoggedIn } = useDRepContext();
  useEffect(() => {
    const fetchData = async () => {
      if(!drep) return;
      
      setIsMetadataLoading(true);
      setMetadataError(null);

      const metadataUrl = drep?.metadata_url;
      setMetadataUrl(metadataUrl);
      try {
        try {
          const voterId = drep?.view;
          const res = await getDRepMetadata(voterId);

          setMetadataEntries(res?.metadata?.body);
          setMetadata(res?.metadata);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            const response = await getExternalMetadata({ metadataUrl });
            const jsonLdData = response;

            setMetadataEntries(jsonLdData?.body);
            setMetadata(jsonLdData);
          }
        }
      } catch (error) {
        setMetadata(null);
        setMetadataError(
          'Metadata Unprocessable. Probably took long to load or has invalid content',
        );
      } finally {
        setIsMetadataLoading(false);
      }
    };
    const checkStatus = () => {
      let status;
      if (drep?.type !== 'voting_option') {
        status = isActive(
          drep?.epoch_no,
          drep?.active_until,
        )
          ? 'Active'
          : 'Inactive';
        setStatus(status);
      }
    };
    checkStatus();
    fetchData();
  }, [drep]);

  const setMetadataEntries = (metadataBody) => {
    const imageUrl = metadataBody?.image?.contentUrl;
    if (imageUrl) {
      setImageSrc(imageUrl);
    }
    if (
      metadataBody?.references &&
      Array.isArray(metadataBody?.references) &&
      metadataBody?.references.length > 0
    ) {
      setSocialLinks(metadataBody?.references);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white bg-opacity-50 px-5 py-10 ">
      <DRepAvatarCard state={state} imageSrc={imageSrc} />
      {drep?.type !== 'scripted' && drep?.type !== 'voting_option' && (
        <Link className="w-full" href={`/dreps/workflow/profile/new`}>
          <Button className="w-full">Claim this profile</Button>
        </Link>
      )}
      <div className="flex flex-row gap-2">
        {drep?.type === 'scripted' && <StatusChip status="Scripted" />}
        {drep?.type === 'voting_option' && (
          <StatusChip status="Voting Option" />
        )}
        {drep?.type !== 'scripted' && drep?.type !== 'voting_option' && (
          <StatusChip status="Not claimed" />
        )}
        {drep?.retired && drep?.type !== 'voting_option' && (
          <StatusChip status="Retired" />
        )}
        <StatusChip
          status={drep?.type === 'voting_option' ? 'Active' : status}
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <p className="font-bold">Voting power</p>
          <p className="flex items-center gap-3 font-normal">
            {state ? (
              <Skeleton animation={'wave'} width={50} height={20} />
            ) : drep?.voting_power != null ? (
              `₳ ${formattedAda(drep?.voting_power, 2)}`
            ) : (
              '-'
            )}
          </p>
        </div>
        <div>
          <p className="font-bold">Live Stake</p>
          <p className="flex items-center gap-3 font-normal">
            {state ? (
              <Skeleton animation={'wave'} width={50} height={20} />
            ) : drep?.live_stake != null ? (
              `₳ ${formattedAda(drep?.live_stake, 2)}`
            ) : (
              '-'
            )}
          </p>
        </div>
      </div>
      <div>
        <p className="font-bold">Total delegation</p>
        <p>
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            `${drep?.delegation_vote_count || 0} ${drep?.delegation_vote_count > 1 ? 'Delegators' : 'Delegator'}`
          )}
        </p>
      </div>
      <div className="flex w-fit flex-row gap-2 rounded-full border border-blue-100 px-5 py-2">
        <p className="flex w-full items-center gap-3">
          ID{' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            convertString(drep?.view || '', true)
          )}
        </p>
        <CopyToClipboard
          text={drep?.view}
          onCopy={() => {
            console.log('copied!');
          }}
          className="clipboard-text cursor-pointer"
        >
          <img src="/svgs/copy.svg" alt="copy" />
        </CopyToClipboard>
      </div>
      <DRepSocialLinks links={socialLinks} />
      <div>
        {state ? (
          <Skeleton animation={'wave'} width={150} height={20} />
        ) : (
          <MetadataViewer
            metadata={metadata}
            isMetadataLoading={isMetadataLoading}
            metadataError={metadataError}
            metadataUrl={metadataUrl}
          />
        )}
      </div>
      {(drep?.view == dRepIDBech32 ||
        drep?.signature_voterId == dRepIDBech32) &&
        isLoggedIn && (
          <div className="flex max-w-prose flex-col gap-2">
            <Link href={`/dreps/workflow/profile/new`}>
              <Button className="w-full">Claim your profile to update</Button>
            </Link>
          </div>
        )}
    </div>
  );
};

export default DrepClaimProfileCard;
