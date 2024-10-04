import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './modal/ModalWrapper';
import Button from './Button';
import { downloadJson } from '@/lib/jsonutils';
import { postMetadata } from '@/services/requests/postMetadata';
import {  MetadataSaveResponse, MetadataStandard } from '../../../types/commonTypes';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { useCardano } from '@/context/walletContext';
import { CircularProgress, Tabs, Tab } from '@mui/material';
import { urls } from '@/constants';
import { getItemFromIndexedDB } from '@/lib/indexedDb';
import { postAddMetadataAttachment } from '@/services/requests/postAddMetadataAttachment';

const SubmitMetadataModal = ({ onClose, onSuccessfulSubmit }) => {
  const { signAndSubmitTransaction, buildDRepUpdateCert } = useCardano();
  const [isValidatingSubmission, setIsValidatingSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState('selfHost');
  const [jsonld, setJsonld] = useState<any>(null);
  const [jsonHash, setJsonHash] = useState(null);
  const { addErrorAlert, addSuccessAlert } = useGlobalNotifications();
  const [metadataUrl, setMetadataUrl] = useState('');

  useEffect(() => {
    const initiateMetadata = async () => {
      const jsonld = await getItemFromIndexedDB('metadataJsonLd');
      const jsonHash = await getItemFromIndexedDB('metadataJsonHash');
      setJsonld(jsonld);
      setJsonHash(jsonHash);
    };
    initiateMetadata();
  }, []);

  const downloadJsonFile = () => {
    if (jsonld) {
      downloadJson(jsonld, 'metadata');
    }
  };

  const handleValidation = async () => {
    try {
      if (metadataUrl) {
        setIsValidatingSubmission(true);
        setMetadataUrl(metadataUrl);
        const { status, valid } = await postMetadata({
          hash: jsonHash,
          url: metadataUrl,
          standard: MetadataStandard.CIP119,
        });
        if (status) {
          setIsValidatingSubmission(false);
          throw new Error(status);
        }
        setIsValidatingSubmission(false);
        if (valid && metadataUrl) {
          addSuccessAlert('Metadata Valid');
        }
      } else {
        setIsValidatingSubmission(false);
        setMetadataUrl('');
      }
    } catch (error) {
      setIsValidatingSubmission(false);
      console.log(error);
      throw new Error(error);
    }
  };
  const postSaveMetadata = async () => {
    try {
      //upload metadata to db
      const { content } = (await postAddMetadataAttachment({
        metadata: jsonld,
      })) as MetadataSaveResponse;
      if(!content) {
        console.log('Error saving metadata, hash not received');
        throw new Error('Error saving metadata');
      }
      if(!urls.ipfsGateway) {
        console.log('IPFS Gateway not available in environment');
        throw new Error('Error occured while saving metadata');
      }
      const hostedUrl = `${urls.ipfsGateway}/ipfs/${content}`;
      return hostedUrl;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  const onSubmit = async () => {
    try {
      let currentHostedUrl = metadataUrl;
      if (activeTab === 'hostForMeOnIPFS') {
        currentHostedUrl = await postSaveMetadata();
      }
      if (activeTab === 'selfHost') {
        if (!metadataUrl) {
          addErrorAlert('Please enter a valid url');
          return;
        }
        await handleValidation();
      }
      const updateDRepMetadataCert = await buildDRepUpdateCert(
        currentHostedUrl,
        jsonHash,
      );
      const res = await signAndSubmitTransaction(updateDRepMetadataCert);
      onSuccessfulSubmit(res.resultHash);
      onClose();
    } catch (error) {
      console.log(error);
      addErrorAlert(String(error));
    }
  };

  const renderSelfHostContent = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between gap-2">
        <p>Download your metadata</p>
        <Button handleClick={downloadJsonFile}>
          <img src="/svgs/download.svg" alt="download" className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          Host it on a platform of your choice, preferrably long term storage
          like IPFS, then paste the URL here:
        </p>
        <div className="flex items-center gap-2">
          <div className="flex w-[80%] flex-col gap-1">
            <input
              type="text"
              value={metadataUrl}
              onChange={(e) => setMetadataUrl(e.target.value)}
              placeholder="Metadata URL"
              className="w-full rounded border p-2"
            />
            {isValidatingSubmission && (
              <div className="mt-2 w-full">
                <CircularProgress size={20} />
              </div>
            )}
          </div>
          <div className="w-[20%]">
            <Button handleClick={onSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHostForMeOnIPFSContent = () => (
    <div className="flex flex-col gap-4">
      <p>This is the final step. We'll host the metadata for you in IPFS.</p>
      <Button handleClick={onSubmit}>Submit</Button>
    </div>
  );

  const modalContent = (
    <div className="flex flex-col gap-4">
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
      >
        <Tab label="Self Host" value="selfHost" />
        <Tab label="Host on IPFS" value="hostForMeOnIPFS" />
      </Tabs>
      {activeTab === 'selfHost'
        ? renderSelfHostContent()
        : renderHostForMeOnIPFSContent()}
    </div>
  );

  return (
    <ModalWrapper onClose={onClose} variant="modal" children={modalContent} />
  );
};

export default SubmitMetadataModal;
