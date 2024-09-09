import { useCardano } from '@/context/walletContext';
import React from 'react';

const TextAreaInput = ({
  inputName,
  id,
  placeholder,
  registerValue,
  errors,
  dataTestId,
}) => {
  const { isEnabled } = useCardano();
  return (
    <div className="flex flex-col gap-1">
      <label>{inputName}</label>
      <textarea
        type="text"
        className={`border py-3 pl-5 pr-3 ${
          !isEnabled && 'pointer-events-none'
        }  rounded-md border-zinc-100`}
        data-testid={dataTestId}
        {...registerValue(id)}
        placeholder={placeholder}
        readOnly={!isEnabled}
      />
      <div className="text-sm text-red-700" data-testid="error-msg">
        {errors[id] && errors[id].message}
      </div>
    </div>
  );
};

export default TextAreaInput;
