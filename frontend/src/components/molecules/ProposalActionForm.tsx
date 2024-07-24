import React, { useEffect, useRef, useState } from 'react';
import Button from '../atoms/Button';
import { CircularProgress } from '@mui/material';
import DrepGovActionSubmitCard from '../atoms/DrepGovActionSubmitCard';
import { MDXEditorMethods } from '@mdxeditor/editor';
interface ProposalActionFormProps {
  nullify: () => void;
  setProposalHashPayload?: (payload: any) => void;
  editor?: MDXEditorMethods | any; //any type of editor
}
const ProposalActionForm = ({
  nullify,
  setProposalHashPayload,
  editor,
}: ProposalActionFormProps) => {
  const [proposals, setProposals] = useState(null); // only hashes
  const [fetchedProposals, setFetchedProposals] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const sample = [
    {
      hash: '0x1a2b3c4d5e6f7g8h9i0j',
      description: {
        tag: 'Protocol Parameter Changes',
      },
      createdAt: '2024-03-15T09:23:14Z',
    },
    {
      hash: '0xk1l2m3n4o5p6q7r8s9t',
      description: {
        tag: 'New Constitution or Guardrails Script',
      },
      createdAt: '2024-07-22T14:45:30Z',
    },
    {
      hash: '0xu1v2w3x4y5z6a7b8c9d',
      description: {
        tag: 'Treasury Withdrawals',
      },
      createdAt: '2024-01-05T11:17:42Z',
    },
    {
      hash: '0xe1f2g3h4i5j6k7l8m9n0',
      description: {
        tag: 'Hard-Fork Initiation',
      },
      createdAt: '2024-09-30T16:55:03Z',
    },
    {
      hash: '0xo1p2q3r4s5t6u7v8w9x',
      description: {
        tag: 'Update committee and/or threshold and/or terms',
      },
      createdAt: '2024-05-18T08:39:27Z',
    },
    {
      hash: '0xy1z2a3b4c5d6e7f8g9h',
      description: {
        tag: 'Motion of no-confidence',
      },
      createdAt: '2024-11-07T13:12:59Z',
    },
    {
      hash: '0xi1j2k3l4m5n6o7p8q9r',
      description: {
        tag: 'Protocol Parameter Changes',
      },
      createdAt: '2024-02-29T10:05:33Z',
    },
    {
      hash: '0xs1t2u3v4w5x6y7z8a9b',
      description: {
        tag: 'Info',
      },
      createdAt: '2024-08-14T15:37:21Z',
    },
    {
      hash: '0xc1d2e3f4g5h6i7j8k9l0',
      description: {
        tag: 'Treasury Withdrawals',
      },
      createdAt: '2024-04-03T12:50:48Z',
    },
    {
      hash: '0xm1n2o3p4q5r6s7t8u9v',
      description: {
        tag: 'New Constitution or Guardrails Script',
      },
      createdAt: '2024-10-25T17:28:06Z',
    },
  ];
  const handleInputChange = async (e) => {
    console.log('searching');
    if (e.target.value === '') {
      setCurrentHash('');
      setFetchedProposals(null);
      return;
    }
    setCurrentHash(e.target.value);
    setIsFetching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 500ms delay
      const matchingProposals = sample.filter((proposal) => {
        return proposal.hash.includes(e.target.value);
      });
      setFetchedProposals(matchingProposals);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
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
      <div className="h-11 text-[1.375rem] font-bold text-zinc-800">
        Add Proposal
      </div>
      <div className="flex w-fit flex-col gap-1">
        <input
          type="text"
          value={currentHash}
          onChange={handleInputChange}
          className={`w-fit rounded-full border border-zinc-100 py-3 pl-5`}
          placeholder={'Paste proposal hash here...'}
        />
      </div>

      <p className="text-start text-sm font-medium text-black">
        Proposals should exist on chain for addition.
      </p>
      <div className="mt-3 flex max-h-52 flex-col gap-3 overflow-y-auto">
        {!isFetching ? (
          fetchedProposals && fetchedProposals.length > 0 ? (
            fetchedProposals.map((proposal, index) => (
              <div
                className="flex cursor-pointer items-center justify-center"
                key={index}
                onClick={() => {
                  setProposals([proposal.hash]);
                  setCurrentHash(proposal.hash);
                }}
              >
                <DrepGovActionSubmitCard
                  actionType={proposal.description.tag.toLowerCase()}
                  item={proposal}
                />
              </div>
            ))
          ) : (
            <p>No proposals found</p>
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
            bgColor="transparent"
          >
            <p>Cancel</p>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProposalActionForm;
