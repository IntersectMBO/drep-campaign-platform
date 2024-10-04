import React from 'react';
interface StatusProps {
  status:
    | 'Verified'
    | 'Unverified'
    | 'Claimed'
    | 'Active'
    | 'Inactive'
    | 'Not claimed'
    | 'Not registered'
    | 'Scripted'
    | 'Voting Option';
}
const StatusChip = ({ status }: StatusProps) => {
  let statusClass = '';
  switch (status) {
    case 'Verified':
      statusClass = 'bg-blue-800 text-white';
      break;
    case 'Unverified':
      statusClass = 'bg-gray-800 text-white';
      break;
    case 'Not registered':
      statusClass = 'bg-orange-500 text-white';
      break;
    case 'Active':
      statusClass = 'bg-success text-zinc-800';
      break;
    case 'Inactive':
      statusClass = 'bg-gray-800 text-white';
      break;
    case 'Scripted':
      statusClass = 'bg-blue-800 text-white';
      break;
    case 'Voting Option':
      statusClass = 'bg-blue-800 text-white';
      break;
    default:
      statusClass = 'bg-gray-800 text-white'; // Default to gray if status is not recognized
  }

  return (
    <div
      className={`text-nowrap rounded-full px-1.5 py-0.5 text-center text-xs font-normal  ${statusClass}`}
    >
      {status}
    </div>
  );
};

export default StatusChip;
