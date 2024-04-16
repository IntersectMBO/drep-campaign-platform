"use client";
import React from "react";
import GovernanceActionsTable from "../molecules/GovernanceActionsTable";

const GovernanceActionsCard = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-10 bg-gradient-to-b from-[#E9EFFF]  to-[#FFFFFF]">
      <div className="col-span-1 flex flex-col items-start justify-center gap-3 p-20">
        <div className="font-bold text-6xl">
          <p>Governance</p>
          <p>actions</p>
        </div>

        <p>
          We define seven different types of governance actions. A governance
          action is an on-chain event that is triggered by a transaction and has
          a deadline after which it cannot be enacted.
        </p>
        <ul className="list-disc ml-4 mb-2">
          <li>
            An action is said to be ratified when it gathers enough votes in its
            favor (through the rules and parameters that are detailed below).
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
  );
};

export default GovernanceActionsCard;
