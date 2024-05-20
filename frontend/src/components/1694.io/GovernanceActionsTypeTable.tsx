import React from 'react';

const GovernanceActionsTypeTable = () => {
  const data = [
    {
      actions: 'Motion of no-confidence',
      CC: '-',
      DReps: '$P_1$',
      SPOs: '$Q_1$',
    },
    {
      actions: 'New committee threshold (normal state)',
      CC: '-',
      DReps: '$P_{2a}$',
      SPOs: '$Q_{2a}$',
    },
    {
      actions: 'Update to the Constitution or proposal policy',
      CC: '✓',
      DReps: '$P_3$',
      SPOs: '-',
    },
    {
      actions: 'Hard-Fork Initiation',
      CC: '✓',
      DReps: '$P_4$',
      SPOs: '$Q_4$',
    },
    {
      actions: 'Protocol Parameter Changes, economic group',
      CC: '✓',
      DReps: '$P_{5a}$',
      SPOs: '-',
    },
    {
      actions: 'Protocol Parameter Changes, economic group',
      CC: '✓',
      DReps: '$P_{5b}$',
      SPOs: '-',
    },
    {
      actions: 'Protocol Parameter Changes, technical group',
      CC: '✓',
      DReps: '$P_{5c}$',
      SPOs: '-',
    },
    {
      actions: 'Protocol Parameter Changes, governance group',
      CC: '✓',
      DReps: '$P_{5d}$',
      SPOs: '-',
    },
    {
      actions: 'Treasury Withdrawals',
      CC: '✓',
      DReps: '$P_6$',
      SPOs: '-',
    },
    {
      actions: 'Info',
      CC: '✓',
      DReps: '$100$',
      SPOs: '$100$',
    },
  ];

  return (
    <table>
      <thead>
        <tr className="bg-white text-left ">
          <th className="border border-slate-500 border-opacity-80 p-4">
            Governance action type
          </th>
          <th className="border border-slate-500 border-opacity-80 p-4">CC</th>
          <th className="border border-slate-500 border-opacity-80 p-4">
            DReps
          </th>
          <th className="border border-slate-500 border-opacity-80 p-4">
            SPOs
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className={`${(index + 1) % 2 == 0 ? 'border-b border-white bg-violet-50' : 'border-b border-cyan-800 border-opacity-20 bg-white bg-opacity-50'}`}
          >
            <td className="border border-slate-500 border-opacity-50 p-5">
              {index + 1}. {item.actions}
            </td>
            <td className="border border-slate-500 border-opacity-50 p-5">
              {item.CC}
            </td>
            <td className="border border-slate-500 border-opacity-50 p-5">
              {item.DReps}
            </td>
            <td className="border border-slate-500 border-opacity-50 p-5">
              {item.SPOs}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GovernanceActionsTypeTable;
