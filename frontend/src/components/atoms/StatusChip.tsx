import React from 'react';
interface StatusProps {
  status:
  | 'Verified'
  | 'Unverified'
  | 'Claimed'
  | 'Active'
  | 'Inactive'
  | 'Not claimed'
  | 'Not registered';
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
      statusClass = 'bg-teal-100 text-zinc-800';
      break;
    case 'Inactive':
      statusClass = 'bg-gray-800 text-white';
      break;
    default:
      statusClass = 'bg-gray-800 text-white'; // Default to gray if status is not recognized
  }

  return (
    <div
      className={`text-nowrap rounded-full px-2 py-1 text-center text-sm font-normal  ${statusClass}`}
    >
      {status}
    </div>
  );
};

export default StatusChip;
