import React from 'react';

const CIPRationale = () => {
  return (
    <div className="bg-blue-800">
      <div className="base_container flex w-full flex-col gap-5 py-10">
        <div>
          <p className="text-start text-5xl font-bold text-white">Rationale</p>
        </div>
        <div className="flex  flex-col items-center justify-center gap-8 text-white">
          <ul className="ml-5 flex list-disc flex-col gap-1">
            <li>Role of the constitutional committee</li>
            <li>Intentional omission of identity verification</li>
            <li>Reducing the power of entities with large amounts of Ada</li>
            <li>Piggybacking on stake pool stake distribution</li>
            <li>
              Separation of hard-fork initiation from standard protocol
              parameter changes
            </li>
            <li>The purpose of the DReps</li>
            <li>Ratification requirements table</li>
            <li>Motion of no-confidence</li>
            <li>New committee/threshold (state of no-confidence)</li>
            <li>The versatility of the info governance action</li>
            <li>Hard-fork initiation</li>
            <li>New metadata structures</li>
            <li>Controlling the number of active governance actions</li>
            <li>No AVST</li>
          </ul>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Role of the constitutional committee
            </p>

            <p>
              At first sight, the constitutional committee may appear to be a
              special committee that has been granted extra power over DReps.
              However, because DReps can replace the constitutional committee at
              any time and DRep votes are also required to ratify every
              governance action, the constitutional committee has no more (and
              may, in fact, have less) power than the DReps. Given this, what
              role does the committee play, and why is it not superfluous? The
              answer is that the committee solves the bootstrapping problem of
              the new governance framework. Indeed, as soon as we pull the
              trigger and enable this framework to become active on-chain, then
              without a constitutional committee, there would rapidly need to be
              sufficient DReps, so that the system did not rely solely on SPO
              votes. We cannot yet predict how active the community will be in
              registering as DReps, nor how reactive other Ada holders will be
              regarding delegation of votes.
            </p>
            <p>
              Thus, the constitutional committee comes into play to make sure
              that the system can transition from its current state into fully
              decentralized governance in due course. Furthermore, in the long
              run, the committee can play a mentoring and advisory role in the
              governance decisions by being a set of elected representatives who
              are put under the spotlight for their judgment and guidance in
              governance decisions. Above all, the committee is required at all
              times to adhere to the Constitution and to ratify proposals in
              accordance with the provisions of the Constitution.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Reducing the power of entities with large amounts of Ada
            </p>
            <p>
              Various mechanisms, such as quadratic voting, have been proposed
              to guard against entities with a large amount of influence. In a
              system based on "1 Lovelace, 1 vote", however, it is trivially
              easy to split stake into small amounts and undo the protections.
              Without an on-chain identity verification system we cannot adopt
              any such measures.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Piggybanking on stake pool stake distribution
            </p>
            <p>
              The Cardano protocol is based on a Proof-of-Stake consensus
              mechanism, so using a stake-based governance approach is sensible.
              However, there are many ways that could be used to define how to
              record the stake distribution between participants. As a reminder,
              network addresses can currently contain two sets of credentials:
              one to identify who can unlock funds at an address (a.k.a. payment
              credentials) and one that can be delegated to a stake pool (a.k.a.
              delegation credentials).
            </p>
            <p>
              Rather than defining a third set of credentials, we instead
              propose to re-use the existing delegation credentials, using a new
              on-chain certificate to determine the governance stake
              distribution. This implies that the set of DReps can (and likely
              will) differ from the set of SPOs, so creating balance. On the
              flip side, it means that the governance stake distribution suffers
              from the same shortcomings as that for block production: for
              example, wallet software providers must support multi-delegation
              schemes and must facilitate the partitioning of stake into
              sub-accounts should an Ada holder desire to delegate to multiple
              DReps, or an Ada holder must manually split their holding if their
              wallet does not support this.
            </p>
            <p>
              However, this choice also limits future implementation effort for
              wallet providers and minimizes the effort that is needed for
              end-users to participate in the governance protocol. The latter is
              a sufficiently significant concern to justify the decision. By
              piggybacking on the existing structure, the system remains
              familiar to users and reasonably easy to set up. This maximizes
              both the chance of success of, and the rate of participation in,
              the governance framework.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Separation of Hard Fork Initiation from Standard Protocol
              Parameter Changes
            </p>
            <p>
              In contrast to other protocol parameter updates, hard forks (or,
              more correctly, changes to the protocol's major version number)
              require much more attention. Indeed, while other protocol
              parameter changes can be performed without significant software
              changes, a hard fork assumes that a super-majority of the network
              has upgraded the Cardano node to support the new set of features
              that are introduced by the upgrade. This means that the timing of
              a hard fork event must be communicated well ahead of time to all
              Cardano users, and requires coordination between stake pool
              operators, wallet providers, DApp developers, and the node release
              team.
            </p>
            <p>
              Hence, this proposal, unlike the Shelley scheme, promotes hard
              fork initiations as a standalone governance action, distinct from
              protocol parameter updates.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">The purpose of the DReps</p>
            <p>
              Nothing in this proposal limits SPOs from becoming DReps. Why do
              we have DReps at all? The answer is that SPOs are chosen purely
              for block production and not all SPOs will want to become DReps.
              Voters can choose to delegate their vote to DReps without needing
              to consider whether they are also a good block producer, and SPOs
              can choose to represent Ada holders or not.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Ratification Requirements Table
            </p>
            <p>
              The requirements in the ratification requirement table are
              explained here. Most of the governance actions have the same kind
              of requirements: the constitutional committee and the DReps must
              reach a sufficient number of 'Yes' votes. This includes these
              actions:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>New committee/threshold (normal state)</li>
              <li>Update to the constitution</li>
              <li>Protocol parameter changes</li>
              <li>Treasury withdrawal</li>
            </ul>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">Motion of no-confidence</p>
            <p>
              A motion of no-confidence represents a lack of confidence by the
              Cardano community in the current constitutional committee, and
              hence the constitutional committee should not be included in this
              type of governance action. In this situation, the SPOs and the
              DReps are left to represent the will of the community.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              New committee/threshold (state-of-no-confidence)
            </p>
            <p>
              Similar to the motion of no-confidence, electing a constitutional
              committee depends on both the SPOs and the DReps to represent the
              will of the community.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              The versatility of the info governance action
            </p>
            <p>
              While not binding on chain, the Info governance action could be
              useful in an number of situations. These include:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>ratifying a CIP</li>
              <li>deciding on the genesis file for a new ledger era</li>
              <li>recording initial feedback for future governance actions</li>
            </ul>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">Hard-Fork initiation</p>
            <p>
              Regardless of any governance mechanism, SPO participation is
              needed for any hard fork since they must upgrade their node
              software. For this reason, we make their cooperation explicit in
              the hard fork initiation governance action, by always requiring
              their vote. The constitutional committee also votes, signaling the
              constitutionality of a hard fork. The DReps also vote, to
              represent the will of every stake holder.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">New Metadata structures</p>
            <p>
              The governance actions, the votes and the certificates and the
              Constitution use new metadata fields, in the form of URLs and
              integrity hashes (mirroring the metadata structure for stake pool
              registration). The metadata is used to provide context. Governance
              actions need to explain why the action is needed, what experts
              were consulted, etc. Since transaction size constraints should not
              limit this explanatory data, we use URLs instead.
            </p>
            <p>
              This does, however, introduce new problems. If a URL does not
              resolve, what should be the expectation for voting on that action?
              Should we expect everyone to vote 'No'? Is this an attack vector
              against the governance system? In such a scenario, the hash
              pre-image could be communicated in other ways, but we should be
              prepared for the situation. Should there be a summary of the
              justification on chain?
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Alternative: Use of transaction metadata
            </p>
            <p>
              Instead of specific dedicated fields in the transaction format, we
              could instead use the existing transaction metadata field.
            </p>
            <p>
              Governance-related metadata can be clearly identified by
              registering a CIP-10 metadata label. Within that, the structure of
              the metadata can be determined by this CIP (exact format TBD),
              using an index to map the vote or governance action ID to the
              corresponding metadata URL and hash.
            </p>
            <p>
              This avoids the need to add additional fields to the transaction
              body, at the risk of making it easier for submitters to ignore.
              However, since the required metadata can be empty (or can point to
              a non-resolving URL), it is already easy for submitters to not
              provide metadata, and so it is unclear whether this makes the
              situation worse.
            </p>
            <p>
              Note that transaction metadata is never stored in the ledger
              state, so it would be up to clients to pair the metadata with the
              actions and votes in this alternative, and would not be available
              as a ledger state query.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">
              Controlling the number of active governance actions
            </p>
            <p>
              Instead of specific dedicated fields in the transaction format, we
              could instead use the existing transaction metadata field.
            </p>
            <p>
              Since governance actions are available for anyone to submit, we
              need some mechanism to prevent those individuals responsible for
              voting from becoming overwhelmed with a flood of proposals. A
              large deposit is one such mechanism, but this comes at the
              unfortunate cost of being a barrier for some people to submit an
              action. Note, however, that crowd-sourcing with a Plutus script is
              always an option to gather the deposit.
            </p>
            <p>
              We could, alternatively, accept the possibility of a large number
              of actions active at any given time, and instead depend on
              off-chain socialization to guide voters' attention to those that
              merit it. In this scenario, the constitutional committee might
              choose to only consider proposals which have already garnered
              enough votes from the DReps.
            </p>
          </section>
          <section className="flex flex-col gap-3 font-light text-sm md:text-md lg:text-lg">
            <p className="text-2xl font-bold">No AVST</p>
            <p>
              An earlier draft of this CIP included the notion of an "active
              voting stake threshold", or AVST. The purpose of AVST was to
              ensure the legitimacy of each vote, removing the possibility that,
              for example, 9 out of 10 Lovelace could decide the fate of
              millions of entities on Cardano. There are really two concerns
              here, which are worth separating.
            </p>
            <p>
              The first concern is that of bootstrapping the system, i.e.
              reaching the initial moment when sufficient stake is registered to
              vote. The second concern is that the system could lose
              participation over time. One problem with the AVST is that it
              gives an incentive for SPOs to desire a low voting registration
              (since their votes then hold more weight). This is absolutely not
              a slight on the existing SPOs, but an issue with bad incentives.
            </p>
            <p>
              We have chosen, therefore, to solve the two concerns differently.
              We solve the bootstrapping problem as described in the section on
              bootstrapping. We solve the long-term participation problem by not
              allowing reward withdrawals (after the bootstrap phase) unless the
              stake is delegated to a DRep (including the two special cases,
              namely 'Abstain' and 'No confidence').
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CIPRationale;
