import React from 'react';
import ToastCard from './ToastCard';
import Separator from './Separator';

const CIPDRepInfo = () => {
  return (
    <div className="bg-blue-800">
      <div className="base_container py-10">
        <div
          id="delegated-representatives-dreps"
          className="mb-5 text-3xl lg:text-6xl font-bold text-violet-50"
        >
          <p>Delegated</p>
          <p>Representatives (DReps)</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <ToastCard
            type="warning"
            text="CIP-1694 DReps should not be conflated with Project Catalyst DReps."
          />
          <section
            id="pre-defined-dreps"
            className="flex flex-col gap-3 text-white"
          >
            <div className="flex w-full items-center justify-center">
              <img src="/img/becomeDrepImg.png" alt="" width={'25%'} />
            </div>
            <p className="text-2xl lg:text-3xl font-bold">Pre-defined DReps </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                Abstain If an Ada holder delegates to Abstain, then their stake
                is actively marked as not participating in governance. The
                effect of delegating to Abstain on chain is that the delegated
                stake will not be considered to be a part of the active voting
                stake. However, the stake will be considered to be registered
                for the purpose of the incentives that are described in
                Incentives for Ada holders to delegate voting stake.
              </li>
              <li>
                No Confidence If an Ada holder delegates to No Confidence, then
                their stake is counted as a Yes vote on every No Confidence
                action and a No vote on every other action. The delegated stake
                will be considered part of the active voting stake. It also
                serves as a directly auditable measure of the confidence of Ada
                holders in the constitutional committee.
              </li>
            </ul>
            <ToastCard
              type="info"
              text="The pre-defined DReps do not cast votes inside of transactions, their behavior is accounted for at the protocol level. The Abstain DRep may be chosen for a variety of reasons, including the desire to not participate in the governance system."
            />
            <ToastCard
              type="info"
              text="Any Ada holder may register themselves as a DRep and delegate to themselves if they wish to actively participate in voting."
            />
          </section>
          <Separator />
          <section
            id="registered-dreps"
            className="flex flex-col gap-3 text-white"
          >
            <p className="text-2xl lg:text-3xl font-bold">Registered DReps </p>
            <p>
              In Voltaire, existing stake credentials will be able to delegate
              their stake to DReps for voting purposes, in addition to the
              current delegation to stake pools for block production. DRep
              delegation will mimic the existing stake delegation mechanisms
              (via on-chain certificates). Similarly, DRep registration will
              mimic the existing stake registration mechanisms. Additionally,
              registered DReps will need to vote regularly to still be
              considered active. Specifically, if a DRep does not submit any
              votes for drepActivity-many epochs, the DRep is considered
              inactive, where drepActivity is a new protocol parameter. Inactive
              DReps do not count towards the active voting stake anymore, and
              can become active again for drepActivity-many epochs by voting on
              any governance actions. The reason for marking DReps as inactive
              is so that DReps who stop participating but still have stake
              delegated to them do not eventually leave the system in a state
              where no governance action can pass. Registered DReps are
              identified by a credential that can be either:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>A verification Key (Ed25519)</li>
              <li>A native or Plutus Script</li>
            </ul>
            <p>
              The blake2b-224 hash digest of a serialized DRep credential is
              called the DRep ID. The following new types of certificates will
              be added for DReps: DRep registration certificates, DRep
              retirement certificates, and vote delegation certificates. DRep
              registration certificates
            </p>
            <ToastCard
              type="info"
              text="DRep delegation always maps a stake credential to a DRep credential. This means that a DRep cannot delegate voting stake to another DRep"
            />
          </section>
          <Separator />
          <section
            id="new-stake-distribution-for-dreps"
            className="flex flex-col gap-3 text-white"
          >
            <p className="text-2xl lg:text-3xl font-bold">New stake distribution</p>
            <p>
              In addition to the existing per-stake-credential distribution and
              the per-stake-pool distribution, the ledger will now also
              determine the per-DRep stake distribution. This distribution will
              determine how much stake each vote from a DRep is backed by.
            </p>
            <ToastCard
              type="warning"
              text="Unlike the distribution that is used for block production, we will always use the most current version of the per-DRep stake distribution as given on the epoch boundary.

              This means that for any topic which individual voters care deeply about, they have time to delegate to themselves as a DRep and vote directly. However, it means that there may be a difference between the stake that is used for block production and the stake that is used for voting in any given epoch."
            />
          </section>
          <Separator />
          <section className="flex flex-col gap-3 text-white">
            <p className="text-2xl lg:text-3xl font-bold">
              Incentives for Ada holders to delegate voting stake
            </p>
            <p>
              There will be a short bootstrapping phase during which rewards
              will be earned for stake delegation etc. and may be withdrawn at
              any time. After this phase, although rewards will continue to be
              earned for block delegation etc., reward accounts will be blocked
              from withdrawing any rewards unless their associated stake
              credential is also delegated to a DRep. This helps to ensure high
              participation, and so, legitimacy.
            </p>
            <ToastCard
              type="warning"
              text="Even though rewards cannot be withdrawn, they are not lost. As soon as a stake credential is delegated (including to a pre-defined DRep), the rewards can be withdrawn."
            />
          </section>
          <Separator />
          <section
            id="drep-incentives"
            className="flex flex-col gap-3 text-white"
          >
            <p className="text-2xl lg:text-3xl font-bold">DRep incentives</p>
            <p>
              DReps arguably need to be compensated for their work. Research on
              incentive models is still ongoing, and we do not wish to hold up
              implementation of this CIP while this is resolved. Our interim
              proposal is therefore to escrow Lovelace from the existing Cardano
              treasury until this extremely important decision can be agreed on
              by the community, through the on-chain governance mechanism that
              is being constructed. Alternatively, DReps could pay themselves
              through instances of the "Treasury withdrawal" governance action.
              Such an action would be auditable on-chain, and should reflect an
              off-chain agreement between DReps and delegators.
            </p>
          </section>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default CIPDRepInfo;
