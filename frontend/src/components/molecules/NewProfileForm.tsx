import React from 'react';
import PostInput from '../atoms/PostInput';
import PostTextareaInput from '../atoms/PostTextareaInput';
import ProfileSubmitArea from '../atoms/ProfileSubmitArea';
import ProfileUploadCard from '../atoms/ProfileUploadCard';
import TextAreaInput from '../atoms/TextAreaInput';

const NewProfileForm = ({ register, control, errors, setProfileUrl, currentProfileUrl }) => {
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
      <PostInput
        inputName={'Bio'}
        id={'profileBio'}
        placeholder={'Bio'}
        registerValue={register}
        errors={errors}
        dataTestId={'profile-bio-input'}
      />
      <PostInput
        inputName={'Email'}
        id={'profileEmail'}
        placeholder={'Email'}
        registerValue={register}
        errors={errors}
        dataTestId={'profile-email-input'}
      />
      <PostInput
        inputName={'Payment address'}
        id={'paymentAddress'}
        placeholder={'An address for payments'}
        registerValue={register}
        errors={errors}
        dataTestId={'payment-address-input'}
      />
      <TextAreaInput
        inputName={'Objectives'}
        id={'objectives'}
        placeholder={'Your objectives'}
        registerValue={register}
        errors={errors}
        dataTestId={'objective-input'}
      />
      <TextAreaInput
        inputName={'Qualifications'}
        id={'qualifications'}
        placeholder={'Your qualifications'}
        registerValue={register}
        errors={errors}
        dataTestId={'qualification-input'}
      />
      <TextAreaInput
        inputName={'Motivations'}
        id={'motivations'}
        placeholder={'Your motivations'}
        registerValue={register}
        errors={errors}
        dataTestId={'motivation-input'}
        />
      <ProfileUploadCard registerUrl={register} control={control} setProfileUrl={setProfileUrl} currentProfileUrl={currentProfileUrl}/>
      <ProfileSubmitArea />
    </div>
  );
};

export default NewProfileForm;
