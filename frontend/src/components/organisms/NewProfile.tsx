import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import NewProfileForm from '../molecules/NewProfileForm';
import { usePostNewDrepMutation } from '@/hooks/usePostNewDRepMutation';
import { drepInput } from '@/models/drep';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { setItemToLocalStorage, sha256 } from '@/lib';
import { renderJsonldValue } from '../atoms/MetadataViewer';
import { submitMetadata } from '@/lib/metadataProcessor';
import { setItemToIndexedDB } from '@/lib/indexedDb';
import { postAddAttachmentToIPFS } from '@/services/requests/postAttachmentToIPFS';
import { urls } from '@/constants';
import { DRepMetadata, IPFSResponse } from '../../../types/commonTypes';
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
export const PREDEFINED_KEYS = [
  'givenName',
  'bio',
  'email',
  'references',
  'paymentAddress',
  'image',
  'objectives',
  'motivations',
  'qualifications',
];
const NewProfile = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const {
    dRepIDBech32,
    stakeKey,
    loginSignTransaction,
    walletState: { usedAddress, changeAddress },
  } = useCardano();
  const { addSuccessAlert, addErrorAlert } = useGlobalNotifications();
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [currentProfileUrl, setCurrentProfileUrl] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const newDRepMutation = usePostNewDrepMutation();
  const {
    setIsNotDRepErrorModalOpen,
    setNewDrepId,
    setCurrentRegistrationStep,
    setIsLoggedIn,
    metadataJsonLd,
    handleRefresh,
    isDRepRegistered,
  } = useDRepContext();

  useEffect(() => {
    const getDRep = () => {
      try {
        if (!metadataJsonLd) return;
        const metadataBody = metadataJsonLd?.body;
        setValue('profileName', renderJsonldValue(metadataBody?.givenName));
        setValue('profileBio', renderJsonldValue(metadataBody?.bio));
        setValue('profileEmail', renderJsonldValue(metadataBody?.email));
        setValue('motivations', renderJsonldValue(metadataBody?.motivations));
        setValue(
          'qualifications',
          renderJsonldValue(metadataBody?.qualifications),
        );
        setValue('objectives', renderJsonldValue(metadataBody?.objectives));
        setValue(
          'paymentAddress',
          renderJsonldValue(metadataBody?.paymentAddress) ||
            usedAddress ||
            changeAddress,
        );
        setValue(
          'profileUrl',
          renderJsonldValue(metadataBody?.image?.contentUrl) || '',
        );
        setCurrentProfileUrl(
          renderJsonldValue(metadataBody?.image?.contentUrl) || '',
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
        return;
      } catch (error) {
        console.log(error);
      }
    };
    getDRep();
  }, [metadataJsonLd]);

  const saveProfile: SubmitHandler<InputType> = async (data) => {
    try {
      if (!isDRepRegistered) {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      const { signature, key } = await loginSignTransaction();
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
              contentUrl: data.profileUrl,
              sha256: '',
            };
          }
        }
        const metadataKeys = Object.keys(metadataJson);
        const vkeys = {
          signature,
          vkey: key,
        };
        //submit the metadata
        const { jsonHash, jsonld } = await submitMetadata(
          metadataKeys,
          metadataJson as any,
          loginSignTransaction,
          vkeys,
        );
        await setItemToIndexedDB('metadataJsonLd', jsonld);
        await setItemToIndexedDB('metadataJsonHash', jsonHash);
        setItemToLocalStorage('isUpdating', 'true');
        await handleRefresh();
      }

      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const formData: drepInput = {
        signature,
        stake_addr: stakeAddress,
        key,
        voter_id: dRepIDBech32,
      };
      const res = await newDRepMutation.mutateAsync({
        drep: formData as any,
      });
      const { insertedDrep, token } = res;
      setNewDrepId(insertedDrep.raw[0].id);
      setCurrentRegistrationStep(2);
      addSuccessAlert('DRep Profile Created Successfully!');
      setItemToLocalStorage('token', token);
      setItemToLocalStorage('signatures', { signature, key });
      setIsLoggedIn(true);
      router.push(`/dreps/workflow/profile/update/step2`);
    } catch (error) {
      addErrorAlert('Error Creating DRep Profile!');
      console.log(error);
    }
  };
  const onError = (err: any) => {
    console.log(err);
  };
  return (
    <div className="flex w-full flex-col gap-5 p-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold text-zinc-800">
          Create Your DRep Campaign
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
          Completing your profile will update your cip 119 on-chain DRep
          metadata.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(saveProfile, onError)}
        encType="multipart/form-data"
      >
        <NewProfileForm
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

export default NewProfile;
