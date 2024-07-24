import React, { useEffect, useRef, useState } from 'react';
import Button from '../atoms/Button';
import { useScreenDimension } from '@/hooks';
import { HtmlTooltip } from '../atoms/HoverChip';
import { urls } from '@/constants';
import axiosInstance from '@/services/axiosInstance';
import { CircularProgress } from '@mui/material';
import { MDXEditorMethods } from '@mdxeditor/editor';
interface MultipartDataFormProps {
  activeForm: string;
  setImagePayload?: (payload: any) => void;
  setLinkPayload?: (payload: any) => void;
  nullify: () => void;
  editor?: MDXEditorMethods | any; // any type of editor
}
const MultipartDataForm = ({
  activeForm,
  setImagePayload,
  setLinkPayload,
  nullify,
  editor,
}: MultipartDataFormProps) => {
  const [files, setFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileSize, setFileSize] = useState('');
  const [links, setLinks] = useState(null);
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [currentLinkURL, setCurrentLinkURL] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const formatFileSize = (sizeInBytes) => {
    const kiloBytes = sizeInBytes / 1024;
    const megaBytes = kiloBytes / 1024;
    const gigaBytes = megaBytes / 1024;

    if (gigaBytes >= 1) {
      return `${gigaBytes.toFixed(2)} GB`;
    } else if (megaBytes >= 1) {
      return `${megaBytes.toFixed(2)} MB`;
    } else if (kiloBytes >= 1) {
      return `${kiloBytes.toFixed(2)} KB`;
    } else {
      return `${sizeInBytes} Bytes`;
    }
  };
  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFiles(files);
      previewFile(files);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    const allowedTypes = [
      'image/png',
      'application/pdf',
      'image/webp',
      'image/jpeg',
      'image/svg',
      'image/jpg',
    ];
    if (files && files.length > 0) {
      const validFiles = Array.from(files as FileList).filter((file) =>
        allowedTypes.includes(file.type),
      );
      setFiles(validFiles);
      previewFile(validFiles);
    } else {
      console.log('No files selected');
    }
  };
  const handleAddLink = () => {
    const title = currentLinkTitle;
    const url = currentLinkURL;
    if (title && url) {
      setLinks((prev) => {
        if (prev && prev.length > 0) {
          return [...prev, { title, url }];
        } else {
          return [{ title, url }];
        }
      });
      setCurrentLinkTitle('');
      setCurrentLinkURL('');
    }
  };
  const previewFile = (files) => {
    const previews = Array.from(files as FileList).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      setPreview((prev) => {
        if (prev && prev.length > 0) {
          return [...prev, ...results];
        } else {
          return results;
        }
      });
    });
  };
  const uploadFilesAndSendIds = async () => {
    try {
      setIsUploading(true);
      const insertedFiles = await Promise.all(
        Array.from(files as FileList).map(async (file) => {
          const formData = new FormData();
          formData.append('attachment', file);
          formData.append('parentEntity', 'note');
          formData.append('parentId', null);
          const mimeType = file.type;
          const res = await axiosInstance.post(
            `${urls.baseServerUrl}/api/attachments/add`,
            formData,
          );
          return { name: res.data.name, type: mimeType };
        }),
      );
      setIsUploading(false);
      insertedFiles.forEach((file) => {
        const encodedFileName = encodeURIComponent(file.name);
        const markdown = file.type.includes('pdf')
          ? `[pdf](${urls.baseServerUrl}/api/attachments/${encodedFileName})`
          : `![image](${urls.baseServerUrl}/api/attachments/${encodedFileName})`;
        if (editor)
          editor.focus(
            () => {
              editor.insertMarkdown(markdown);
            },
            {
              defaultSelection: 'rootEnd',
            },
          );
        file['markdown'] = markdown;
        return file;
      });
      setImagePayload(insertedFiles);
      setFiles(null);
      setPreview(null);
      nullify();
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };
  const sendLink = () => {
    let linksToInsert = [];
    if (!links || links.length === 0) {
      linksToInsert = [{ title: currentLinkTitle, url: currentLinkURL }];
    } else {
      linksToInsert = links;
    }

    linksToInsert.forEach((link) => {
      const markdown = `[${link.title}](${link.url})`;
      if (editor) editor.insertMarkdown(markdown);
      link['markdown'] = markdown;
      return link;
    });
    if (!editor) setLinkPayload(linksToInsert);
    setCurrentLinkTitle('');
    setCurrentLinkURL('');
    setLinks(null);
    nullify();
  };
  // Handle clicks/taps outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        !event.target['closest']('.image-add-button') &&
        !event.target['closest']('.link-add-button')
      ) {
        nullify();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [nullify]);
  return (
    <div
      ref={formRef}
      className={`flex min-h-[8.75rem] w-full flex-col text-nowrap rounded-lg bg-white p-5 shadow-lg`}
    >
      {activeForm === 'image' ? (
        <>
          <div className="h-11 text-[1.375rem] font-bold text-zinc-800">
            Add File
          </div>
          <div
            className="flex h-36 items-center justify-center rounded-lg border-2 border-zinc-100 bg-violet-50 px-6 py-4 text-center"
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDrop={handleDrop}
          >
            <p className="text-[0.6875rem] font-medium text-slate-500">
              Drag and drop file
            </p>
          </div>
          <div
            className="flex cursor-pointer flex-col items-center justify-center  bg-white p-4"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <p className="text-center text-lg font-normal text-blue-800">
              Load from computer
            </p>
          </div>
          <p className="text-start text-sm font-medium text-black">
            Supported file formats: PNG, JPEG, PDF.
            <br />
            Max file size 10mb.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {preview &&
              preview
                .slice(0, 4)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Preview Unavailable"
                    className={`block max-w-20 rounded-lg grid-item-${index + 1}`}
                  />
                ))}
            {preview && preview.length > 4 && (
              <div className="flex items-center justify-center rounded-lg bg-gray-200">
                <p className="font-medium text-gray-600">
                  +{preview.length - 4}
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            name="files"
            id="fileInput"
            accept=".png, .pdf, .webp, .jpg, .jpeg, .gif"
            multiple={true}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <br />
          {fileSize && <p>File Size: {fileSize}</p>}
          {files && (
            <div className="mt-2 flex flex-col gap-2">
              <Button handleClick={uploadFilesAndSendIds}>
                {isUploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <p>Add File</p>
                )}
              </Button>
              <Button
                handleClick={() => {
                  nullify();
                  setPreview(null);
                  setFiles(null);
                }}
                variant="outlined"
                bgColor="transparent"
              >
                <p>Cancel</p>
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="h-11 text-[1.375rem] font-bold text-zinc-800">
            Add a Link
          </div>
          <div className="flex flex-col gap-1">
            <label>Title</label>
            <input
              type="text"
              className={`w-full rounded-full border border-zinc-100 py-3 pl-5 pr-3`}
              data-testid="URL-title-input"
              placeholder="Paste or type URL title here"
              value={currentLinkTitle}
              onChange={(e) => setCurrentLinkTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>URL</label>
            <input
              type="text"
              className={`w-full rounded-full border border-zinc-100 py-3 pl-5 pr-3`}
              data-testid="URL-input"
              placeholder="Paste or type URL here"
              value={currentLinkURL}
              onChange={(e) => setCurrentLinkURL(e.target.value)}
            />
          </div>
          <div
            className="flex items-center justify-end p-3"
            onClick={handleAddLink}
          >
            <p className="cursor-pointer text-blue-800"> + Add other link</p>
          </div>
          {links && (
            <div className="flex flex-col gap-2">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-xl"
                >
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <div className="flex w-full flex-row">
                          <img src="/svgs/notesvgs/link.svg" alt="" />
                          <a
                            href={link.url}
                            target="_blank"
                            className="text-sm text-blue-300 underline"
                          >
                            {link.url}
                          </a>
                        </div>
                      </React.Fragment>
                    }
                    arrow
                    placement="top"
                  >
                    <p className="text-blue-400">{link.title}</p>
                  </HtmlTooltip>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-col gap-2">
            <Button handleClick={sendLink}>
              <p>{links && links.length > 1 ? 'Add Links' : 'Add Link'}</p>
            </Button>
            <Button
              handleClick={() => {
                nullify();
                setPreview(null);
                setFiles(null);
              }}
              variant="outlined"
              bgColor="transparent"
            >
              <p>Cancel</p>
            </Button>
          </div>
          <br />
        </>
      )}
    </div>
  );
};

export default MultipartDataForm;
