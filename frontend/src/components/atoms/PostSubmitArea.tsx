import React from 'react';
import Button from './Button';
import { useCardano } from '@/context/walletContext';
import Link from 'next/link';

const PostSubmitArea = ({isUpdating=false}:{isUpdating?: boolean}) => {
  const { isEnabled, dRepIDBech32 } = useCardano();
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="ml-5 flex items-center justify-center">
        <Button
          variant="text"
          bgColor="transparent"
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
          disabled={!isUpdating}
        >
          <Link href={`/dreps/${dRepIDBech32}`} className="text-center text-sm font-medium leading-4 text-blue-800">
            View In Timeline
          </Link>
        </Button>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outlined"
          bgColor="transparent"
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
