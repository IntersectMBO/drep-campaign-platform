import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/atoms/Button';
import PostTextareaInput from '@/components/atoms/PostTextareaInput';
import { postAddComment } from '@/services/requests/postAddComment';
import { convertString } from '@/lib';
import { postRemoveReaction } from '@/services/requests/postRemoveReaction';
import { postAddReaction } from '@/services/requests/postAddReaction';
import * as marked from 'marked'
type CommentProps = {
  comment: any; // Replace `any` with your comment type
  currentVoter: string;
  isEnabled: boolean;
  isLoggedIn: boolean;
  refetch: Function;
  setIsWalletListModalOpen: Function;
  setLoginModalOpen: Function;
  depth?: number;
};

const Comment: React.FC<CommentProps> = ({
  comment,
  currentVoter,
  isEnabled,
  isLoggedIn,
  refetch,
  setIsWalletListModalOpen,
  setLoginModalOpen,
  depth = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [userCommentReactions, setUserReactions] = useState({});
  const [reactionCommentCounts, setReactionCounts] = useState({});

  const FormSchema = z.object({
    comment: z.string().min(1, 'Comment is required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: '',
    }
  });

  type InputType = z.infer<typeof FormSchema>;

  useEffect(() => {
    const updatedUserReactions = comment.reactions.reduce((acc, reaction) => {
      if (reaction.voter === currentVoter) {
        acc[reaction.type] = true;
      }
      return acc;
    }, {});
    setUserReactions(updatedUserReactions);

    const initialReactionCounts = comment.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});
    setReactionCounts(initialReactionCounts);
  }, [comment.reactions, currentVoter]);

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

  const handleReaction = async (commentId, type) => {
    if (!isEnabled) {
      setIsWalletListModalOpen(true);
      return;
    }
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    if (userCommentReactions[type]) {
      try {
        await postRemoveReaction({
          type,
          parentId: commentId,
          parentEntity: 'comment',
          voter: currentVoter,
        });
        setUserReactions((prev) => ({ ...prev, [type]: false }));
        setReactionCounts((prev) => ({
          ...prev,
          [type]: (prev[type] || 0) - 1,
        }));
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await postAddReaction({
          type,
          parentId: commentId,
          parentEntity: 'comment',
          voter: currentVoter,
        });
        setUserReactions((prev) => ({ ...prev, [type]: true }));
        setReactionCounts((prev) => ({
          ...prev,
          [type]: (prev[type] || 0) + 1,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const saveComment = async (data: InputType, commentId: number) => {
    try {
      const { comment } = data;
      await postAddComment({
        parentId: commentId,
        parentEntity: 'comment',
        comment,
        voter: currentVoter,
      });
      reset({ comment: '' });
      setIsReplying(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ marginLeft: depth * 20 }}
      className={`flex flex-col gap-2 ${depth > 0 && 'border-l pl-3'}`}
    >
      <Typography className="font-bold" variant="subtitle1">
        {convertString(comment.voter, true)}
      </Typography>
      <Typography
        dangerouslySetInnerHTML={{ __html: marked.parse(comment.content) }}
        variant="caption"
      ></Typography>
      <div className="flex flex-col justify-start gap-3 md:gap-5 md:flex-row">
        {!isReplying && (
          <div className="w-fit">
            <Button handleClick={() => setIsReplying(true)}>Reply</Button>
          </div>
        )}
        <div className="flex gap-5">
          {Object.keys(reactionIcons).map((type) => (
            <div
              key={type}
              className="flex flex-row-reverse items-center gap-1"
            >
              <div>{reactionCommentCounts[type] || 0}</div>
              <div
                className="cursor-pointer"
                onClick={() => handleReaction(comment.id, type)}
              >
                <img
                  src={
                    userCommentReactions[type]
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

      {isReplying && (
        <form
          onSubmit={handleSubmit(
            (data) => saveComment(data, comment.id),
            (error) => console.log(error),
          )}
          className="flex flex-col gap-1 px-5 py-1"
        >
          <PostTextareaInput
            control={control}
            errors={errors}
            name="comment"
            label=""
          />
          <div className="flex flex-row items-center justify-center gap-2 sm:justify-end lg:w-[80%] lg:gap-3">
            <Button type="submit">Comment</Button>
            <Button
              bgColor="transparent"
              variant="outlined"
              handleClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {comment.comments &&
        comment.comments.map((childComment) => (
          <Comment
            key={childComment.id}
            comment={childComment}
            currentVoter={currentVoter}
            isEnabled={isEnabled}
            isLoggedIn={isLoggedIn}
            refetch={refetch}
            setIsWalletListModalOpen={setIsWalletListModalOpen}
            setLoginModalOpen={setLoginModalOpen}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

export default Comment;
