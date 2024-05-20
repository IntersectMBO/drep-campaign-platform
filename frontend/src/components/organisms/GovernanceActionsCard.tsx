'use client';
import React from 'react';
import GovernanceActionsTable from '../molecules/GovernanceActionsTable';

const GovernanceActionsCard = () => {
  return (
    <div className="drep_white_gradient py-8">
      <div className="base_container flex flex-col lg:grid grid-cols-2 gap-8 lg:gap-16 py-8">
        <div className="col-span-1 flex flex-col items-start justify-center gap-3 py-20">
          <div className="text-5xl lg:text-6xl font-bold">
            <p>Governance</p>
            <p>actions</p>
          </div>
          <p>
            There are currently seven defined types of governance actions
            registered DRep will be voting on.
          </p>
          <p>
            A governance action is an on-chain event that is triggered by a
            transaction and has a deadline after which it cannot be enacted.
          </p>
          <ul className="mb-2 ml-4 list-disc">
            <li>
              An action is said to be ratified when it gathers enough votes in
              its favor (through the rules and parameters that are detailed
              below).
            </li>
            <li>
              An action that fails to be ratified before its deadline is said to
              have expired.
            </li>
            <li>
              An action that has been ratified is said to be enacted once it has
              been activated on the network.
            </li>
          </ul>
        </div>

        <div className="table_container col-span-1 flex items-center justify-center">
          <GovernanceActionsTable />
        </div>
      </div>
    </div>
  );
};

export default GovernanceActionsCard;
