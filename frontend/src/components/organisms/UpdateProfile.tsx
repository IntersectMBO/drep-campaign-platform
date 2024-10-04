import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import UpdateProfileForm from '../molecules/UpdateProfileForm';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { renderJsonldValue } from '../atoms/MetadataViewer';
import { getItemFromLocalStorage, setItemToLocalStorage, sha256 } from '@/lib';
import {
  submitMetadata,
} from '@/lib/metadataProcessor';
import { DRepMetadata, IPFSResponse } from '../../../types/commonTypes';
import { setItemToIndexedDB } from '@/lib/indexedDb';
import { postAddAttachmentToIPFS } from '@/services/requests/postAttachmentToIPFS';
import { urls } from '@/constants';
import { PREDEFINED_KEYS } from './NewProfile';
const FormSchema = z.object({
  profileName: z.string().min(1, { message: 'Profile name is required' }),
  profileEmail: z.string().optional(),
  profileBio: z.string().optional(),
  profileUrl: z.any(),
  objectives: z.string().optional(),
  motivations: z.string().optional(),
  qualifications: z.string().optional(),
  paymentAddress: z.string().optional(),

});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfile = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { dRepIDBech32, loginSignTransaction, walletState:{usedAddress, changeAddress} } = useCardano();
  const [currentProfileUrl, setCurrentProfileUrl] = useState<string | null>(
    null,
  );
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const {
    setIsNotDRepErrorModalOpen,
    setStep1Status,
    metadataJsonLd,
    handleRefresh,
  } = useDRepContext();
  const { addSuccessAlert } = useGlobalNotifications();

  useEffect(() => {
    const getDRep = () => {
      try {
        if (!metadataJsonLd) return;
        const metadataBody = metadataJsonLd?.body;
        setValue('profileName', renderJsonldValue(metadataBody?.givenName));
        setValue('profileBio', renderJsonldValue(metadataBody?.bio));
        setValue('profileEmail', renderJsonldValue(metadataBody?.email));
        setValue('motivations', renderJsonldValue(metadataBody?.motivations));
        setValue('qualifications', renderJsonldValue(metadataBody?.qualifications));
        setValue('objectives', renderJsonldValue(metadataBody?.objectives));
        setValue('paymentAddress', renderJsonldValue(metadataBody?.paymentAddress) || usedAddress || changeAddress);
        setValue(
          'profileUrl',
          renderJsonldValue(metadataBody?.image?.contentUrl) || '',
        );
        setCurrentProfileUrl(
          renderJsonldValue(metadataBody?.image?.contentUrl),
        );
        //map through the metadata and set the current metadata for each exisitng field
        for (let key in metadataBody) {
          if (key === 'image') {
            setCurrentMetadata((prev: any) => ({
              ...prev,
              [key]: {
                contentUrl: renderJsonldValue(metadataBody[key]?.contentUrl),
                sha256: renderJsonldValue(metadataBody[key]?.sha256),
              },
            }));
            continue;
          }
          if (key === 'references') {
            setCurrentMetadata((prev: any) => ({
              ...prev,
              [key]: metadataBody[key],
            }));
            continue;
          }
          setCurrentMetadata((prev: any) => ({
            ...prev,
            [key]: renderJsonldValue(metadataBody[key]),
          }));
        }
        const isUpdating = getItemFromLocalStorage('isUpdating');
        if (isUpdating) {
          addSuccessAlert('Draft restored!');
        }
        if(Boolean(getValues('profileName'))){
          setStep1Status('update');
        }else setStep1Status('active');
        return;
      } catch (error) {
        console.log(error);
      }
    };
    getDRep();
    return () => {
      setStep1Status('success');
    };
  }, [metadataJsonLd]);


  const saveProfile: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      //if previous data doesnt match with current data, set isUpdating to true
      if (
        currentMetadata?.givenName !== data.profileName ||
        currentMetadata?.bio !== data.profileBio ||
        currentMetadata?.email !== data.profileEmail ||
        currentMetadata?.image?.contentUrl !== data.profileUrl ||
        currentMetadata?.paymentAddress !== data.paymentAddress ||
        currentMetadata?.qualifications !== data.qualifications ||
        currentMetadata?.motivations !== data.motivations ||
        currentMetadata?.objectives !== data.objectives
      ) {
        const rest = currentMetadata
          ? Object.keys(currentMetadata)
              .filter((key) => !PREDEFINED_KEYS.includes(key))
              .reduce((acc, key) => {
                acc[key] = currentMetadata[key];
                return acc;
              }, {})
          : {};
        const metadataJson: DRepMetadata = {
          givenName: data.profileName,
          bio: data.profileBio,
          email: data.profileEmail,
          references: currentMetadata?.references as any,
          paymentAddress: data.paymentAddress,
          qualifications: data.qualifications,
          motivations: data.motivations,
          objectives: data.objectives,
          ...rest,
        };
        //add the preexisitgn image if it exists
        if (currentMetadata?.image) {
          metadataJson['image'] = currentMetadata.image;
        }

        if (data.profileUrl) {
          let imageFile: File | null = null;

          if (typeof data.profileUrl !== 'string') {
            if (data.profileUrl instanceof FileList) {
              if (data.profileUrl.length > 0) {
                imageFile = data.profileUrl[0];
              }
            } else {
              // instance of File object
              imageFile = data.profileUrl;
            }
          }

          if (imageFile) {
            // upload image to ipfs first (File format)
            const formData = new FormData();
            formData.append('attachment', imageFile);
            const { ipfs_hash }: IPFSResponse = await postAddAttachmentToIPFS({
              attachment: formData,
            });
            const imageUrl = `${urls.ipfsGateway}/ipfs/${ipfs_hash}`;
            // hash the image to sha256
            const imageHash = await sha256(imageFile);
            metadataJson['image'] = {
              contentUrl: imageUrl,
              sha256: imageHash,
            };
          } else if (typeof data.profileUrl === 'string') {
            // If it's a string, assume it's an existing URL
            metadataJson['image'] = {
              contentUrl: decodeURIComponent(data?.profileUrl).replace(
                /^"|"$/g, // sanitize the url
                '',
              ),
              sha256:
                String(currentMetadata?.image?.sha256).replace(
                  /^"|"$/g, // sanitize the url
                  '',
                ) || '',
            };
          }
        }
        const metadataKeys = Object.keys(metadataJson);
        //submit the metadata
        const { jsonHash, jsonld } = await submitMetadata(
          metadataKeys,
          metadataJson as any,
          loginSignTransaction,
        );
        // after saving to blockchain, save to indexedDB in jOSN format
        await setItemToIndexedDB('metadataJsonLd', jsonld);
        await setItemToIndexedDB('metadataJsonHash', jsonHash);
        setItemToLocalStorage('isUpdating', 'true');
        await handleRefresh();
      }

      addSuccessAlert('Draft saved!');
    } catch (error) {
      console.log(error);
    }
  };
  const onError = (err) => {
    console.log(err);
  };
  return (
    <div className="flex w-full flex-col gap-5 px-10 py-5">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold text-zinc-800">
          Update your Profile
        </h1>
        {dRepIDBech32 && (
          <div className="flex flex-row flex-wrap gap-1 lg:flex-nowrap">
            <span className="w-full break-words text-slate-500 lg:w-fit">
              {dRepIDBech32}
            </span>
            <CopyToClipboard
              text={dRepIDBech32}
              onCopy={() => {
                console.log('copied!');
              }}
              className="clipboard-text cursor-pointer"
            >
              <img src="/svgs/copy.svg" alt="copy" />
            </CopyToClipboard>
          </div>
        )}
        <p className="text-base font-normal text-gray-800">
          Updating your profile is not mandatory, unless you want to become a
          DRep.
        </p>
      </div>
      <form id="profile_form" onSubmit={handleSubmit(saveProfile, onError)}>
        <UpdateProfileForm
          register={register}
          control={control}
          errors={errors}
          setProfileUrl={setValue}
          currentProfileUrl={currentProfileUrl}
        />
      </form>
    </div>
  );
};

export default UpdateProfile;
