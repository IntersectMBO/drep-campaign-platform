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
import Button from '../atoms/Button';
import { Typography } from '@mui/material';
import { convertString } from '@/lib';
import WalletConnectButton from '../molecules/WalletConnectButton';
const FormSchema = z.object({
  signature: z.string(),
  key:z.string()
});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfileStep2 = () => {
  const {
    handleSubmit,
    getValues,
    setValue,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { address, isEnabled, dRepIDBech32, stakeKey, loginSignTransaction } =
    useCardano();

  const { setIsNotDRepErrorModalOpen, drepId, setStep2Status, setNewDrepId } =
    useDRepContext();
  const [signature, setSignature] = useState({signature:null, key:null});
  const { addChangesSavedAlert, addErrorAlert } = useGlobalNotifications();
  const updateDrepMutation = usePostUpdateDrepMutation();
  useEffect(() => {
    const getDRep = async () => {
      try {
        let drep;
        if (drepId) {
          drep = await getSingleDRep(drepId);
        } else if (dRepIDBech32) {
          drep = await getSingleDRepViaVoterId(dRepIDBech32);
        }
        setNewDrepId(drep.drep_id);
        setValue('signature', drep.signature_drepSignature)
        setSignature({signature:drep.signature_drepSignature, key:drep.signature_drepSignatureKey})
        if (drep.drep_platform_statement) {
          setStep2Status('update');
        } else setStep2Status('active');
      } catch (error) {
        console.log(error);
      }
    };
    getDRep();
    return () => {
      if (Boolean(getValues('signature'))) {
        setStep2Status('success');
      } else setStep2Status('pending');
    };
  }, [dRepIDBech32]);
  const handleLogin = async () => {
    try {
      const { signature, key } = await loginSignTransaction();
      setSignature({ signature, key});
      setValue('signature', signature)
      setValue('key', key)
    } catch (error) {
      console.log(error);
      addErrorAlert(error?.info)
    }
  };
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
      formData.append('signature', data.signature);
      formData.append('key', data.key);
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
        <h1 className="text-4xl font-bold text-zinc-800">
          Your Unique Signature
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
          Verify your profile so as to track your connected wallets across the
          same drep profile.
        </p>
      </div>
      <form id="profile_form" onSubmit={handleSubmit(saveProfile, onError)}>
        <div className="flex flex-col gap-1">
          {!isEnabled ? (
            <WalletConnectButton test_name={'component'} />
          ) : (
            <>
              <Typography className="" variant="body2" color="textSecondary">
                Connected Wallet: {address && convertString(address, false)}
              </Typography>
              {!signature.signature ? (
                <Button handleClick={handleLogin}>Login</Button>
              ) : (
                <Typography className="" variant="body2" color="textSecondary">
                  Signature: {signature.signature && convertString(signature.signature, false)}
                </Typography>
              )}
            </>
          )}
        </div>
        <ProfileSubmitArea isUpdate/>
      </form>
    </div>
  );
};

export default UpdateProfileStep2;
