import React from 'react';

const GovernanceActionsDescTable = () => {
  const data = [
    {
      actions: 'Motion of no-confidence',
      description: 'None',
    },
    {
      actions: 'Update committee threshold',
      description:
        'The set of verification key hash digests (members to be removed), a map of verification key hash digests to epoch numbers (new members and their term limit), and a fraction (new threshold)',
    },
    {
      actions: 'New Constitution or Guardrails Script',
      description:
        'An anchor to the Constitution and an optional script hash of the Guardrails Script',
    },
    {
      actions: 'Hard-Fork Initiation',
      description: 'The new (greater) major protocol version',
    },
    {
      actions: 'Protocol Parameter Changes',
      description: 'The changed parameters',
    },
    {
      actions: 'Treasury Withdrawals',
      description:
        'A map from stake credentials to a positive number of Lovelace',
    },
    {
      actions: 'Info',
      description: 'None',
    },
  ];

  return (
    <table>
      <thead>
        <tr className="bg-white text-left">
          <th className="p-4">Governance action type</th>
          <th>Additional data</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.actions}
            className={`${(index + 1) % 2 == 0 ? 'border-b border-white bg-violet-50' : 'border-b border-cyan-800 border-opacity-20 bg-white bg-opacity-50'}`}
          >
            <td className="p-4">
              {index + 1}. {item.actions}
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GovernanceActionsDescTable;
