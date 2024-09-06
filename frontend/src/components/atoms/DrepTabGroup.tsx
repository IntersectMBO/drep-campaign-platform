import React, { useState } from 'react';

const DrepTabGroup = ({setActiveTab}:{setActiveTab:Function}) => {
  const [active, setActive] = useState('profile');
  const activeClasses =
    'bg-white border-b-2 border-b-blue-800 rounded-t-lg text-blue-800 ';
  const inactiveClasses = 'bg-white bg-opacity-40 rounded-t-lg text-gray-400 hover:text-gray-800 cursor-pointer';

  const handleClick = (id) => {
    setActive(id);
    setActiveTab(id);
  };
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      <div
        id="timeline"
        className={`px-16 py-4 ${active === 'profile' ? activeClasses : inactiveClasses}`}
        onClick={() => handleClick('profile')}
      >
        <p>Profile</p>
      </div>
      <div
        id="metrics"
        className={`px-16 py-4 ${active === 'metrics' ? activeClasses : inactiveClasses}`}
        onClick={() => handleClick('metrics')}
      >
        <p>Metrics</p>
      </div>
    </div>
  );
};

export default DrepTabGroup;
