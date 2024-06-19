import React, { useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { stepStatus, useDRepContext } from '@/context/drepContext';
import { usePathname } from 'next/navigation';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
const stepStatusChip = (stepNumber, stepText, stepStatus, handleClick) => {
  const baseClasses = "flex flex-col items-center justify-center gap-1 px-16 py-3 cursor-pointer";
  const activeClasses = "border-b-2 border-b-blue-800";
  const inactiveClasses = "border-b-2 border-b-gray-300";
  const numberClasses = "h-8 w-8 rounded-full text-center text-white p-1";
  const onClick = () => handleClick(stepNumber);
  if (stepStatus === 'active') {
    return (
      <div className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
        <p className={`${numberClasses} bg-blue-800`}>{stepNumber}</p>
        <p className="text-center">{stepText}</p>
      </div>
    );
  } else if (stepStatus === 'success' || stepStatus === 'update') {
    return (
      <div className={`${baseClasses} ${stepStatus === 'update' ? activeClasses : inactiveClasses}`} onClick={onClick}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 text-white">
          <img src="/check.svg" alt="check" className="h-8 w-8" />
        </div>
        <p className="text-center">{stepText}</p>
      </div>
    );
  } else {
    return (
      <div className={`${baseClasses} ${inactiveClasses}`} onClick={onClick}>
        <p className={`${numberClasses} bg-gray-300`}>{stepNumber}</p>
        <p className="text-center">{stepText}</p>
      </div>
    );
  }
};

const SetupProgressBar = () => {
  const {
    step1Status, step2Status, step3Status, step4Status,step5Status, setStep1Status, setStep2Status,
    setStep3Status, setStep4Status,setStep5Status,  setCurrentRegistrationStep, currentLocale
  } = useDRepContext();
  const pathname= usePathname()
  const router = useRouter();
  const containerRef = useRef(null);
  const stepRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const {addWarningAlert}=useGlobalNotifications()
  const handleNavigate = (step) => {
    if (pathname=== `/${currentLocale}/dreps/workflow/profile/new`){
      addWarningAlert('You need to complete this step first.')
      return
    };
    if (step === 1) {
      setStep1Status('active');
      setCurrentRegistrationStep(1);
      router.push(`/dreps/workflow/profile/update/step${step}`);
    } else if (step === 2) {
      setStep2Status('active');
      setCurrentRegistrationStep(2);
      router.push(`/dreps/workflow/profile/update/step${step}`);
    } else if (step === 3) {
      setStep3Status('active');
      setCurrentRegistrationStep(3);
      router.push(`/dreps/workflow/profile/update/step${step}`);
    } else if (step === 4) {
      setStep4Status('active');
      setCurrentRegistrationStep(4);
      router.push(`/dreps/workflow/profile/update/step${step}`);
    } else if (step === 5) {
      setStep5Status('active');
      setCurrentRegistrationStep(5);
      router.push(`/dreps/workflow/profile/update/step${step}`);
    } 
  };

  useEffect(() => {
    const activeIndex = [step1Status, step2Status, step3Status, step4Status, step5Status].findIndex(status => status === 'active');
    if (activeIndex !== -1 && stepRefs[activeIndex].current) {
      const activeStep = stepRefs[activeIndex].current;
      const container = containerRef.current;

      const containerWidth = container.offsetWidth;
      const stepWidth = activeStep.offsetWidth;
      const stepOffsetLeft = activeStep.offsetLeft;

      container.scrollTo({
        left: stepOffsetLeft - containerWidth / 2 + stepWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [step1Status, step2Status, step3Status, step4Status, step5Status]);

  return (
    <div className="progress_bar w-full inline-flex whitespace-nowrap gap-5 overflow-x-scroll" ref={containerRef}>
      <div ref={stepRefs[0]}>{stepStatusChip(1, 'Profile set up', step1Status, handleNavigate)}</div>
      <div ref={stepRefs[1]}>{stepStatusChip(2, 'Verify DRep profile', step2Status, handleNavigate)}</div>
      <div ref={stepRefs[2]}>{stepStatusChip(3, 'Platform statement', step3Status, handleNavigate)}</div>
      <div ref={stepRefs[3]}>{stepStatusChip(4, 'Metadata set up', step4Status, handleNavigate)}</div>
      <div ref={stepRefs[4]}>{stepStatusChip(5, 'Social media', step5Status, handleNavigate)}</div>
    </div>
  );
};

export default SetupProgressBar;
