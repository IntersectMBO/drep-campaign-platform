import React from 'react';
import HotLinks from './HotLinks';
import Separator from './Separator';

const CIPChangelog = () => {
  return (
    <div className="bg-gradient-to-b from-[#E9EFFF] to-[#FFFFFF] py-10 text-black">
      <div className="base_container text-start">
        <p className="text-5xl font-bold">Changelog</p>
      </div>
      <HotLinks />
      <div className="base_container w-full ">
        <div className="max-w-3xl flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <p className="text-2xl font-bold">
              Changes post Longmont workshop (March 2023){' '}
            </p>
            <p>Changes post Longmont workshop (March 2023)</p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>Thank the workshop attendees.</li>
              <li>We have added Constitutional Committee terms.</li>
              <li>
                Two new "pre-defined" voting options: abstain and no confidence.
              </li>
              <li>New "Info" governance action.</li>
              <li>
                Use the most recent DRep stake distribution for ratification.
                This means that if ever your DRep votes how you do not like, you
                can immediately make yourself a DRep and vote how you want.
              </li>
              <li>
                Escrow some ADA from the current treasury for potential future
                DRep incentives.
              </li>
              <li>
                Remove the tiered treasury actions in favor of something
                adaptive (so the "yes" threshold would depend on:
                <ul>
                  <li>how much ada,</li>
                  <li>how high the registered voting stake, and maybe</li>
                  <li>how much ada is released every epoch</li>
                </ul>
              </li>
              <li>
                Split the protocol parameter updates into four groups: network,
                economic, technical, and governmental.
              </li>
              <li>
                Most governance actions can be enacted (upon ratification)
                right away. All but: protocol parameters and hard forks.
              </li>
              <li>
                Remove "one action per type per epoch" restriction in favor of
                tracking the last action ID of each type, and including this in
                the action.
              </li>
              <li>No AVST.</li>
              <li>
                Bootstrap phase: Until X% of ADA is registered to vote or Y
                epochs have elapsed, only parameter changes and hard forks can
                happen. PP changes just need CC threshold, HFs need CC and SPOs.
                After the bootstrap phase, we put in place the incentive to keep
                low DReps, but this mechanism automatically relaxes.
              </li>
              <li>New plutus script purpose for DReps.</li>
              <li>Multiple treasury withdrawals in one epoch.</li>
              <li>
                A section on the recursive problem of "how do we ratify this
                CIP".
              </li>
              <li>Changes to the local state-query protocol.</li>
              <li>
                New ideas, time permitting:
                <ul>
                  <li>Weigh SPO stake vote by pledge somehow.</li>
                  <li>
                    DReps can specify which other DRep gets their delegators in
                    the event that they retire.
                  </li>
                  <li>
                    Reduced government action deposit if one member of the CC
                    signs off on it (which presumably means it has gone through
                    some process).
                  </li>
                  <li>
                    Include hash of (future) genesis configuration within HF
                    proposal.
                  </li>
                </ul>
              </li>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <p className="text-2xl font-bold">
              Changes post Edinburgh workshop (July 2023)
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                Add guardrails script, which can control what treasury withdrawals
                and protocol parameter changes are allowed.
              </li>
              <li>
                Remove dropping of governance actions. The only effect this has
                is that in case a no confidence action passes, actions stay
                around. However, only new committee proposals that have been
                designed to build on top of that no confidence action can be
                enacted. If a new committee gets elected while some of those
                actions haven't expired, those actions can be ratified but the
                new committee has to approve them.
              </li>
              <li>
                All governance actions are enacted one epoch after they are
                ratified.
              </li>
              <li>Move post-bootstrapping restrictions into 'Other Ideas'.</li>
              <li>
                Add a section on different deposit amounts to 'Other Ideas'.
              </li>
              <li>Add a section for a minimum AVS to 'Other Ideas'.</li>
              <li>Rename some protocol parameters.</li>
              <li>Rename TALLY to GOV.</li>
              <li>Turn the Constitution into an anchor.</li>
              <li>Rework which anchors are required and which are optional.</li>
              <li>
                Clean up various inconsistencies and leftovers from older
                versions.
              </li>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <p className="text-2xl font-bold">
              Security-relevant changes and other fixes (January 2024)
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>Guard security-relevant changes behind SPO votes.</li>
              <li>
                The system does not enter a state of no confidence with
                insufficient active CC members, the CC just becomes unable to
                act.
              </li>
              <li>Clarify that CC members can use any kind of credential.</li>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <p className="text-2xl font-bold">
             May 2024
            </p>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>Update the section on the bootstrap period.</li>
              <li>
              Mention missing `Q_5` parameter.
              </li>
              <li>Various small fixes/consistency changes.</li>
            </ul>
          </section>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default CIPChangelog;
