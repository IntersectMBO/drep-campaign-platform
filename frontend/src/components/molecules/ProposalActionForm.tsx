import React, { useEffect, useRef, useState, useCallback } from 'react';
import Button from '../atoms/Button';
import { useDebouncedCallback } from 'use-debounce';
import { CircularProgress } from '@mui/material';
import DrepGovActionSubmitCard from '../atoms/DrepGovActionSubmitCard';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useGetProposalsQuery } from '@/hooks/useGetProposalByHashQuery';

interface ProposalActionFormProps {
  nullify: () => void;
  setProposalHashPayload?: (payload: any) => void;
  editor?: MDXEditorMethods | any;
}

const ProposalActionForm = ({
  nullify,
  setProposalHashPayload,
  editor,
}: ProposalActionFormProps) => {
  const [proposals, setProposals] = useState(null);
  const [error, setError] = useState('');
  const [fetchedProposals, setFetchedProposals] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const [inputValue, setInputValue] = useState(currentHash);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    Proposals,
    isProposalsFetching,
    proposalFetchError,
  } = useGetProposalsQuery({
    hashQueryString: currentHash,
  });

  useEffect(() => {
    if (Proposals && Proposals.length > 0) {
      setFetchedProposals(Proposals);
      setError('');
    }
    if (proposalFetchError) {
      setFetchedProposals([]);
      setError(proposalFetchError?.response?.data?.message as string || 'Error');
    }
  }, [Proposals]);

  const handleDebouncedInputChange = useDebouncedCallback((value) => {
    setFetchedProposals(null);
    setProposals(null)
    setCurrentHash(value);
  }, 300);

  const handleInputChange = (value) => {
    const trimmedValue = value.endsWith('#0') ? value.slice(0, -2) : value;
    setInputValue(trimmedValue);
    handleDebouncedInputChange(trimmedValue);
  };

  const uploadProposal = async () => {
    try {
      const markdown = `[gov_action hash='${proposals[0]}']`;
      if (editor) {
        editor.insertMarkdown(markdown);
      } else setProposalHashPayload([markdown]);
      setProposals(null);
      nullify();
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className="h-11 text-[1.375rem] font-bold text-zinc-800">
        Add Proposal
      </div>
      <div className="flex w-full flex-col gap-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`w-full rounded-full border border-zinc-100 py-3 pl-5`}
          placeholder={'Paste proposal hash here...'}
        />
      </div>

      <p className="text-start text-sm font-medium text-black mt-2">
        Proposals should exist on chain for addition.
      </p>
      <div className="mt-3 flex max-h-52 flex-col gap-3">
        {!isProposalsFetching ? (
          fetchedProposals && fetchedProposals.length > 0 ? (
            fetchedProposals.map((proposal, index) => (
              <div
                className="flex cursor-pointer items-center justify-center"
                key={index}
                onClick={() => {
                  setProposals([proposal.hash]);
                }}
              >
                <DrepGovActionSubmitCard
                  actionTypeParam={proposal.description.tag.toLowerCase()}
                  item={proposal}
                />
              </div>
            ))
          ) : (
            <p>{error}</p>
          )
        ) : (
          <div className="flex items-center justify-center">
            <CircularProgress size={20} />
          </div>
        )}
      </div>
      {proposals && (
        <div className="mt-2 flex flex-col gap-2">
          <Button handleClick={uploadProposal}>
            <p>Add Proposal</p>
          </Button>
          <Button
            handleClick={() => {
              nullify();
              setProposals(null);
            }}
            variant="outlined"
            bgcolor="transparent"
          >
            <p>Cancel</p>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProposalActionForm;
