import React, { useEffect, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import UpdateNotePostForm from '../molecules/UpdateNotePostForm';
import { usePostUpdateNoteMutation } from '@/hooks/usePostUpdateNoteMutation';

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

const UpdateNoteForm = ({ noteId, initialValues }) => {
  const {
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const mutation = usePostUpdateNoteMutation();
  const { isEnabled, dRepIDBech32, stakeKey } = useCardano();
  const router = useRouter();
  const { setIsNotDRepErrorModalOpen } = useDRepContext();
  useEffect(() => {
    if (initialValues) {
      setValue('postTitle', initialValues?.note_title);
      setValue('postTag', initialValues?.note_tag);
      setValue('postText', initialValues?.note_content);
      setValue('postVisibility', initialValues?.note_visibility);
    }
  }, [initialValues]);
  const updateNote: SubmitHandler<InputType> = async (data) => {
    try {
      if (!dRepIDBech32 || dRepIDBech32 == '') {
        setIsNotDRepErrorModalOpen(true);
        return;
      }
      const stakeAddress = Address.from_bytes(
        Buffer.from(stakeKey, 'hex'),
      ).to_bech32();
      const { postTag, postText, postTitle, postVisibility } = data;
      const updatedNote = {
        note_title: postTitle,
        note_tag: postTag,
        note_content: postText,
        note_visibility: postVisibility,
        stake_addr: stakeAddress,
        voter: dRepIDBech32,
      };
      const res = mutation.mutateAsync({ noteId: noteId, note: updatedNote });
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
      onSubmit={handleSubmit(updateNote, onError)}
    >
      <UpdateNotePostForm
        register={register}
        control={control}
        errors={errors}
      />
    </form>
  );
};

export default UpdateNoteForm;
