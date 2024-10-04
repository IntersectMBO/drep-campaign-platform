import { useCardano } from '@/context/walletContext';
import React from 'react';

const PostVisibilityInput = ({ registerVisibility, errors }) => {
  const { isEnabled } = useCardano();
  return (
    <div className="flex flex-col items-start justify-center">
      <p>Set Visibility</p>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <input
          id="everyone"
          type="radio"
          value="everyone"
          disabled={!isEnabled}
          {...registerVisibility('postVisibility')}
          name="postVisibility"
          className="cursor-pointer"
        />
        <label className="cursor-pointer" htmlFor="everyone">
          Everyone
        </label>
        <input
          id="delegators"
          type="radio"
          value="delegators"
          {...registerVisibility('postVisibility')}
          disabled={!isEnabled}
          name="postVisibility"
          className="cursor-pointer"
        />
        <label className="cursor-pointer" htmlFor="delegators">
          Delegators only
        </label>
        <input
          id="myself"
          type="radio"
          value="myself"
          {...registerVisibility('postVisibility')}
          disabled={!isEnabled}
          name="postVisibility"
          className="cursor-pointer"
        />
        <label className="cursor-pointer" htmlFor="myself">
          Myself
        </label>
      </div>
      <div className="text-sm text-red-500" data-testid="error-msg">
        <span>{errors?.postVisibility && errors?.postVisibility?.message}</span>
      </div>
    </div>
  );
};

export default PostVisibilityInput;
