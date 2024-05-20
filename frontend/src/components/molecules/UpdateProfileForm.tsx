import React from 'react';
import PostInput from '../atoms/PostInput';
import ProfileSubmitArea from '../atoms/ProfileSubmitArea';
import ProfileUploadCard from '../atoms/ProfileUploadCard';
interface UpdateProfileFormProps {
  register: any;
  control: any;
  errors: any;
  setProfileUrl: any;
  currentProfileUrl?: string;
}
const UpdateProfileForm = ({ register, control, errors, setProfileUrl , currentProfileUrl  }:UpdateProfileFormProps) => {
  const isUpdate = true;
  return (
    <div className="mt-3 flex flex-col gap-3">
      <PostInput
        inputName={'Name'}
        id={'profileName'}
        placeholder={'Name'}
        registerValue={register}
        errors={errors}
        dataTestId={'profile-name-input'}
      />
      <ProfileUploadCard registerUrl={register} control={control} setProfileUrl={setProfileUrl} isUpdate={isUpdate} currentProfileUrl={currentProfileUrl}/>
      <ProfileSubmitArea isUpdate={isUpdate}/>
    </div>
  );
};

export default UpdateProfileForm;
