import Comment from './Comment';
import { useDRepContext } from '@/context/drepContext';
import { Typography } from '@mui/material';

const SingleNoteResponses = ({
  noteId,
  comments,
  isEnabled,
  isLoggedIn,
  currentVoter,
  handleRefetch,
  latestComment,
}) => {
  const { setIsWalletListModalOpen, setLoginModalOpen } = useDRepContext();
  return (
    <div className="flex flex-col gap-3 p-2 pl-8">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            parentNoteId={noteId}
            comment={comment}
            currentVoter={currentVoter}
            depth={0}
            isEnabled={isEnabled}
            isLoggedIn={isLoggedIn}
            setIsWalletListModalOpen={setIsWalletListModalOpen}
            setLoginModalOpen={setLoginModalOpen}
            handleRefetch={handleRefetch}
            latestComment={latestComment}
          />
        ))
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Typography variant="h6">No comments yet</Typography>
          <Typography variant="caption">
            Be the first to start the conversation!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default SingleNoteResponses;
