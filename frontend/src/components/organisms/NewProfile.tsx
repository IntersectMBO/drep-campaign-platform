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
const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
const FormSchema = z.object({
  profileName: z.string().min(1, { message: 'Profile name is required' }),
  profileUrl: z.any(),
});
type InputType = z.infer<typeof FormSchema>;

const NewProfile = () => {
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
  const { addSuccessAlert, addErrorAlert } = useGlobalNotifications();
  const router = useRouter();
  const newDRepMutation = usePostNewDrepMutation();
  const {
    setIsNotDRepErrorModalOpen,
    setNewDrepId,
    setCurrentRegistrationStep,
  } = useDRepContext();
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
      const res = await newDRepMutation.mutateAsync({
        drep: formData as drepInput,
      });
      setNewDrepId(res.raw[0].id);
      setCurrentRegistrationStep(1);
      addSuccessAlert('DRep Profile Created Successfully!');
      router.push(`/dreps/workflow/profile/update/step1`);
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
              <img src="/copy.svg" alt="copy" />
            </CopyToClipboard>
          </div>
        )}
        <p className="text-base font-normal text-gray-800">
          Completing your profile is not mandatory, unless you want to become a
          DRep.
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
        />
      </form>
    </div>
  );
};

export default NewProfile;
