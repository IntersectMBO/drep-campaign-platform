import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DrepTabGroup = ({ drepId }: { drepId: string }) => {
  const [active, setActive] = useState('profile');
  const router = useRouter();
  const pathname = usePathname();
  const activeClasses =
    'bg-white border-b-2 border-b-blue-800 rounded-t-lg text-blue-800 ';
  const inactiveClasses =
    'bg-blue-50 rounded-t-lg text-gray-500 hover:text-gray-800 cursor-pointer';

  const handleClick = (id) => {
    if (id === 'profile') {
      router.push(`/dreps/${drepId}`);
    }
    if (id === 'delegators') {
      router.push(`/dreps/${drepId}/delegators`);
    }
  };
  useEffect(() => {
    if (pathname.includes(`/dreps/${drepId}/delegators`)) {
      setActive('delegators');
    } else setActive('profile');
  }, [pathname]);
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
        id="delegators"
        className={`px-16 py-4 ${active === 'delegators' ? activeClasses : inactiveClasses}`}
        onClick={() => handleClick('delegators')}
      >
        <p>Delegators</p>
      </div>
    </div>
  );
};

export default DrepTabGroup;
