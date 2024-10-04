import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ModalWrapper } from './modal/ModalWrapper';
import { HtmlTooltip } from './HoverChip';
import Button from './Button';
import { submitMetadata } from '@/lib/metadataProcessor';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { useCardano } from '@/context/walletContext';
import {
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { getItemFromLocalStorage, setItemToLocalStorage } from '@/lib';
import { setItemToIndexedDB } from '@/lib/indexedDb';
import { useDRepContext } from '@/context/drepContext';

const IMMUTABLE_KEYS = ['givenName'];
const HIDDEN_KEYS = ['references', 'image'];
const MetadataEditor = ({
  onClose,
  initialMetadata = null,
  onSuccessfulSubmit,
}) => {
  const [metadata, setMetadata] = useState([]);
  const [references, setReferences] = useState([]);
  const { loginSignTransaction } = useCardano();
  const [imageData, setImageData] = useState(null);
  const [isSigningData, setIsSigningData] = useState(false);
  const [errors, setErrors] = useState({});
  const { handleRefresh } = useDRepContext();
  const { addErrorAlert, addSuccessAlert } = useGlobalNotifications();
  useEffect(() => {
    if (initialMetadata === null) {
      const defaultMetadata = IMMUTABLE_KEYS.reduce((acc, key) => {
        acc.push({ id: uuidv4(), key, value: '' });
        return acc;
      }, []);
      setMetadata(defaultMetadata);
      setReferences([]);
    } else {
      const referencesData = initialMetadata.find(
        (item) => item.key === 'references',
      );
      const imageData = initialMetadata.find((item) => item.key === 'image');
      if (referencesData) {
        try {
          setReferences(referencesData.value);
        } catch (error) {
          console.error('Error parsing references:', error);
          setReferences([]);
        }
      }
      if (imageData) {
        try {
          setImageData(imageData.value);
        } catch (error) {
          console.error('Error parsing image:', error);
          setImageData(null);
        }
      }
      setMetadata(
        initialMetadata.filter((item) => !HIDDEN_KEYS.includes(item.key)),
      );
    }
  }, [initialMetadata]);

  const handleChange = (id, field, value) => {
    setMetadata(
      metadata.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );

    if (errors[id] && errors[id][field]) {
      setErrors({ ...errors, [id]: { ...errors[id], [field]: null } });
    }
  };

  const handleAddNew = () => {
    const newItem = { id: uuidv4(), key: '', value: '' };
    setMetadata([...metadata, newItem]);
  };

  const handleDelete = (id) => {
    const itemToDelete = metadata.find((item) => item.id === id);
    if (IMMUTABLE_KEYS.includes(itemToDelete.key)) {
      return;
    }
    setMetadata(metadata.filter((item) => item.id !== id));
    const { [id]: _, ...restErrors } = errors as any;
    setErrors(restErrors);
  };

  const handleAddReference = () => {
    setReferences([...references, { id: uuidv4(), key: '', value: '' }]);
  };

  const handleReferenceChange = (id, field, value) => {
    setReferences(
      references.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleDeleteReference = (id) => {
    setReferences(references.filter((item) => item.id !== id));
  };

  const validateAndSave = async () => {
    try {
      const newErrors = {};
      let hasErrors = false;

      metadata.forEach((item) => {
        newErrors[item.id] = {};

        if (!item.key.trim()) {
          newErrors[item.id].key = 'Key cannot be empty';
          hasErrors = true;
        } else if (/\s/.test(item.key)) {
          newErrors[item.id].key = 'Key cannot contain spaces';
          hasErrors = true;
        }

        if (!item.value.trim()) {
          newErrors[item.id].value = 'Value cannot be empty';
          hasErrors = true;
        }
      });

      references.forEach((item) => {
        if (!item.key.trim() || !item.value.trim()) {
          newErrors[item.id] = {
            key: 'Both key and value are required for references',
          };
          hasErrors = true;
        }
      });

      setErrors(newErrors);
      if (!hasErrors) {
        const modifiedMetadata = metadata.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}); // has the key/ value metadata object
        const modifiedReferences = references.map(({ key, value }) => {
          return { label: key, uri: value };
        });
        modifiedMetadata.references = modifiedReferences;
        const metadataKeys = [
          ...metadata.map((item) => item.key),
          'references',
        ];
        if (imageData) {
          modifiedMetadata.image = imageData;
          metadataKeys.push('image');
        }
        setIsSigningData(true);
        const { jsonld, jsonHash } = await submitMetadata(
          metadataKeys,
          modifiedMetadata,
          loginSignTransaction,
        );
        setItemToLocalStorage('isUpdating', 'true');
        await setItemToIndexedDB('metadataJsonLd', jsonld);
        await setItemToIndexedDB('metadataJsonHash', jsonHash);
        await handleRefresh();
        setIsSigningData(false);
        addSuccessAlert('Metadata updated!');
        onSuccessfulSubmit();
        onClose();
      }
    } catch (error) {
      console.log(error);
      setIsSigningData(false);
      addErrorAlert(String(error));
    }
  };

  const modalContent = (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4 ">
        <h2 className="text-xl font-bold">Edit Metadata</h2>
        <div className="max-h-[550px] overflow-y-scroll">
          {metadata &&
            metadata.map(({ id, key, value }, index) => (
              <div key={index} className="mb-4">
                <div className="my-2 flex w-full items-center gap-2">
                  <div className="my-2 flex w-full flex-col gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => handleChange(id, 'key', e.target.value)}
                      placeholder="Key"
                      disabled={IMMUTABLE_KEYS.includes(key)}
                      className="flex-grow rounded border p-2"
                    />
                    <textarea
                      value={value}
                      onChange={(e) =>
                        handleChange(id, 'value', e.target.value)
                      }
                      placeholder="Value"
                      className="flex-grow rounded border p-2"
                    />
                  </div>

                  <div
                    onClick={() => handleDelete(id)}
                    aria-label="delete"
                    className={`h-5 w-5 ${IMMUTABLE_KEYS.includes(key) ? 'pointer-events-none' : 'cursor-pointer'}`}
                  >
                    <img
                      src="/svgs/trash.svg"
                      alt="delete"
                      className="h-5 w-5"
                    />
                  </div>
                  {errors[id] && (errors[id].key || errors[id].value) && (
                    <HtmlTooltip
                      title={
                        <div className="text-sm text-red-500">
                          {errors[id].key && <p>{errors[id].key}</p>}
                          {errors[id].value && <p>{errors[id].value}</p>}
                        </div>
                      }
                      arrow
                      placement="top"
                    >
                      <img
                        src="/svgs/alert-circle.svg"
                        alt="error"
                        className="h-5 w-5"
                      />
                    </HtmlTooltip>
                  )}
                </div>
              </div>
            ))}

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={
                <img
                  src="/svgs/chevron-down.svg"
                  alt="expand"
                  className="h-5 w-5"
                />
              }
            >
              <h3>References</h3>
            </AccordionSummary>
            <AccordionDetails>
              {references &&
                references.map(({ id, key, value }, index) => (
                  <div key={index} className="mb-4">
                    <div className="my-2 flex items-center gap-2">
                      <div className="my-2 flex w-full flex-col gap-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) =>
                            handleReferenceChange(id, 'key', e.target.value)
                          }
                          placeholder="Key (e.g., twitter)"
                          className="flex-grow rounded border p-2"
                        />
                        <textarea
                          value={value}
                          onChange={(e) =>
                            handleReferenceChange(id, 'value', e.target.value)
                          }
                          placeholder="Value (e.g., https://x.com/username)"
                          className="flex-grow rounded border p-2"
                        />
                      </div>
                      <div
                        onClick={() => handleDeleteReference(id)}
                        aria-label="delete"
                        className="cursor-pointer"
                      >
                        <img
                          src="/svgs/trash.svg"
                          alt="delete"
                          className="h-5 w-5"
                        />
                      </div>
                      {errors[id] && (
                        <HtmlTooltip
                          title={
                            <div className="text-sm text-red-500">
                              <p>{errors[id].key}</p>
                            </div>
                          }
                          arrow
                          placement="top"
                        >
                          <img
                            src="/svgs/alert-circle.svg"
                            alt="error"
                            className="h-5 w-5"
                          />
                        </HtmlTooltip>
                      )}
                    </div>
                  </div>
                ))}
              <Button
                handleClick={handleAddReference}
                aria-valuetext="add reference"
                className="flex w-full items-center gap-3 rounded-xl border border-dotted shadow-md"
                bgcolor="transparent"
                variant="outlined"
              >
                <img
                  src="/svgs/circle-plus.svg"
                  alt="add"
                  className="h-5 w-5"
                />
                <p>Add reference</p>
              </Button>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="mb-2 flex w-full">
          <Button
            handleClick={handleAddNew}
            aria-valuetext="add"
            className="flex w-full items-center gap-3 rounded-xl border border-dotted shadow-md"
            bgcolor="transparent"
            variant="outlined"
          >
            <img src="/svgs/circle-plus.svg" alt="add" className="h-5 w-5" />
            <p>Add another</p>
          </Button>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <div className="flex justify-end gap-2">
            <Button handleClick={onClose}>Cancel</Button>
            <Button handleClick={validateAndSave} disabled={isSigningData}>
              {isSigningData ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalWrapper
      onClose={onClose}
      sx={{
        minWidth: '80%',
        minHeight: '80%',
      }}
      variant="modal"
      hideCloseButton
      children={modalContent}
    />
  );
};

export default MetadataEditor;
