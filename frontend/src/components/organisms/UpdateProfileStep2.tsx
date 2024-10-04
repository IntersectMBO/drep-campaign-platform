import React, { ChangeEvent, useEffect, useState } from 'react';
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
import {Box, Typography} from '@mui/material';
import { convertString } from '@/lib';
import WalletConnectButton from '../molecules/WalletConnectButton';
import LoginButton from '../molecules/LoginButton';
import { getSwitchWithTextTrack } from './UserLoginModal';
import { useScreenDimension } from '@/hooks';
const FormSchema = z.object({
  signature: z.string(),
  key: z.string(),
});
type InputType = z.infer<typeof FormSchema>;

const UpdateProfileStep2 = () => {
  const { handleSubmit, getValues, setValue } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { isMobile } = useScreenDimension();

  const [isHardware, setIsHardware] = useState(!false);
  const { address, isEnabled, dRepIDBech32, stakeKey, loginCredentials } =
    useCardano();
  const SwitchWithTextTrack = getSwitchWithTextTrack(
    isMobile,
    isMobile ? '9.375rem' : '13.75rem',
  );
  const { setIsNotDRepErrorModalOpen, drepId, setStep2Status, setNewDrepId } =
    useDRepContext();
  const [signature, setSignature] = useState({ signature: null, key: null });
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
        setValue('signature', drep.signature_drepSignature);
        setSignature({
          signature: drep.signature_drepSignature,
          key: drep.signature_drepSignatureKey,
        });
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
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsHardware(!event.target.checked);
  };
  useEffect(() => {
    try {
      if (loginCredentials.signature || loginCredentials.vkey) {
        const { signature, vkey } = loginCredentials;
        setSignature({ signature, key: vkey });
        setValue('signature', signature);
        setValue('key', vkey);
      }
    } catch (error) {
      console.log(error);
      addErrorAlert(error?.info);
    }
  }, [loginCredentials]);
  const saveProfile: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const formData:drepInput = {
        signature: data.signature,
        stake_addr: stakeAddress,
        key: data.key,
        voter_id: dRepIDBech32,
      }
      await updateDrepMutation.mutateAsync({
        drepId: drepId,
        drep: formData ,
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
        <Typography variant='h1' className="font-bold text-zinc-800">
          Your Signatures
        </Typography>
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
        <Typography variant='body1' paragraph={true}>
          Signatures below will be able to login and manage this profile. <br />
          Support for additional signatures coming soon.
        </Typography>
      </div>
      <Box>
        <Typography className="" variant="h6">
          Signatures
        </Typography>
      </Box>
      <form id="profile_form" onSubmit={handleSubmit(saveProfile, onError)}>
        <div className="flex flex-col gap-1">
          {!isEnabled ? (
            <WalletConnectButton test_name={'component'} />
          ) : (
            <>
              {!signature.signature ? (
                <div className="flex flex-col items-center justify-center">
                  <SwitchWithTextTrack
                    checked={!isHardware}
                    onChange={handleChange}
                  />
                  <LoginButton isHardware={isHardware} />
                </div>
              ) : (
                <Box>
                    <Typography className="" variant="body2" color="textSecondary">
                    Signature:{' '}
                    {signature.signature &&
                      convertString(signature.signature, false)}
                  </Typography>
                  <Typography className="" variant="body2" color="textSecondary">
                    Wallet: {address && convertString(address, false)}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </div>
        <ProfileSubmitArea isUpdate />
      </form>
    </div>
  );
};

export default UpdateProfileStep2;
