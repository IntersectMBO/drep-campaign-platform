import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
interface ProfileUploadCardProps {
  registerUrl: any;
  control: any;
  setProfileUrl: any;
  isUpdate?: boolean;
  currentProfileUrl?: string;
}
const ProfileUploadCard = ({
  registerUrl,
  setProfileUrl,
  isUpdate,
  currentProfileUrl,
}: ProfileUploadCardProps) => {
  const [files, setFiles] = useState(null);
  const hiddenInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const {
    ref: registerRef,
    name,
    onChange,
    ...rest
  } = registerUrl('profileUrl');
  useEffect(() => {
    if (isUpdate && currentProfileUrl) {
      setPreview(currentProfileUrl);
    }
  }, [currentProfileUrl]);
  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(file);
      previewFile(file);
    } else {
      console.log('No files selected');
    }
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFiles(file);
      previewFile(file);
      setProfileUrl('profileUrl', e.dataTransfer.files);
    }
  };
  const handleRemove = () => {
    setFiles(null);
    setPreview(null);
    hiddenInputRef.current.value = '';
    setProfileUrl('profileUrl', null);
    setIsOverlay(false);
  };
  return (
    <div className="relative flex min-h-48 flex-col items-center justify-center gap-1 rounded-lg border-2 border-zinc-100 bg-violet-50 px-6 py-4 text-center">
      <div
        className="transparent absolute left-0 top-0 h-full w-full"
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDrop={(e) => {
          handleDrop(e).then();
        }}
      ></div>

      {!preview ? (
        <img src="/svgs/user-circle-filled.svg" alt="upload" />
      ) : (
        <div
          className="relative flex h-32 w-32 items-center justify-center "
          onMouseEnter={() => setIsOverlay(true)}
          onMouseLeave={() => setIsOverlay(false)}
        >
          <img src={preview} alt="Profile"/>
          <div
            className={`absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center  bg-slate-500 ${isOverlay ? 'opacity-90' : 'hidden'} cursor-pointer text-sm `}
            onClick={handleRemove}
          >
            Remove
          </div>
        </div>
      )}
      <p className="text-[11px] font-medium text-slate-500 mb-4">
        Drag and drop your photo or
      </p>
      <Button handleClick={() => document.getElementById('fileInput').click()}>
        Upload
      </Button>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        name={name}
        {...rest}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
        onChange={(e) => {
          handleFileSelect(e).then();
          onChange(e);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfileUploadCard;
