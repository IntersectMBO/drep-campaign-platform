import { stepStatus, useDRepContext } from '@/context/drepContext';
import React from 'react';

const stepStatusChip = (
  stepNumber: number,
  stepText: string,
  stepStatus: stepStatus['status'],
) => {
  if (stepStatus === 'active') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 border-b-2 border-b-blue-800 px-16 py-3">
        <p className="h-8 w-8 rounded-full bg-blue-800 p-1 text-center text-white">
          {stepNumber}
        </p>
        <p>{stepText}</p>
      </div>
    );
  } else if (stepStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 border-b-2 border-b-gray-300 px-16 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 p-1 text-white">
          <img src="/check.svg" alt="check" className="h-8 w-8" />
        </div>
        <p>{stepText}</p>
      </div>
    );
  } else {
    return (
    <div className="flex flex-col items-center justify-center gap-1 border-b-2 border-b-gray-300 px-16 py-3">
      <p className="h-8 w-8 rounded-full bg-gray-300 p-1 text-center text-white">
        {stepNumber}
      </p>
      <p>{stepText}</p>
    </div>
    )
  }
};
const SetupProgressBar = () => {
  const { step1Status, step2Status, step3Status, step4Status } =
    useDRepContext();
  return (
    <div className="flex w-full flex-row items-center justify-around gap-1">
      {stepStatusChip(1, 'Profile set up', step1Status)}
      {stepStatusChip(2, 'Platform statement', step2Status)}
      {stepStatusChip(3, 'Metadata set up', step3Status)}
      {stepStatusChip(4, 'Social media', step4Status)}
    </div>
  );
};

export default SetupProgressBar;
