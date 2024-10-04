import React from 'react';
import Button from './Button';
import { useCardano } from '@/context/walletContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const PostSubmitArea = ({
  isUpdating = false,
  showViewTimeline = true,
}: {
  isUpdating?: boolean;
  showViewTimeline?: boolean;
}) => {
  const router = useRouter();
  const { isEnabled, dRepIDBech32 } = useCardano();
  const handleCancel = () => {
    router.back(); // Redirects to the previous page
  };
  return (
    <div
      className={`flex w-full flex-row items-center ${!!showViewTimeline ? 'justify-between' : 'justify-end'}`}
    >
      {showViewTimeline && (
        <Button
          variant="text"
          bgColor="transparent"
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
          disabled={!isUpdating}
        >
          <Link
            href={`/dreps/${dRepIDBech32}`}
            className="text-center text-sm font-medium leading-4 text-blue-800"
          >
            View In Timeline
          </Link>
        </Button>
      )}

      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outlined"
          bgColor="transparent"
          handleClick={handleCancel}
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
        >
          <p className="text-center text-sm font-medium leading-4 text-blue-800">
            Cancel
          </p>
        </Button>
        <Button
          type="submit"
          data-testid="post-submit-button"
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
        >
          <p className="text-center text-sm font-medium leading-4 text-white">
            Post
          </p>
        </Button>
      </div>
    </div>
  );
};

export default PostSubmitArea;
