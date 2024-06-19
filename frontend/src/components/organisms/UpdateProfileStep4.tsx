import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { usePostUpdateDrepMutation } from '@/hooks/usePostUpdateDRepMutation';
import { drepInput } from '@/models/drep';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import ProfileSubmitArea from '../atoms/ProfileSubmitArea';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
const FormSchema = z.object({
  github: z
    .string()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === '' ||
        /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+(\/)?$/.test(val),
      { message: 'Invalid Github URL' },
    ),
  x: z
    .string()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === '' ||
        /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9-]+(\/)?$/.test(val),
      { message: 'Invalid Twitter URL' },
    ),
  facebook: z
    .string()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === '' ||
        /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9-]+(\/)?$/.test(val),
      { message: 'Invalid Facebook URL' },
    ),
});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfileStep4 = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { isEnabled, dRepIDBech32, stakeKey } = useCardano();
  const { setIsNotDRepErrorModalOpen, drepId, setStep4Status, setNewDrepId } = useDRepContext();
  const { addChangesSavedAlert } = useGlobalNotifications();
  const updateDrepMutation = usePostUpdateDrepMutation();
  
  useEffect(() => {
      const getDRep = async () => {
        try {
          let drep;
          if (drepId) {
            drep = await getSingleDRep(drepId);
          }else if(dRepIDBech32){
            drep = await getSingleDRepViaVoterId(dRepIDBech32);
          }
          setValue('github', drep.social?.github||'');
          setValue('x', drep.social?.x || '');
          setValue('facebook', drep.social?.facebook || '');
          setNewDrepId(drep.id)
          if (drep.social?.github || drep.social?.x || drep.social?.facebook) {
            setStep4Status('update');
          } else setStep4Status('active');
        } catch (error) {
          console.log(error);
        }
      };
      getDRep();
      return () => {
        if(Boolean(getValues('github')) || Boolean(getValues('x')) || Boolean(getValues('facebook'))){
          setStep4Status('success')
        } else setStep4Status('pending')
      }
    }, [dRepIDBech32]); 
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
      formData.append('social', JSON.stringify({ ...data }));
      formData.append('stake_addr', stakeAddress);
      formData.append('voter_id', dRepIDBech32);
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
        <h1 className="text-4xl font-bold text-zinc-800">Social Media</h1>
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
          Share your social media links, this will increase the credibility of
          your profile.
        </p>
      </div>
      <form id="profile_form" onSubmit={handleSubmit(saveProfile, onError)}>
        <div className="flex flex-col gap-1">
          <label>Github</label>
          <input
            type="text"
            className={`rounded-full border border-zinc-100 py-3 pl-5 pr-3`}
            {...register('github')}
            placeholder="Paste your github url here"
          />
          <div className="text-sm text-red-700" data-testid="error-msg">
            {errors?.github && errors?.github?.message}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label>X</label>
          <input
            type="text"
            className={`rounded-full border border-zinc-100 py-3 pl-5 pr-3`}
            {...register('x')}
            placeholder="Paste your x url here"
          />
          <div className="text-sm text-red-700" data-testid="error-msg">
            {errors?.x && errors?.x?.message}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label>Facebook</label>
          <input
            type="text"
            className={`rounded-full border border-zinc-100 py-3 pl-5 pr-3`}
            {...register('facebook')}
            placeholder="Paste your facebook url here"
          />
          <div className="text-sm text-red-700" data-testid="error-msg">
            {errors?.facebook && errors?.facebook?.message}
          </div>
        </div>
        <ProfileSubmitArea isUpdate />
      </form>
    </div>
  );
};

export default UpdateProfileStep4;
