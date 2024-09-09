import { useCardano } from '@/context/walletContext';
import { useScreenDimension } from '@/hooks';
import {
  convertString,
  formatAsCurrency,
  formattedAda,
  lovelaceToAda,
} from '@/lib';
import React from 'react';
import HoverText from './HoverText';
const ViewProfileAction = () => {
  return (
    <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm">
      <img src="/svgs/eye.svg" alt="View Profile" />
      <p>View Profile</p>
    </div>
  );
};
const DrepDelegatorslist = ({ delegators }: { delegators: any[] }) => {
  const { latestEpoch } = useCardano();
  const { isMobile, screenWidth } = useScreenDimension();
  return (
    <div className="w-full overflow-x-scroll">
      <p className="text-3xl font-bold">Delegators</p>
      {delegators && delegators.length > 0 ? (
        delegators.map((delegator, index) => {
          return (
            <div key={index}>
              <div className="flex flex-col">
                <div className="flex w-full flex-row items-center justify-between text-nowrap py-4">
                  <div className="flex min-w-40 flex-col">
                    <p className="font-bold">
                      Epoch {delegator?.delegationEpoch}{' '}
                      {delegator?.delegationEpoch == latestEpoch && '(actual)'}
                    </p>
                    <p>
                      {convertString(
                        delegator.stakeAddress,
                        isMobile || screenWidth < 1024,
                      )}
                    </p>
                  </div>

                  <div className="flex min-w-40 flex-col items-center justify-start">
                    <p className="font-bold">Active Stake</p>
                    <div>
                      <HoverText
                        shortText={formattedAda(delegator?.votingPower, 2)}
                        longText={formatAsCurrency(
                          lovelaceToAda(delegator?.votingPower),
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex min-w-40 flex-col items-center justify-start">
                    <p className="font-bold">Epoch</p>
                    <p> {delegator.delegationEpoch}</p>
                  </div>

                  <div className="flex min-w-40 flex-col items-start justify-start">
                    <p className="font-bold">Actions</p>
                    <div className="flex items-center gap-2">
                      <ViewProfileAction />
                    </div>
                  </div>
                </div>
                <hr className="w-dvw border" />
              </div>
            </div>
          );
        })
      ) : (
        <p>No delegators to show</p>
      )}
    </div>
  );
};

export default DrepDelegatorslist;
