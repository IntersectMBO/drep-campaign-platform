import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/atoms/Button';
import { postAddComment } from '@/services/requests/postAddComment';
import { convertString } from '@/lib';
import { postRemoveReaction } from '@/services/requests/postRemoveReaction';
import { postAddReaction } from '@/services/requests/postAddReaction';
import { processContent } from '@/lib/ContentProcessor/processContent';
import MarkdownEditor from '@/components/atoms/MarkdownEditor';
import DisplayParsedContent from '@/components/atoms/DisplayParsedContent';


type CommentProps = {
  parentNoteId: number;
  comment: any; // Replace `any` with your comment type
  currentVoter: string;
  isEnabled: boolean;
  isLoggedIn: boolean;
  setIsWalletListModalOpen: Function;
  setLoginModalOpen: Function;
  depth?: number;
  handleRefetch?: Function;
  latestComment?: number;
};

const Comment: React.FC<CommentProps> = ({
  parentNoteId,
  comment,
  currentVoter,
  isEnabled,
  isLoggedIn,
  setIsWalletListModalOpen,
  setLoginModalOpen,
  depth = 0,
  handleRefetch,
  latestComment,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [userCommentReactions, setUserReactions] = useState({});
  const [reactionCommentCounts, setReactionCounts] = useState({});
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [currentLatestComment, setCurrentLatestComment] =
    useState(latestComment);
  const [commentContent, setCommentContent] = useState(null);

  useEffect(() => {
    if (currentLatestComment) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
        setCurrentLatestComment(null);
      }, 3000); // 3 seconds highlight

      return () => clearTimeout(timer);
    }
  }, [currentLatestComment]);

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
    },
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
    const initialReactionsCount = {
      like: comment.reactions.filter((reaction) => reaction.type === 'like')
        .length,
      thumbsup: comment.reactions.filter(
        (reaction) => reaction.type === 'thumbsup',
      ).length,
      thumbsdown: comment.reactions.filter(
        (reaction) => reaction.type === 'thumbsdown',
      ).length,
      rocket: comment.reactions.filter((reaction) => reaction.type === 'rocket')
        .length,
    };
    setReactionCounts(initialReactionsCount);
  }, [comment.reactions, currentVoter]);

  useEffect(() => {
    const content = () => processContent(comment.content);
    setCommentContent(content);
  }, [comment.content]);

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
      const res = await postAddComment({
        rootEntity: 'note',
        rootEntityId: parentNoteId,
        parentId: commentId,
        parentEntity: 'comment',
        comment,
        voter: currentVoter,
      });
      setCurrentLatestComment(res.id as number);
      reset({ comment: '' });
      setIsReplying(false);
      handleRefetch();
      setIsHighlighted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ marginLeft: depth * 20 }}
      className={`flex flex-col gap-2 px-2 py-1 ${depth > 0 && 'border-l pl-3'} ${
        isHighlighted && comment?.id == latestComment
          ? 'rounded bg-fuchsia-200 transition-colors duration-1000'
          : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <Typography className="font-bold underline" variant="subtitle1">
          {convertString(comment.voter, true)}
        </Typography>
        <div className="flex items-center gap-2 rounded bg-extra_gray px-2">
          <p className="text-sm">Posted:</p>
          <p className="text-sm">
            {new Date(comment?.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {!!commentContent && <DisplayParsedContent content={commentContent} />}

      <div className="flex flex-col justify-start gap-3 md:flex-row md:gap-5">
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
          <MarkdownEditor name="comment" control={control} errors={errors} />
          <div className="flex flex-row items-center justify-center gap-2 sm:justify-end">
            <Button type="submit">Comment</Button>
            <Button
              bgcolor="transparent"
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
            parentNoteId={parentNoteId}
            comment={childComment}
            currentVoter={currentVoter}
            isEnabled={isEnabled}
            isLoggedIn={isLoggedIn}
            setIsWalletListModalOpen={setIsWalletListModalOpen}
            setLoginModalOpen={setLoginModalOpen}
            depth={depth + 1}
            handleRefetch={handleRefetch}
          />
        ))}
    </div>
  );
};

export default Comment;
