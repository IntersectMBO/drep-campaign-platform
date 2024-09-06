import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePostUpdateDrepMutation } from '@/hooks/usePostUpdateDRepMutation';
import { drepInput } from '@/models/drep';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import ProfileSubmitArea from '../atoms/ProfileSubmitArea';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
const FormSchema = z.object({
  statement: z.string(),
});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfileStep3 = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { isEnabled, dRepIDBech32, stakeKey } = useCardano();

  const { setIsNotDRepErrorModalOpen, drepId, setStep3Status, setNewDrepId} = useDRepContext();
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
        setValue('statement', drep.drep_platform_statement);
        setNewDrepId(drep.drep_id);
        if(drep.drep_platform_statement){
          setStep3Status('update')
        }else setStep3Status('active')
      } catch (error) {
        console.log(error);
      }
    };
    getDRep();
    return () => {
      if(Boolean(getValues('statement'))){
        setStep3Status('success')
      } else setStep3Status('pending')
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
      formData.append('platform_statement', data.statement);
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
        <h1 className="text-4xl font-bold text-zinc-800">Your Statement</h1>
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
          Write down your statement. This is optional
        </p>
      </div>
      <form id="profile_form" onSubmit={handleSubmit(saveProfile, onError)}>
        <div className="flex flex-col gap-1">
          <label>Statement</label>
          <textarea
            className={`min-h-20 rounded-lg border border-zinc-100 py-3 pl-5 pr-3`}
            {...register('statement')}
            placeholder="Your statement"
          />
        </div>
        <ProfileSubmitArea isUpdate />
      </form>
    </div>
  );
};

export default UpdateProfileStep3;
