import React from "react";

const GovernanceActionsTable = () => {
  return (
    <table>
      <thead>
        <tr className="bg-pure-white text-left">
          <th className="p-4">Actions</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody className="flex-row ">
        <tr>
          <td>Motion of no-confidence</td>
          <td>
            A motion to create a state of no-confidence in the current
            constitutional committee
          </td>
        </tr>
        <tr>
          <td>New constitutional committee and/or threshold and/or terms</td>
          <td>
            Changes to the members of the constitutional committee and/or to its
            signature threshold and/or terms
          </td>
        </tr>
        <tr>
          <td>Update to the Constitution or proposal policy</td>
          <td>
            A modification to the Constitution or proposal policy, recorded as
            on-chain hashes
          </td>
        </tr>
        <tr>
          <td>Hard-Fork Initiation</td>
          <td>
            Triggers a non-backwards compatible upgrade of the network; requires
            a prior software upgrade
          </td>
        </tr>
        <tr>
          <td>Protocol Parameter Changes</td>
          <td>
            Any change to one or more updatable protocol parameters, excluding
            changes to major protocol versions ("hard forks")
          </td>
        </tr>
        <tr>
          <td>Treasury Withdrawals</td>
          <td>Withdrawals from the treasury</td>
        </tr>
        <tr>
          <td>Info</td>
          <td>
            An action that has no effect on-chain, other than an on-chain record
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GovernanceActionsTable;
