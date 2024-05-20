import React from 'react';
import Button from './Button';
import { useCardano } from '@/context/walletContext';
interface ProfileSubmitAreaProps {
  isUpdate?: boolean;
}
const ProfileSubmitArea = ({isUpdate}:ProfileSubmitAreaProps) => {
  const { isEnabled } = useCardano();
  return (
    <div className="flex mt-4 flex-row items-center justify-center md:justify-end">
      <div className="flex flex-row items-center justify-center gap-2">
        <Button
          type="submit"
          data-testid="profile-submit-button"
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
        >
          <p className="text-center text-sm font-medium leading-4 text-white  px-5">
            {!isUpdate?"Create":"Update"}
          </p>
        </Button>
        <Button
          variant="outlined"
          bgColor="transparent"
          sx={!isEnabled ? { pointerEvents: 'none' } : {}}
        >
          <p className="text-center text-sm font-medium leading-4 text-blue-800 px-5">
            {isUpdate?"Next":"Cancel"}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default ProfileSubmitArea;
