import React, { useState } from 'react';
import NewNotePostForm from '../molecules/NewNotePostForm';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { usePostNewNoteMutation } from '@/hooks/usePostNewNoteMutation';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
const FormSchema = z.object({
  postTitle: z
    .string()
    .min(3, "Title can't be less than 3 chars")
    .max(255, "Title can't be more than 255 chars"),
  postTag: z.array(z.string()).optional(),
  postText: z.string().min(10, "Content can't be less than 10 chars"),
  postVisibility: z.string().min(1, "Visibility status can't be empty"),
});

type InputType = z.infer<typeof FormSchema>;

const NewNoteForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { postText: '' },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { dRepIDBech32, stakeKey } = useCardano();
  const router = useRouter();
  const mutation = usePostNewNoteMutation();
  const { setIsNotDRepErrorModalOpen } = useDRepContext();
  const { addSuccessAlert, addErrorAlert } = useGlobalNotifications();

  const saveNote: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      setIsLoading(true);
      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const { postTag, postText, postTitle, postVisibility } = data;
      const newNote = {
        title: postTitle,
        tag: postTag,
        content: postText,
        visibility: postVisibility,
        stake_addr: stakeAddress,
        drep: dRepIDBech32,
      };
      const { noteAdded } = await mutation.mutateAsync({ note: newNote });
      router.push(`/dreps/workflow/notes/${noteAdded}/update`);
      addSuccessAlert('Note Created Successfully!');
      setIsLoading(false);
    } catch (error) {
      addErrorAlert('Note Creation Failed!');
      console.log(error);
      setIsLoading(false);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <form
      className="mb-48 mt-4 rounded-3xl bg-slate-50 p-5 shadow-lg"
      onSubmit={handleSubmit(saveNote, onError)}
    >
      <NewNotePostForm
        register={register}
        control={control}
        errors={errors}
        isLoading={isLoading}
      />
    </form>
  );
};

export default NewNoteForm;
