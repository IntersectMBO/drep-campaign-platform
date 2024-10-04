import React from 'react';
import Button from './Button';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { useRouter } from 'next/navigation';
interface ProfileSubmitAreaProps {
  isUpdate?: boolean;
  isDisabled?: boolean; 
}
const ProfileSubmitArea = ({ isUpdate, isDisabled=false }: ProfileSubmitAreaProps) => {
  const { isEnabled } = useCardano();
  const router = useRouter();
  const {
    currentRegistrationStep,
    setCurrentRegistrationStep,
    setStep1Status,
    setStep2Status,
    setStep3Status,
    setStep4Status,
  } = useDRepContext();

  const handleNavigate = (step: number) => {
    if (!isUpdate) {
      router.push('/dreps');
      return
    };
    const submitButton = document.getElementById(
      'profile-submit-button',
    ) as HTMLButtonElement;
    submitButton.click();
    if (currentRegistrationStep === 1) {
      setStep2Status('active');
      setCurrentRegistrationStep(2);
      router.push(
        `/dreps/workflow/profile/update/step${currentRegistrationStep + 1}`,
      );
    } else if (currentRegistrationStep === 2) {
      setStep3Status('active');
      setCurrentRegistrationStep(3);
      router.push(
        `/dreps/workflow/profile/update/step${currentRegistrationStep + 1}`,
      );
    } else if (currentRegistrationStep === 3) {
      setStep4Status('active');
      setCurrentRegistrationStep(4);
      router.push(`/dreps/workflow/profile/update/step${currentRegistrationStep + 1}`)
    } else if (currentRegistrationStep === 4) {
      setStep4Status('success');
    }
  };
  return (
    <div className="mt-4 flex flex-row items-center justify-center md:justify-end">
      <div className="flex flex-row items-center justify-center gap-2">
        <Button
          type="submit"
          id="profile-submit-button"
          data-testid="profile-submit-button"
          sx={(!isEnabled || isDisabled)  && { pointerEvents: 'none' } }
        >
          <p className="px-5 text-center text-sm font-medium leading-4  text-white">
            {!isUpdate ? 'Create' : 'Update'}
          </p>
        </Button>
        <Button
          variant="outlined"
          bgColor="transparent"
          handleClick={handleNavigate}
          id="next_button"
          sx={(!isEnabled || isDisabled) && { pointerEvents: 'none' }}
        >
          <p className="px-5 text-center text-sm font-medium leading-4 text-blue-800">
            {isUpdate ? 'Next' : 'Cancel'}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default ProfileSubmitArea;
