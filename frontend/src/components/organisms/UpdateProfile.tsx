import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import UpdateProfileForm from '../molecules/UpdateProfileForm';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import { usePostUpdateDrepMutation } from '@/hooks/usePostUpdateDRepMutation';
import { drepInput } from '@/models/drep';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
const FormSchema = z.object({
  profileName: z.string(),
  profileUrl: z.any(),
});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfile = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { isEnabled, dRepIDBech32, stakeKey } = useCardano();
  const [currentProfileUrl, setCurrentProfileUrl] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { setIsNotDRepErrorModalOpen, drepId } = useDRepContext();
  const { addChangesSavedAlert } = useGlobalNotifications();
  const updateDrepMutation = usePostUpdateDrepMutation();
  useEffect(() => {
    const getDRep = async (drepId) => {
      try {
        const drep = await getSingleDRep(drepId);
        setValue('profileName', drep.name);
        setCurrentProfileUrl(drep.url);
      } catch (error) {
        console.log(error);
      }
    };
    if (drepId) getDRep(drepId);
  }, []);
  const saveProfile: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const formData = new FormData();
      formData.append('name', data.profileName);
      formData.append('stake_addr', stakeAddress);
      formData.append('voter_id', dRepIDBech32);
      if (data.profileUrl) {
        formData.append('profileUrl', data?.profileUrl[0] as string);
      }
      const res = await updateDrepMutation.mutateAsync({
        drepId: drepId,
        drep: formData as drepInput,
      });
      addChangesSavedAlert();
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
              <img src="/copy.svg" alt="copy" />
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
