import React, { useEffect, useState } from 'react';
import Button from './Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Typography,
  Skeleton,
  AccordionSummary,
  Accordion,
  AccordionDetails,
} from '@mui/material';
import Link from 'next/link';
import {
  convertString,
  formattedAda,
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from '@/lib';
import { useScreenDimension } from '@/hooks';
import { useCardano } from '@/context/walletContext';
import MetadataViewer from './MetadataViewer';
import { isActive } from '../molecules/DRepsTable';
import {
  processExternalMetadata,
  renderJSONLDToJSONArr,
} from '@/lib/metadataProcessor';
import DRepSocialLinks from './DRepSocialLinks';
import MetadataEditor from './MetadataEditor';
import SubmitMetadataModal from './SubmitMetadataModal';
import { deleteItemFromIndexedDB } from '@/lib/indexedDb';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import DRepAvatarCard from './DRepAvatarCard';
import { useDRepContext } from '@/context/drepContext';
import { getDRepMetadata } from '@/services/requests/getDRepMetadata';

interface StatusProps {
  status:
    | 'Verified'
    | 'Unverified'
    | 'Claimed'
    | 'Active'
    | 'Inactive'
    | 'Not claimed';
}
const StatusChip = ({ status }: StatusProps) => {
  let statusClass = '';
  switch (status) {
    case 'Verified':
      statusClass = 'bg-blue-800 text-white';
      break;
    case 'Unverified':
      statusClass = 'bg-gray-800 text-white';
      break;
    case 'Not claimed':
      statusClass = 'bg-orange-500 text-white';
      break;
    case 'Claimed':
      statusClass = 'bg-teal-100 text-zinc-800';
      break;
    case 'Active':
      statusClass = 'bg-teal-100 text-zinc-800';
      break;
    case 'Inactive':
      statusClass = 'bg-gray-800 text-white';
      break;
    default:
      statusClass = 'bg-gray-800 text-white'; // Default to gray if status is not recognized
  }

  return (
    <div
      className={`text-nowrap rounded-full px-2 py-1 text-center text-sm font-normal ${statusClass}`}
    >
      {status}
    </div>
  );
};

const DrepProfileCard = ({ drep, state }: { drep: any; state: boolean }) => {
  const { isMobile } = useScreenDimension();
  const { setLoginModalOpen, isLoggedIn } = useDRepContext();
  const { dRepIDBech32 } = useCardano();
  const [status, setStatus] = useState<any>('Inactive');
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [metadataJson, setMetadataJson] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const { addSuccessAlert } = useGlobalNotifications();
  const [isSubmittingMetadata, setIsSubmittingMetadata] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [hoveredOnWarning, setHoveredOnWarning] = useState(false);
  const ctaActions = [
    {
      label: metadata ? 'Edit Metadata' : 'Set up Metadata',
      action: () => setCanEdit(true),
    },
    {
      label: 'Login to update',
      action: () => setLoginModalOpen(true),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      if (!drep) return;
      
      setIsMetadataLoading(true);
      setMetadataError(null);

      const metadataUrl = drep?.metadata_url;
      setMetadataUrl(metadataUrl);

      try {
        const voterId = drep?.view;

        try {
          const res = await getDRepMetadata(voterId);
          setMetadata(res.metadata);

          const modifiedJson = renderJSONLDToJSONArr(res.metadata);
          setMetadataJson(modifiedJson);

          setMetadataEntries(res?.metadata?.body);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            const { jsonLdData, modifiedJson } = await processExternalMetadata({
              metadataUrl,
            });
            setMetadata(jsonLdData);
            setMetadataJson(modifiedJson);

            setMetadataEntries(jsonLdData?.body);
          }
        }
      } catch (error) {
        console.log(error);
        setMetadata(null);
        setMetadataError(
          'Metadata Unprocessable. Probably took long to load or has invalid content.',
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
  }, []);

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
    const name = metadataBody?.givenName || metadataBody?.dRepName;
    setName(name?.['@value'] || name);
  };

  const renderUnsavedChanges = () => {
    const slider = (
      <Accordion>
        <AccordionSummary
          expandIcon={
            <img
              src="/svgs/chevron-down.svg"
              alt="expand"
              className="h-5 w-5"
            />
          }
        >
          <div className="flex items-center gap-2">
            <img
              onClick={() => setHoveredOnWarning(!hoveredOnWarning)}
              src="/svgs/toastsvgs/alert-triangle.svg"
              alt="Warning"
              className="h-8 w-8 animate-pulse cursor-pointer"
            />
            <Typography variant="body1">Unsaved Changes</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-red-500">
              Your changes are still locally saved. Its recommended to submit to
              avoid losing your changes.
            </p>
            <Button
              handleClick={() => {
                setIsSubmittingMetadata(true);
              }}
              className="w-full"
            >
              Submit Changes
            </Button>
            <Button
              variant="outlined"
              bgcolor="transparent"
              handleClick={() => {
                resetDraft();
                window.location.reload();
              }}
              className="w-full"
            >
              Discard Changes
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    );

    if (getItemFromLocalStorage('isUpdating') && !isSubmittingMetadata) {
      return slider;
    }
    return null;
  };

  const resetDraft = async () => {
    removeItemFromLocalStorage('isUpdating');
    await deleteItemFromIndexedDB('metadataJsonLd');
    await deleteItemFromIndexedDB('metadataJsonHash');
  };

  return (
    <div className="flex w-full flex-col gap-5 bg-white bg-opacity-50 px-5 py-10">
      <DRepAvatarCard state={state} imageSrc={imageSrc} />
      <div className="w-full">
        <Typography
          variant="h4"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {state ? (
            <Skeleton
              animation={'wave'}
              variant="text"
              width={200}
              height={50}
            />
          ) : (
            drep &&
            (name
              ? name
              : drep?.view &&
                convertString(drep?.view, isMobile))
          )}
        </Typography>
      </div>
      <div className="flex flex-row gap-2">
        <StatusChip status={status} />
        <StatusChip status="Verified" />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <Typography variant="h6">Voting power</Typography>
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
          <Typography variant="h6">Live Stake</Typography>
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
        <Typography variant="h6">Total delegation</Typography>
        <p>
          {' '}
          {state ? (
            <Skeleton animation={'wave'} width={100} height={20} />
          ) : (
            `${drep?.delegation_vote_count || 0} ${drep?.delegation_vote_count > 1 ? 'Delegators' : 'Delegator'}`
          )}
        </p>
      </div>
      <div className="flex w-fit flex-row gap-2 rounded-full border border-blue-100 px-4 py-2">
        <p className="flex w-full items-center gap-3 ">
          ID{' '}
          {state ? (
            <Skeleton animation={'wave'} width={150} height={20} />
          ) : (
            drep?.view &&
            convertString(drep?.view, true)
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
      <div>
        {canEdit && (
          <MetadataEditor
            onClose={() => {
              setCanEdit(false);
            }}
            initialMetadata={metadataJson}
            onSuccessfulSubmit={() => {
              setIsSubmittingMetadata(true);
            }}
          />
        )}
        {isSubmittingMetadata && (
          <SubmitMetadataModal
            onClose={() => setIsSubmittingMetadata(false)}
            onSuccessfulSubmit={() => {
              addSuccessAlert(
                'Metadata updated successfully. It will probably take few minutes to reflect',
              );
              resetDraft();
            }}
          />
        )}
        {(drep?.view == dRepIDBech32 ||
          drep?.signature_voterId == dRepIDBech32) &&
          renderUnsavedChanges()}
      </div>
      {(drep?.view == dRepIDBech32 ||
        drep?.signature_voterId == dRepIDBech32) && (
        <div className="flex max-w-prose flex-col gap-2">
          <Button
            handleClick={
              isLoggedIn ? ctaActions[0].action : ctaActions[1].action
            }
            className="w-full"
          >
            {isLoggedIn ? ctaActions[0].label : ctaActions[1].label}
          </Button>
          {isLoggedIn && (
            <Link href={`/dreps/workflow/profile/update/step1`}>
              <Button
                className="w-full"
                variant="outlined"
                bgcolor="transparent"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default DrepProfileCard;
