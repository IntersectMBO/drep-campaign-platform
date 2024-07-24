import React from 'react';
import DrepInfoCardRow from '../molecules/DrepInfoCardRow';
import BecomeADrepCard from '../molecules/BecomeADrepCard';
import BecomeADRepButton from './BecomeADRepButton';

const CIPInfo = () => {
  return (
    <div className="mt-5  w-full block lg:grid lg:grid-cols-2 overflow-hidden rounded-t-3xl bg-white py-20 shadow-lg">
      <div className="flex items-center justify-center shrink-0">
        <img src="/img/1694-asset-2.png" alt="Asset 2" width={'80%'} />
      </div>
      <div className="base_container flex flex-col gap-10 text-sm">
        <p className="text-3xl lg:text-7xl font-bold leading-[68px] text-zinc-800">
          Abstract
        </p>
        <p>
          We propose a revision of Cardano's on-chain governance system to
          support the new requirements for Voltaire. The existing specialized
          governance support for protocol parameter updates and MIR certificates
          will be removed, and two new fields will be added to normal
          transaction bodies for:
        </p>
        <ol className="ml-10 list-decimal">
          <li>governance actions </li>
          <li>votes</li>
        </ol>

        <p>
          <span className="font-bold">Any Cardano user</span> will be allowed to
          submit a <span className="font-bold">governance action.</span> We also
          introduce three distinct governance bodies that have specific
          functions in this new governance framework:
        </p>
        <ol className="ml-10 list-decimal">
          <li>a constitutional committee</li>
          <li>
            a group of delegated representatives (henceforth called{' '}
            <span className="font-bold">DReps</span>)
          </li>
          <li>
            the stake pool operators (henceforth called{' '}
            <span className="font-bold">SPOs</span>).
          </li>
        </ol>

        <p>
          Every governance action must be ratified by at least two of these
          three governance bodies using their on-chain votes. The type of action
          and the state of the governance system determines which bodies must
          ratify it.
        </p>

        <p>
          Ratified actions are then <span className="font-bold">enacted</span>{' '}
          on-chain, following a set of well-defined rules.
        </p>
        <p>
          As with stake pools, any Ada holder may register to be a DRep and so
          choose to represent themselves and/or others. Also, as with stake
          pools, Ada holders may, instead, delegate their voting rights to any
          other DRep. Voting rights will be based on the total Ada that is
          delegated, as a whole number of Lovelace.
        </p>

        <p>
          The most crucial aspect of this proposal is therefore the notion of
          <span className="font-bold"> "one Lovelace = one vote".</span>
        </p>
        <BecomeADRepButton />
      </div>
    </div>
  );
};

export default CIPInfo;
