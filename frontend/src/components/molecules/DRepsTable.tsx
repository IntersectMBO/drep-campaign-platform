import React, { useEffect, useState } from 'react';
import StatusChip from '../atoms/StatusChip';
import { useGetDRepsQuery } from '@/hooks/useGetDRepsQuery';
import HoverChip from '../atoms/HoverChip';
import { useRouter } from 'next/navigation';

const DRepsTable = ({ searchQuery }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { DReps, isDRepsLoading } = useGetDRepsQuery();
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
  }, []);
  //will be later changed to filter by drep name
  const filteredDreps =
    DReps &&
    DReps.filter((drep) =>
      drep.view.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  function isActive(epoch_no: number, active_until: number) {
    return active_until > epoch_no;
  }
  function statusChecker(deposit: number) {
    if (deposit > 0) {
      return 'Verified';
    } else {
      return 'Not registered';
    }
  }

  function convertString(inputString: string) {
    if (inputString.length <= 10) {
      return inputString; // If the string is too short, no replacement is needed
    }
    //the string will be truncated per mobile width
    if (isMobile) {
      return inputString.slice(0, 5) + '.......' + inputString.slice(-5);
    }

    return inputString.slice(0, 10) + '.......' + inputString.slice(-10);
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="overflow-x-auto text-nowrap bg-white text-left text-2xl font-black">
            <th className="px-4 py-2">DRep Id</th>
            <th className="px-4 py-2">Epoch</th>
            <th colSpan={2} className="px-4 py-2">
              DRep
            </th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Live Power</th>
            <th className="px-4 py-2">Active Power</th>
            <th className="px-4 py-2">Amount of Holders</th>
            <th colSpan={3} className="px-4 py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isDRepsLoading ? (
            <tr>
              <td colSpan={10} className="text-center">
                Loading.....
              </td>
            </tr>
          ) : filteredDreps && filteredDreps.length > 0 ? (
            filteredDreps.map((drep) => (
              <tr
                key={drep.drep_hash_id}
                data-testid={`drep-id-${drep.view}`}
                className="text-nowrap text-left text-sm"
              >
                <td className="px-4 py-2">{convertString(drep.view)}</td>
                <td className="px-4 py-2">{drep.epoch_no}</td>
                <td className="px-4 py-2">{drep?.name || 'Coming soon'}</td>
                <td className="px-4 py-2">
                  <StatusChip status={statusChecker(drep.deposit)} />
                </td>
                <td className="px-4 py-2">
                  <StatusChip
                    status={
                      isActive(drep.epoch_no, drep.active_until)
                        ? 'Active'
                        : 'Inactive'
                    }
                  />
                </td>
                <td className="px-4 py-2">₳ {drep.amount}</td>
                <td className="px-4 py-2">₳ {drep.amount}</td>
                <td className="px-4 py-2">
                  Representative for {drep.delegation_vote_count}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {/* Will be populated with links when comps are ready.Currently logs */}
                    <HoverChip
                      icon="/link.svg"
                      text="View Profile"
                      handleClick={() =>
                        console.log('going to drep', drep.view)
                      }
                    />
                    <HoverChip
                      icon="/user-circle.svg"
                      text="Link DRep"
                      handleClick={
                        () => console.log('linking drep', drep.view)
                        // router.push(`/drep/${drep.id}`)
                      }
                    />
                    <HoverChip
                      icon="/medal.svg"
                      text="Claim DRep Profile"
                      handleClick={() =>
                        console.log('claiming drep', drep.view)
                      }
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">
                No Dreps to show for now
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DRepsTable;
