import React, { useEffect, useState } from 'react';
import NewNotePostForm from '../molecules/NewNotePostForm';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { usePostNewNoteMutation } from '@/hooks/usePostNewNoteMutation';
const FormSchema = z.object({
  postTitle: z
    .string()
    .min(3, 'Post Title cant be less than 3 chars')
    .max(12, "Post Title can't be more than 12 chars"),
  postTag: z
    .string()
    .min(3, 'Post Tag cant be less than 3 chars')
    .max(12, "Post Tag can't be more than 12 chars"),
  postText: z.string().min(10, 'Post Text cant be less than 10 chars'),
  postVisibility: z.string().min(1, "Visibilty status can't be empty"),
});
type InputType = z.infer<typeof FormSchema>;

const NewNoteForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const { isEnabled, dRepIDBech32, stakeKey } = useCardano();
  const router = useRouter();
  const mutation = usePostNewNoteMutation();
  const { setIsNotDRepErrorModalOpen } = useDRepContext();
  const saveNote: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const { postTag, postText, postTitle, postVisibility } = data;
      const newNote = {
        note_title: postTitle,
        note_tag: postTag,
        note_content: postText,
        note_visibility: postVisibility,
        stake_addr: stakeAddress,
        voter: dRepIDBech32,
      };
      const { noteAdded } = await mutation.mutateAsync({ note: newNote });
      router.push(`/dreps/workflow/notes/${noteAdded}/update`);
    } catch (error) {
      console.log(error);
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
      <NewNotePostForm register={register} control={control} errors={errors} />
    </form>
  );
};

export default NewNoteForm;
