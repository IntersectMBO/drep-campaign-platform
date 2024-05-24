import React from 'react';
import PostInput from '../atoms/PostInput';
import PostTextareaInput from '../atoms/PostTextareaInput';
import ProfileSubmitArea from '../atoms/ProfileSubmitArea';
import ProfileUploadCard from '../atoms/ProfileUploadCard';

const NewProfileForm = ({ register, control, errors, setProfileUrl }) => {
  return (
    <div className="mt-3 flex flex-col gap-4">
      <PostInput
        inputName={'Name'}
        id={'profileName'}
        placeholder={'Name'}
        registerValue={register}
        errors={errors}
        dataTestId={'profile-name-input'}
      />
      <ProfileUploadCard registerUrl={register} control={control} setProfileUrl={setProfileUrl}/>
      <ProfileSubmitArea />
    </div>
  );
};

export default NewProfileForm;
