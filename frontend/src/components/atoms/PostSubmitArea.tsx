'use client';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import { useCardano } from '@/context/walletContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DotsLoader from './DotsLoader';

type PostSubmitAreaProps = {
  isUpdating?: boolean;
  showViewTimeline?: boolean;
  isLoading?: boolean;
  noteCreatedAt?: string;
};

const PostSubmitArea = ({
  isUpdating = false,
  showViewTimeline = true,
  isLoading,
  noteCreatedAt,
}: PostSubmitAreaProps) => {
  const [bgColor, setBgColor] = useState('transparent');
  const TEN_MINUTES = 10 * 60 * 1000;

  const router = useRouter();
  const { isEnabled, dRepIDBech32 } = useCardano();

  const isRecentlyCreated = new Date().getTime() - new Date(noteCreatedAt).getTime() <= TEN_MINUTES;

  useEffect(() => {
    if (isRecentlyCreated) {
      let toggle = false;
      const interval = setInterval(() => {
        toggle = !toggle;
        setBgColor(toggle ? '#f5d0fe' : 'transparent');
      }, 500);

      const stopTimer = setTimeout(() => {
        clearInterval(interval);
        setBgColor('transparent');
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(stopTimer);
      };
    }
  }, [isRecentlyCreated]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <div
      className={`flex w-full flex-row items-center ${!!showViewTimeline ? 'justify-between' : 'justify-end'}`}
    >
      {showViewTimeline && (
        <Button
          variant="text"
          bgcolor={bgColor}
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
          disabled={!isUpdating}
          className="duration-3000 transition-all ease-linear"
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
          bgcolor="transparent"
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
          className="flex items-center gap-2"
        >
          {!isLoading && (
            <p className="text-center text-sm font-medium leading-4 text-white">
              Post
            </p>
          )}
          {isLoading && (
            <div className="mx-auto transition-all duration-300 ease-linear">
              <DotsLoader size={10} shadowOffset={12} />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostSubmitArea;
