import React, { memo, useEffect, useMemo, useState } from 'react';
import { Chip, Typography } from '@mui/material';
import Button from '@/components/atoms/Button';
import { postAddReaction } from '@/services/requests/postAddReaction';
import { postRemoveReaction } from '@/services/requests/postRemoveReaction';
import SingleNoteResponses from './SingleNoteResponses';
import { useDRepContext } from '@/context/drepContext';
import PostTextareaInput from '@/components/atoms/PostTextareaInput';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postAddComment } from '@/services/requests/postAddComment';
import { useGetNotesQuery } from '@/hooks/useGetNotesQuery';
import { processNoteContent } from '@/lib/noteContentProcessor/processNoteContent';
import * as marked from 'marked';
const SingleNote = ({
  note,
  currentVoter,
  isEnabled,
  isLoggedIn,
}: {
  note: any;
  currentVoter: string;
  isEnabled: boolean;
  isLoggedIn: boolean;
}) => {
  const { setIsWalletListModalOpen, setLoginModalOpen } = useDRepContext();
  const { refetch } = useGetNotesQuery();
  // Initial reaction state from the note prop
  const initialReactions = {
    like: 0,
    thumbsup: 0,
    thumbsdown: 0,
    rocket: 0,
  };
  // Count initial reactions

  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const FormSchema = z.object({
    comment: z.string(),
  });
  type InputType = z.infer<typeof FormSchema>;
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: '',
    },
  });
  // Update user reactions whenever currentVoter changes
  useEffect(() => {
    const updatedUserReactions = note.reactions.reduce((acc, reaction) => {
      if (reaction.voter === currentVoter) {
        acc[reaction.type] = true;
      }
      return acc;
    }, {});
    const updatedReactions = note.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, initialReactions);

    setUserReactions(updatedUserReactions);
    setReactions(updatedReactions);
  }, [currentVoter, note.reactions]);
  const startCommenting = () => {
    if (!isEnabled) {
      setIsWalletListModalOpen(true);
      return;
    }
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setIsCommenting(true);
  };
  const handleReaction = async (type) => {
    //to prevent orphan reaction till say wallet is done connecting
    if (!isEnabled) {
      setIsWalletListModalOpen(true);
      return;
    }
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    if (userReactions[type]) {
      // User has already reacted, so remove the reaction
      try {
        const res = await postRemoveReaction({
          type,
          parentId: note.note_id,
          parentEntity: 'note',
          voter: currentVoter,
        });

        // Update reactions state
        setReactions((prev) => ({
          ...prev,
          [type]: prev[type] - 1,
        }));

        // Remove the user's reaction
        setUserReactions((prev) => ({
          ...prev,
          [type]: false,
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      // User has not reacted, so add the reaction
      try {
        const res = await postAddReaction({
          type,
          parentId: note.note_id,
          parentEntity: 'note',
          voter: currentVoter,
        });

        // Update reactions state
        setReactions((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));

        // Set the user's reaction
        setUserReactions((prev) => ({
          ...prev,
          [type]: true,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const saveComment: SubmitHandler<InputType> = async (data) => {
    try {
      const { comment } = data;
      const res = await postAddComment({
        parentId: note.note_id,
        parentEntity: 'note',
        comment,
        voter: currentVoter,
      });
      reset({ comment: '' });
      setIsCommenting(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const noteContent = useMemo(
    () => processNoteContent(note.note_note_content),
    [note.note_note_content],
  );

  const reactionIcons = {
    like: '/svgs/reactions/heart.svg',
    thumbsup: '/svgs/reactions/thumb-up.svg',
    thumbsdown: '/svgs/reactions/thumb-down.svg',
    rocket: '/svgs/reactions/rocket.svg',
  };

  const reactionFilledIcons = {
    like: '/svgs/reactions/heart-filled.svg',
    thumbsup: '/svgs/reactions/thumb-up-filled.svg',
    thumbsdown: '/svgs/reactions/thumb-down-filled.svg',
    rocket: '/svgs/reactions/rocket-filled.svg',
  };
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white bg-opacity-70 shadow-md">
      <div className="flex flex-col gap-3 p-5">
        <Typography className="font-black" variant="h5">
          {note.note_note_title}
        </Typography>
        {!!noteContent &&
          noteContent.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <Typography
                  key={index}
                  dangerouslySetInnerHTML={{ __html: marked.parse(item) }}
                ></Typography>
              );
            } else if (React.isValidElement(item)) {
              return React.cloneElement(item, { key: index });
            }
          })}
        {!!note.note_note_tag && (
          <div className="flex flex-col gap-1">
            <p className="text-sm">Tags</p>
            <div className="flex flex-wrap gap-1">
              {note.note_note_tag.split(',').map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  color="primary"
                  className="w-fit text-black"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-5 bg-[#F3F5FF] px-5 py-1">
        <p className="text-sm">Submission Date:</p>
        <p className="text-sm">
          {new Date(note.note_createdAt).toDateString()}
        </p>
      </div>
      <div className="flex flex-col-reverse gap-5 p-5 md:flex-row">
        <div className="flex gap-2">
          {/* comment button, view responses */}
          {!isCommenting && (
            <Button handleClick={startCommenting}>Comment</Button>
          )}
          <Button
            variant="outlined"
            bgColor="transparent"
            handleClick={() => setShowResponses(!showResponses)}
          >
            {showResponses ? 'Hide' : 'View'} Responses
          </Button>
        </div>
        <div className="flex gap-5">
          {Object.keys(reactionIcons).map((type) => (
            <div
              key={type}
              className="flex flex-row-reverse items-center gap-1"
            >
              <div>{reactions[type]}</div>
              <div
                className="cursor-pointer"
                onClick={() => handleReaction(type)}
              >
                <img
                  src={
                    userReactions[type]
                      ? reactionFilledIcons[type]
                      : reactionIcons[type]
                  }
                  alt={type}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {isCommenting && (
        <form
          onSubmit={handleSubmit(saveComment, (error) => console.log(error))}
          className="flex flex-col gap-1 px-5 py-1"
        >
          <PostTextareaInput
            control={control}
            errors={errors}
            name="comment"
            label=""
          />
          <div className="flex flex-row items-center justify-center gap-2 sm:justify-end lg:gap-3">
            <Button type="submit">Comment</Button>
            <Button
              bgColor="transparent"
              variant="outlined"
              handleClick={() => setIsCommenting(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      {showResponses && (
        <>
          <hr />
          <SingleNoteResponses
            comments={note?.comments}
            currentVoter={currentVoter}
            isEnabled={isEnabled}
            isLoggedIn={isLoggedIn}
          />
        </>
      )}
    </div>
  );
};

export default memo(SingleNote);
