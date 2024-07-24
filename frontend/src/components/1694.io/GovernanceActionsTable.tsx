import React from 'react';

const GovernanceActionsTable = () => {
  const data = [
    {
      actions: 'Motion of no-confidence',
      description:
        'A motion to create a state of no-confidence in the current constitutional committee',
    },
    {
      actions: 'Update committee and/or threshold and/or terms',
      description:
        'Changes to the members of the constitutional committee and/or to its signature threshold and/or terms',
    },
    {
      actions: 'New Constitution or Guardrails Script',
      description:
        'A modification to the Constitution or Guardrails Script, recorded as on-chain hashes',
    },
    {
      actions: 'Hard-Fork Initiation',
      description:
        'Triggers a non-backwards compatible upgrade of the network; requires a prior software upgrade',
    },
    {
      actions: 'Protocol Parameter Changes',
      description:
        'Any change to one or more updatable protocol parameters, excluding changes to major protocol versions ("hard forks")',
    },
    {
      actions: 'Treasury Withdrawals',
      description: 'Withdrawals from the treasury',
    },
    {
      actions: 'Info',
      description:
        'An action that has no effect on-chain, other than an on-chain record',
    },
  ];

  return (
    <table>
      <thead>
        <tr className="bg-white text-left">
          <th className="p-4">Actions</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.actions}
            className={`${(index + 1) % 2 == 0 ? 'border-b border-white bg-violet-50' : 'border-b border-cyan-800 border-opacity-20 bg-white bg-opacity-50'}`}
          >
            <td className="p-5">
              {index + 1}. {item.actions}
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GovernanceActionsTable;
