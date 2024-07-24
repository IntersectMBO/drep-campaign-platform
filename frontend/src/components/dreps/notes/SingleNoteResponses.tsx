import { useEffect, useState } from 'react';
import Comment from './Comment';
import { useGetNotesQuery } from '@/hooks/useGetNotesQuery';
import { useDRepContext } from '@/context/drepContext';
import { Typography } from '@mui/material';

const SingleNoteResponses = ({
  comments,
  isEnabled,
  isLoggedIn,
  currentVoter,
}) => {
  const { refetch } = useGetNotesQuery();
  const { setIsWalletListModalOpen, setLoginModalOpen } = useDRepContext();
  return (
    <div className="flex flex-col gap-3 p-2 pl-8">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentVoter={currentVoter}
            depth={0}
            refetch={refetch}
            isEnabled={isEnabled}
            isLoggedIn={isLoggedIn}
            setIsWalletListModalOpen={setIsWalletListModalOpen}
            setLoginModalOpen={setLoginModalOpen}
          />
        ))
      ) : (
        <div className='flex flex-col gap-1 items-center'>
          <Typography variant='h6'>No comments yet</Typography>
          <Typography variant='caption'>Be the first to start the conversation!</Typography>
        </div>
      )}
    </div>
  );
};

export default SingleNoteResponses;
