import React from 'react';
import GovernanceActionsTable from './GovernanceActionsTable';
import ToastCard from './ToastCard';
import Separator from './Separator';
import HotLinks from './HotLinks';
import GovernanceActionsTypeTable from './GovernanceActionsTypeTable';
import GovernanceActionsDescTable from './GovernanceActionsDescTable';

const CIPGovernanceActions = () => {
  return (
    <div className="bg-gradient-to-b from-[#E9EFFF] to-[#FFFFFF]">
      <div className="base_container flex w-full flex-col items-center justify-center py-10">
        <div id="governance-actions" className="w-full">
          <p className="text-start text-5xl font-bold text-zinc-800">
            Governance actions
          </p>
        </div>
        <HotLinks />
        <div className="inner_container flex flex-col items-center justify-center">
          <section className="my-5 flex w-full flex-col gap-6">
            <p>
              We define seven different types of{' '}
              <span className="font-bold">governance actions</span>. A
              governance action is an on-chain event that is triggered by a
              transaction and has a deadline after which it cannot be enacted.
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                An action is said to be ratified when it gathers enough votes in
                its favor (through the rules and parameters that are detailed
                below).
              </li>
              <li>
                An action that fails to be ratified before its deadline is said
                to have expired.
              </li>
              <li>
                An action that has been ratified is said to be enacted once it
                has been activated on the network.
              </li>
            </ul>
            <GovernanceActionsTable />

            <p>
              Any Ada holder can submit a governance action to the chain. They
              must provide a deposit of govActionDeposit Lovelace, which will be
              returned when the action is finalized (whether it is ratified or
              has expired). The deposit amount will be added to the deposit pot,
              similar to stake key deposits. It will also be counted towards the
              stake of the reward address it will be paid back to, to not reduce
              the submitter's voting power to vote on their own (and competing)
              actions.
            </p>
            <p>
              If a guardrails script is present, the transaction must include
              that script in the witness set either directly, or via reference
              inputs, and any other requirements that the guardrails script
              makes must be satisfied.
            </p>
            <p>
              Note that a motion of no-confidence is an extreme measure that
              enables Ada holders to revoke the power that has been granted to
              the current constitutional committee.
            </p>
            <ToastCard
              type="info"
              text="A single governance action might contain multiple protocol parameter updates. Many parameters are inter-connected and might require moving in lockstep."
            />
          </section>
          <Separator />
          <section
            id="ratification"
            className="my-5 flex w-full flex-col gap-6"
          >
            <p className="font-bold lg:text-xl">Ratification</p>
            <p>
              Governance actions are ratified through on-chain voting actions.
              Different kinds of governance actions have different ratification
              requirements but always involve two of the three governance
              bodies, with the exception of a hard-fork initiation and
              security-relevant protocol parameters, which requires ratification
              by all governance bodies. Depending on the type of governance
              action, an action will thus be ratified when a combination of the
              following occurs:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                the constitutional committee approves of the action (the number
                of members who vote Yes meets the threshold of the
                constitutional committee)
              </li>
              <li>
                the DReps approve of the action (the stake controlled by the
                DReps who vote Yes meets a certain threshold of the total active
                voting stake)
              </li>
              <li>
                the SPOs approve of the action (the stake controlled by the SPOs
                who vote Yes meets a certain threshold over the total delegated
                active stake for the epoch).
              </li>
            </ul>
            <ToastCard
              type="warning"
              text="As explained above, different stake distributions apply to DReps and SPOs."
            />
            <p>
              A successful motion of no-confidence, update of the constitutional
              committee, a constitutional change, or a hard-fork, delays
              ratification of all other governance actions until the first epoch
              after their enactment. This gives an updated constitutional
              committee enough time to vote on current proposals, re-evaluate
              existing proposals with respect to a new constitution, and ensures
              that the in principle arbitrary semantic changes caused by
              enacting a hard-fork do not have unintended consequences in
              combination with other actions.
            </p>
            <p id="requirements" className="text-lg font-extrabold">
              Requirements
            </p>
            <p>
              The following table details the ratification requirements for each
              governance action scenario. The columns represent:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                <span className="font-bold">Governance action type</span>
                <br /> The type of governance action. Note that the protocol
                parameter updates are grouped into four categories.
              </li>
              <li>
                <span className="font-bold">
                  Constitutional committee (abbrev. CC)
                </span>
                <br /> A value of ✓ indicates that the constitutional committee
                must approve this action.
                <br /> A value of - means that constitutional committee votes do
                not apply.
              </li>
              <li>
                <span className="font-bold">DReps</span>
                <br /> The DRep vote threshold that must be met as a percentage
                of active voting stake.
              </li>
              <li>
                <span className="font-bold">SPOs</span>
                <br /> The SPO vote threshold which must be met as a percentage
                of the stake held by all stake pools.
                <br />A value of - means that SPO votes do not apply
              </li>
            </ul>
            <GovernanceActionsTypeTable />
            <p>
              Each of these thresholds is a governance parameter. There is one
              additional threshold, Q5, related to security relevant protocol
              parameters, which is explained below. The initial thresholds
              should be chosen by the Cardano community as a whole. All
              thresholds for the Info action are set to 100% since setting it
              any lower would result in not being able to poll above the
              threshold.
            </p>
            <p>
              Some parameters are relevant to security properties of the system.
              Any proposal attempting to change such a parameter requires an
              additional vote of the SPOs, with the threshold Q5.
            </p>
            <p>The security relevant protocol parameters are:</p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>maxBlockBodySize</li>
              <li>maxTxSize</li>
              <li>maxBlockHeaderSize</li>
              <li>maxValueSize</li>
              <li>maxBlockExecutionUnits</li>
              <li>txFeePerByte</li>
              <li>txFeeFixed</li>
              <li>utxoCostPerByte</li>
              <li>govActionDeposit</li>
              <li>minFeeRefScriptCostPerByte</li>
            </ul>
            <ToastCard
              type="info"
              text="It may make sense for some or all thresholds to be adaptive with respect to the Lovelace that is actively registered to vote. For example, a threshold could vary between 51% for a high level of registration and 75% for a low level registration. Moreover, the treasury threshold could also be adaptive, depending on the total Lovelace that is being withdrawn, or different thresholds could be set for different levels of withdrawal."
            />
            <ToastCard
              type="info"
              text="To achieve legitimacy, the minimum acceptable threshold should be no less than 50% of the delegated stake."
            />
            <p id="restrictions" className="text-2xl font-bold text-zinc-800">
              Restrictions
            </p>
            <p>
              Apart from Treasury withdrawals and Infos, we include a mechanism
              for ensuring that governance actions of the same type do not
              accidentally clash with each other in an unexpected way.
            </p>
            <p>
              Each governance action must include the governance action ID for
              the most recently enacted action of its given type. This means
              that two actions of the same type can be enacted at the same time,
              but they must be deliberately designed to do so.
            </p>
            <p id="enactment" className="text-2xl font-bold text-zinc-800">
              Enactment
            </p>
            <p>
              Actions that have been ratified in the current epoch are
              prioritised as follows for enactment:
            </p>
            <ul className="ml-8 flex list-decimal flex-col gap-2">
              <li>Motion of no-confidence </li>
              <li>Update committee/threshold</li>
              <li>New Constitution or Guardrails Script</li>
              <li>Hard Fork Intitiation</li>
              <li>Protocol parameter changes</li>
              <li>Treasury withdrawals</li>
              <li>Info</li>
            </ul>
            <ToastCard
              type="info"
              text="Info actions cannot be ratified or enacted, since they do not have any effect on the protocol."
            />
            <p className="text-2xl font-bold text-zinc-800">
              Order of enactment
            </p>
            <p>
              Governance actions are enacted in order of acceptance to the
              chain. This resolves conflicts where, e.g. there are two competing
              parameter changes.
            </p>
            <p className="text-2xl font-bold text-zinc-800">Lifecycle</p>
            <p>
              Governance actions are checked for ratification only on an epoch
              boundary. Once ratified, actions are staged for enactment.
            </p>
            <p>All submitted governance actions will therefore either:</p>
            <ul className="ml-8 flex list-decimal flex-col gap-2">
              <li>be ratified, then enacted</li>
              <li>or expire after a number of epochs</li>
            </ul>
            <p>
              In all of those cases, deposits are returned immediately.
              <br />
              <br />
              All governance actions are enacted on the epoch boundary after
              their ratification.
            </p>
            <p id="lifecycle" className="text-2xl font-bold text-zinc-800">
              Lifecycle
            </p>
            <p>Every governance action will include the following:</p>
            <ul className="ml-8 flex list-decimal flex-col gap-2">
              <li>
                a deposit amount (recorded since the amount of the deposit is an
                updatable protocol parameter)
              </li>
              <li>a reward address to receive the deposit when it is repaid</li>
              <li>
                an anchor for any metadata that is needed to justify the action
              </li>
              <li>
                a hash digest value to prevent collisions with competing actions
                of the same type (as described earlier)
              </li>
            </ul>
            <p>
              In addition, each action will include some elements that are
              specific to its type:
            </p>
            <GovernanceActionsDescTable />
            <ToastCard
              type="info"
              text="The new major protocol version must be precisely one greater than the current protocol version. Any two consecutive epochs will therefore either have the same major protocol version, or the later one will have a major protocol version that is one greater."
            />
            <ToastCard
              type="info"
              text="There can be no duplicate committee members - each pair of credentials in a committee must be unique."
            />
            <p>
              Each governance action that is accepted on the chain will be
              assigned a unique identifier (a.k.a. the governance action ID),
              consisting of the transaction hash that created it and the index
              within the transaction body that points to it.
            </p>
            <p id="protocol-parameter-groups" className="text-2xl font-bold">
              Protocol Parameter Groups
            </p>
            <p>
              We have grouped the protocol parameter changes by type, allowing
              different thresholds to be set for each group.
            </p>
            <p>
              We are not, however, restricting each protocol parameter
              governance action to be contained within one group. In case where
              a governance action carries updates for multiple parameters from
              different groups, the maximum threshold of all the groups involved
              will apply to any given such governance action.
            </p>
            <p>
              The network, economic and technical parameter groups collect
              existing protocol parameters that were introduced during the
              Shelley, Alonzo and Babbage eras. In addition, we introduce a new
              governance group that is specific to the new governance parameters
              that will be introduced by CIP-1694.
            </p>
            <p>
              The <span className="font-bold">network group</span> consists of:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>maximum block body size (maxBlockBodySize).</li>
              <li>maximum transaction size (maxTxSize)</li>
              <li>maximum block header size (maxBlockHeaderSize)</li>
              <li>maximum size of a serialized asset value (maxValueSize)</li>
              <li>
                maximum script execution units in a single transaction
                (maxTxExecutionUnits)
              </li>
              <li>
                maximum script execution units in a single block
                (maxBlockExecutionUnits)
              </li>
              <li>maximum number of collateral inputs (maxCollateralInputs)</li>
            </ul>
            <p>
              The <span className="font-bold">economic group</span> consists of:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>minimum fee coefficient (txFeePerByte)</li>
              <li>minimum fee constant (txFeeFixed)</li>
              <li>delegation key Lovelace deposit (stakeAddressDeposit)</li>
              <li>pool registration Lovelace deposit (stakePoolDeposit)</li>
              <li>monetary expansion(monetaryExpansion)</li>
              <li>treasury expansion(treasuryCut)</li>
              <li>minimum fixed rewards cut for pools (minPoolCost)</li>
              <li>
                minimum Lovelace deposit per byte of serialized UTxO
                (utxoCostPerByte)
              </li>
              <li>prices of Plutus execution units (executionUnitPrices)</li>
            </ul>
            <p>
              The <span className="font-bold">technical group</span> consists
              of:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>pool pledge influence(poolPledgeInfluence).</li>
              <li>pool retirement maximum poch (poolRetireMaxEpoch)</li>
              <li>desired number of pools (stakePoolTargetNum)</li>
              <li>Plutus execution cost models (costModels)</li>
              <li>
                proportion of collateral needed for
                scripts(collateralPercentage)
              </li>
            </ul>
            <p>
              The <span className="font-bold">governance group</span> consisits
              of all the new protocol parameters that are introduced in this
              CIP:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                {
                  'governance voting thresholds ($P_1$, $P_{2a}$, $P_{2b}$, $P_3$, $P_4$, $P_{5a}$, $P_{5b}$, $P_{5c}$, $P_{5d}$, $P_6$, $Q_1$, $Q_{2a}$, $Q_{2b}$, $Q_4$), $Q_5$)'
                }
              </li>
              <li>
                governance action maximum lifetime in epochs (govActionLifetime)
              </li>
              <li>governance action deposit (govActionDeposit)</li>
              <li>DRep deposit amount (drepDeposit)</li>
              <li>DRep activity period in epochs (drepActivity)</li>
              <li>minimal constitutional committee size (committeeMinSize)</li>
              <li>
                maximum term length (in epochs) for the constitutional committee
                members (committeeMaxTermLength)
              </li>
            </ul>
            <p id="votes" className="text-2xl font-bold">
              Votes
            </p>
            <p>Each vote transaction consists of the following:</p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>a governance action ID</li>
              <li>a role - constitutional committee member, DRep, or SPO</li>
              <li>
                an optional anchor (as defined above) for information that is
                relevant to the vote
              </li>
              <li>a 'Yes'/'No'/'Abstain' vote</li>
            </ul>
            <p>
              For SPOs and DReps, the number of votes that are cast (whether
              'Yes', 'No' or 'Abstain') is proportional to the Lovelace that is
              delegated to them at the point the action is checked for
              ratification. For constitututional committee members, each current
              committee member has one vote
            </p>
            <ToastCard
              type="warning"
              text={`'Abstain' votes are not included in the "active voting stake". Note that an explicit vote to abstain differs from abstaining from voting. Unregistered stake that did not vote behaves like an 'Abstain' vote, while registered stake that did not vote behaves like a 'No' vote. To avoid confusion, we will only use the word 'Abstain' from this point onward to mean an on-chain vote to abstain.'`}
            />
            <p>
              The governance credential witness will trigger the appropriate
              verifications in the ledger according to the existing UTxOW ledger
              rule (i.e. a signature check for verification keys, and a
              validator execution with a specific vote redeemer and new Plutus
              script purpose for scripts).
            </p>
            <p>
              Votes can be cast multiple times for each governance action by a
              single credential. Correctly submitted votes override any older
              votes for the same credential and role. That is, the voter may
              change their position on any action if they choose. As soon as a
              governance action is ratified, voting ends and transactions
              containing further votes are invalid.
            </p>
            <p id="governance-state" className="text-2xl font-bold">
              Governance State
            </p>
            <p>
              When a governance action is successfully submitted to the chain,
              its progress will be tracked by the ledger state. In particular,
              the following will be tracked:
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>the governance action ID</li>
              <li>the epoch that the action expires</li>
              <li>the deposit amount</li>
              <li>
                the rewards address that will receive the deposit when it is
                returned
              </li>
              <li>
                the total 'Yes'/'No'/'Abstain' votes of the constitutional
                committee for this action
              </li>
              <li>
                the total 'Yes'/'No'/'Abstain' votes of the DReps for this
                action
              </li>
              <li>
                the total 'Yes'/'No'/'Abstain' votes of the SPOs for this action
              </li>
            </ul>
            <p
              id="changes-to-the-stake-snapshot"
              className="text-2xl font-bold"
            >
              Changes to the stake snapshot
            </p>
            <p>
              Since the stake snapshot changes at each epoch boundary, a new
              tally must be calculated when each unratified governance action is
              checked for ratification. This means that an action could be
              enacted even though the DRep or SPO votes have not changed (since
              the vote delegation could have changed).
            </p>
            <p
              id="definitions-relating-to-voting-stake"
              className="text-2xl font-bold"
            >
              Definitions related to voting stake
            </p>
            <p>We define a number of new terms related to voting stake:</p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                Lovelace contained in a transaction output is considered active
                for voting (that is, it forms the "active voting stake"):
                <ul className="ml-5 flex list-disc flex-col gap-2">
                  <li>It contains a registered stake credential.</li>
                  <li>
                    The registered stake credential has delegated its voting
                    rights to a DRep.
                  </li>
                </ul>
              </li>
              <li>
                Relative to some percentage P, a DRep (SPO) vote threshold has
                been met if the sum of the relative stake that has been
                delegated to the DReps (SPOs) that vote Yes to a governance
                action is at least P.
              </li>
            </ul>
          </section>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default CIPGovernanceActions;
