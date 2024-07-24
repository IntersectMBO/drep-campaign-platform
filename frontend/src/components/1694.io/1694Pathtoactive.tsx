import React from 'react';
import ToastCard from './ToastCard';
import HotLinks from './HotLinks';

const CIPPathtoactive = () => {
  return (
    <div className="bg-blue-800 py-16">
      <HotLinks seethrough />
      <div className="base_container flex flex-col gap-5 text-white">
        <div className="text-start">
          <p className="text-5xl font-bold">Path to Active</p>
        </div>
        <div className="flex flex-col gap-3">
          <section className="flex flex-col gap-10">
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">Acceptance criteria</p>
              <ul>
                <li>
                  A new ledger era is enabled on the Cardano mainnet, which
                  implements the above specification.
                </li>
              </ul>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">Implementation Plan</p>
              <p>The features in this CIP require a hard fork.</p>
              <p>
                This document describes an ambitious change to Cardano
                governance. We propose to implement the changes via two hard
                forks: the first one containing all new features but some being
                disabled for a bootstrap period and the second one enabling all
                features.
              </p>
              <p>
                In the following sections, we give more details about the
                various implementation work items that have already been
                identified. In addition, the final section exposes a few open
                questions which will need to be finalized. We hope that those
                questions can be addressed through community workshops and
                discussions.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">
                Ratification of this proposal
              </p>
              <p>
                The ratification of this proposal is something of a circular
                problem: we need some form of governance framework in order to
                agree on what the final governance framework should be. As has
                been stated many times, CIPs are not authoritative, nor are they
                a governance mechanism. Rather, they describe technical
                solutions that have been deemed sound (from a technical
                standpoint) by community of experts.
              </p>
              <p>
                CIP-1694 arguably goes beyond the usual scope of the CIP process
                and there is a strong desire to ratify this CIP through some
                process. However, that process is yet to be defined and it
                remains an open question. The final ratification process is
                likely to be a blend of various ideas, such as:
              </p>
              <ul className="ml-5 flex list-disc flex-col gap-1">
                <li>
                  Gather opinions from community-held workshops, akin to the
                  Colorado workshop of February-March 2023.
                </li>
                <li>
                  Exercise voting actions on a public testnet, with sufficient
                  participation.
                </li>
                <li>Poll the established SPOs.</li>
                <li>
                  Leverage Project Catalyst to gather inputs from the existing
                  voting community (albeit small in terms of active stake).
                </li>
              </ul>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">
                Changes to the transaction body
              </p>
              <ul className="ml-5 flex list-disc flex-col gap-1">
                <li>
                  New elements will be added to the transaction body, and
                  existing update and MIR capabilities will be removed. In
                  particular, the governance actions and votes will comprise two
                  new transaction body fields.
                </li>
                <li>
                  Three new kinds of certificates will be added in addition to
                  the existing ones:
                  <ul className="my-1 ml-5 flex list-disc flex-col gap-1">
                    <li>DRep registration</li>
                    <li>DRep de-registration</li>
                    <li>Vote delegation</li>
                  </ul>
                </li>
                <li>
                  And similarly, the current MIR and genesis certificates will
                  be removed.
                </li>
                <li>
                  A new Voting purpose will be added to Plutus script contexts.
                  This will provide, in particular, the vote to on-chain
                  scripts.
                </li>
              </ul>
              <ToastCard
                type="warning"
                text="As usual, we will provide a CDDL specification for each of those changes."
              />
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">
                Changes to the existing ledger rules
              </p>
              <ul className="my-1 ml-5 flex list-disc flex-col gap-1">
                <li>
                  The PPUP transition rule will be rewritten and moved out of
                  the UTxO rule and into the LEDGER rule as a new GOV rule. It
                  will process and record the governance actions and votes.
                </li>
                <li>The NEWEPOCH transition rule will be modified.</li>
                <li>The MIR sub-rule will be removed.</li>
                <li>
                  A new RATIFY rule will be introduced to stage governance
                  actions for enactment. It will ratify governance actions, and
                  stage them for enactment in the current or next epoch, as
                  appropriate.
                </li>
                <li>
                  A new ENACTMENT rule will be called immediately after the
                  EPOCH rule. This rule will enact governance actions that have
                  previously been ratified.
                </li>
                <li>
                  The EPOCH rule will no longer call the NEWPP sub-rule or
                  compute whether the quorum is met on the PPUP state.
                </li>
              </ul>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">
                Changes to the local state-query protocol
              </p>
              <ul className="ml-5 mt-2 flex list-disc flex-col gap-1">
                <li>
                  The on-chain governance workload is large, but the off-chain
                  workload for tools and applications will arguably be even
                  larger. To build an effective governance ecosystem, the ledger
                  will have to provide interfaces to various governance
                  elements.
                </li>
                <li>
                  While votes and DReps (de)registrations are directly visible
                  in blocks and will, therefore, be accessible via the existing
                  local-chain-sync protocols; we will need to upgrade the
                  local-state-query protocol to provide extra insights on
                  information which are harder to infer from blocks (i.e. those
                  that require maintaining a ledger state). New state queries
                  should cover (at least):
                  <ul className="ml-5 mt-2 flex list-disc flex-col gap-1">
                    <li>Governance actions currently staged for enactment</li>
                    <li>
                      Governance actions under ratification, with the total and
                      percentage of yes stake, no stake and abstain stake
                    </li>
                    <li>
                      The current constitutional committee, and constitution
                      hash digest
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-2xl font-bold">Bootstrapping Phase</p>
              <p>
                We will need to be careful how we bootstrap this fledgling
                government. All the parties that are involved will need ample
                time to register themselves and to become familiar with the
                process.
              </p>
              <p>
                Special provisions will apply in the initial bootstrap phase.
                Firstly, during the bootstrap phase, a vote from the
                constitutional committee is sufficient to change the protocol
                parameters. Secondly, during the bootstrap phase, a vote from
                the constitutional committee, together with a sufficient SPO
                vote, is sufficient to initiate a hard fork.
              </p>
              <p>
                The bootstrap phase ends when a given number of epochs has
                elapsed, as specified in the next ledger era configuration file.
                This is likely to be a number of months after the hard fork.
              </p>
              <p>
                Thirdly, info actions will be available. No other actions other
                than those mentioned in this paragraph are possible during the
                bootstrap phase. The bootstrap phase ends when the
                Constitutional Committee and SPOs ratify a subsequent hard fork,
                enabling the remaining governance actions and DRep
                participation. This is likely to be a number of months after the
                Chang hard fork. Although all features will be technically
                available at this point, additional requirements for using each
                feature may be specified in the constitution.
              </p>
              <p>
                Moreover, there will be an interim Constitutional committee with
                a set term, also specified in the next ledger era configuration
                file. The rotational schedule of the first non-interim committee
                could be included in the constitution itself. Note, however,
                that since the constitutional committee never votes on new
                committees, it cannot actually enforce the rotation.
              </p>
            </div>
          </section>
          <section className="flex flex-col gap-10">
            <p className="text-2xl font-bold">Other Ideas / Open Questions</p>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">Pledge-weighted SPO voting</p>
              <p>
                The SPO vote could additionally be weighted by each SPO's
                pledge. This would provide a mechanism for allowing those with
                literal stake in the game to have a stronger vote. The weighting
                should be carefully chosen.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Automatic re-delegation of DReps
              </p>
              <p>
                A DRep could optionally list another DRep credential in their
                registration certificate. Upon retirement, all of the DRep's
                delegations would be automatically transferred to the given DRep
                credential. If that DRep had already retired, the delegation
                would be transfer to the 'Abstain' voting option.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">No DRep registration</p>
              <p>
                Since the DRep registration does not perform any necessary
                functions, the certificates for (de-)registering DReps could be
                removed. This makes the democracy more liquid since it removes
                some bureaucracy and also removes the need for the DRep deposit,
                at the cost of moving the anchor that is part of the DRep
                registration certificate into the transaction metadata.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Reduced deposits for some government actions
              </p>
              <p>
                The deposit that is attached to governance actions exists to
                prevent a flood of non-serious governance actions, each of which
                would require time and attention from the Cardano community. We
                could reduce this deposit for proposals which go through some
                agreed upon off-chain process. This would be marked on-chain by
                the endorsement of at least one constitutional committee member.
                The downside of this idea is that it gives more power to the
                constitutional committee.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Different deposit amounts for different governance actions
              </p>
              <p>
                Multiple workshops for this CIP have proposed to introduce a
                different deposit amount for each type of governance action. It
                was not clear whether a majority was in favor of this idea, but
                this may be considered if it becomes clear that it is necessary.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">Minimum active voting stake</p>
              <p>
                As a further guarantee to ensure governance actions cannot be
                proposed right before a hard fork, be voted on by one DRep with
                a large amount of stake and be enacted immediately, there could
                be an additional requirement that a certain fixed absolute
                amount of stake needs to cast a 'Yes' vote on the action to be
                enacted.
              </p>
              <p>
                This does not seem necessary in the current design, since the
                stake of all registered DReps behaves like a 'No' vote until
                they have actually cast a vote. This means that for this
                scenario to occur, the malicious actor needs at least to be in
                control of the fraction of DRep stake corresponding to the
                relevant threshold, at which point this might as well be
                considered a legitimate action.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Include hash of (future) genesis configuration within hard-fork
                proposal
              </p>
              <p>
                Some hard-forks require new genesis configurations. This has
                been the case for the Shelley and Alonzo hard forks (but not
                Allegra, Mary, Vasil or Valentine), may be the case in the
                future. At the moment, this proposal doesn't state anything
                about such a genesis configuration: it is implicitly assumed to
                be an off-chain agreement. We could however, enforce that (the
                hash of) a specific genesis configuration is also captured
                within a hard-fork governance action.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">Adaptive thresholds</p>
              <p>
                As discussed above, it may make sense for some or all thresholds
                to be adaptive with respect to the Lovelace that is actively
                registered to vote, so that the system provides greater
                legitimacy when there is only a low level of active voting
                stake. The bootstrapping mechanism that is proposed above may
                subsume this, however, by ensuring that the governance system is
                activated only when a minimum level of stake has been delegated
                to DReps.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Renaming DReps / state of no-confidence?
              </p>
              <p>
                It has been stated several times that "DReps" as presented here,
                might be confused with Project Catalst DReps. Similarly, some
                people have expressed confusion between the state of
                no-confidence, the motion of no-confidence and the no-confidence
                voting option.
                <br />
                We could imagine finding better terms for these concepts.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Rate-limiting treasury movements
              </p>
              <p>
                Nothing prevents money being taken out of the treasury other
                than the proposed votes and voting thresholds. Given that the
                Cardano treasury is a quite fundamental component of its
                monetary policy, we could imagine enforcing (at the protocol
                level) the maximum amount that can removed from the treasury
                over any period of time.
              </p>
            </div>
            <div className="md:text-md flex flex-col gap-4 text-sm lg:text-lg">
              <p className="text-xl font-bold">
                Final safety measure, post bootstrapping
              </p>
              <p>
                Many people have stated that they believe that the actual voting
                turnout will not be so large as to be a strain on the throughput
                of the system. We also believe that this is likely to be the
                case, but when the bootstrap phase ends we might put one final,
                temporary safety measure in place (this will also allow us to
                justify a low DRep deposit amount).
              </p>
              <p>
                For values of $X$ and $Y$ that are still to be determined, as
                soon as the bootstrap phase has ended, when we calculate the
                DReps stake distribution for the next epoch boundary, we will
                consider only those DReps that are either in the top $X$-many
                DReps ranked by stake amount, or those DReps that have at least
                $Y$ Lovelace. Every epoch, the value of $X$ will increase and
                the value of $Y$ will decrease, so that eventually $X$ will be
                effectively infinite and $Y$ will be zero. Note that this is
                only an incentive, and nothing actually stops any DRep from
                casting their vote (though it will not be counted if it does not
                meet the requirements).
              </p>
              <p>
                If the community decides at some point that there is indeed a
                problem with congestion, then a hard fork could be enacted that
                limits the number of DReps in a more restrictive way.
              </p>
              <p>
                Reasonable numbers for the initial value of $X$ are probably
                5,000-10,000. Reasonable numbers for the initial value of $Y$
                are probably the total number of Lovelace divided by the initial
                value of $X$.
              </p>
              <p>
                The mechanism should be set to relax at a rate where the
                restriction is completely eliminated after a period of six
                months to one year.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CIPPathtoactive;
