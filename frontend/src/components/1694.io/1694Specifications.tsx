import React from 'react';
import HotLinks from './HotLinks';
import Separator from './Separator';

const CIPSpecifications = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E9EFFF] to-[#FFFFFF]">
      <div className="mx-auto flex max-w-xs flex-col items-center justify-center py-10 text-sm sm:max-w-lg lg:max-w-4xl">
        <div className="w-full">
          <p className="text-start text-4xl font-bold text-zinc-800 lg:text-6xl">
            Specification
          </p>
        </div>
        <HotLinks />
        <div className="flex items-center justify-center">
          <img src="/img/building.png" alt="Building" />
        </div>
        <div
          id="the-cardano-constitution"
          className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">The Cardano Constitution</p>
          <p>
            The Cardano Constitution is a text document that defines Cardano's
            shared values and guiding principles. At this stage, the
            Constitution is an informational document that unambiguously
            captures the core values of Cardano and acts to ensure its long-term
            sustainability. At a later stage, we can imagine the Constitution
            perhaps evolving into a smart-contract based set of rules that
            drives the entire governance framework. For now, however, the
            Constitution will remain an off-chain document whose hash digest
            value will be recorded on-chain. As discussed above, the
            Constitution is not yet defined and its content is out of scope for
            this CIP.
          </p>
        </div>
        <Separator />
        <div
          id="the-constitutional-committee"
          className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">The constitutional committee</p>
          <p>
            We define a constitutional committee which represents a set of
            individuals or entities (each associated with a Ed25519 or native or
            Plutus script credential) that are collectively responsible for
            ensuring that the Constitution is respected.
          </p>
          <p>
            Though it cannot be enforced on-chain, the constitutional committee
            is only supposed to vote on the constitutionality of governance
            actions (which should thus ensure the long-term sustainability of
            the blockchain) and should be replaced (via the no confidence
            action) if they overstep this boundary. Said differently, there is a
            social contract between the constitutional committee and the actors
            of the network. Although the constitutional committee could reject
            certain governance actions (by voting 'No' on them), they should
            only do so when those governance actions are in conflict with the
            Constitution.
          </p>
          <p>
            For example, if we consider the hypothetical Constitution rule "The
            Cardano network must always be able to produce new blocks", then a
            governance action that would reduce the maximum block size to 0
            would be, in effect, unconstitutional and so might not be ratified
            by the constitutional committee. The rule does not, however, specify
            the smallest acceptable maximum block size, so the constitutional
            committee would need to determine this number and vote accordingly.
          </p>
        </div>
        <Separator />
        <div
          id="state-of-no-confidence"
          className="my-5 flex  w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">State of no-confidence</p>
          <p>
            The constitutional committee is considered to be in one of the
            following two states at all times:
          </p>
          <ul className="ml-5 flex list-decimal flex-col gap-1">
            <li>a normal state (i.e. a state of confidence)</li>
            <li>a state of no-confidence </li>
          </ul>
          <p>
            In a state of no-confidence, the current committee is no longer able
            to participate in governance actions and must be replaced before any
            governance actions can be ratified (see below).
          </p>
        </div>
        <Separator />
        <div className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight">
          <p className="text-2xl font-bold">Constitutional committee keys</p>
          <p>
            The constitutional committee will use a hot and cold key setup,
            similar to the existing "genesis delegation certificate" mechanism.
          </p>
        </div>
        <Separator />
        <div
          id="replacing-the-constitutional-committee"
          className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">
            Replacing the constitutional committee
          </p>
          <p>
            The constitutional committee can be replaced via a specific
            governance action ("Update committee", described below) that
            requires the approval of both the <strong>SPOs</strong> and the{' '}
            <strong>DReps</strong>. The threshold for ratification might be
            different depending on if the governance is in a normal state or a
            state of no confidence.
          </p>
          <p>
            The new constitutional committee could, in principle, be identical
            to or partially overlap the outgoing committee as long as the action
            is properly ratified. This might happen, for example, if the
            electorate has collective confidence in all or part of the committee
            and wishes to extend its term of office.
          </p>
        </div>
        <Separator />
        <div
          id="size-of-the-constitutional-committee"
          className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">
            Size of the constitutional committee
          </p>
          <p>
            Unlike the Shelley governance design, the size of the constitutional
            committee is not fixed and can be any nonnegative number.It may be changed whenever a new committee is elected ("Update committee"). Likewise, the committee threshold (the
            fraction of committee Yes votes that are required to ratify
            governance actions) is not fixed and can also be varied by the
            governance action. This gives a great deal of flexibility to the
            composition of the committee. In particular, it is possible to elect
            an empty committee if the community wishes to abolish the
            constitutional committee entirely. Note that this is different from
            a state of no-confidence and still constitutes a governance system
            capable of enacting proposals.
          </p>
          <p>
            There will be a new protocol parameter for the minimal size of the
            committee, itself a nonnegative number called{' '}
            <strong className="font-bold">committeeMinSize</strong>.
          </p>
        </div>
        <Separator />
        <div
          id="terms"
          className="my-5 flex w-full flex-col items-start justify-center gap-5 font-extralight"
        >
          <p className="text-2xl font-bold">Terms</p>
          <p>
            Each newly elected constitutional committee will have a term.
            Per-member terms allow for a rotation scheme, such as a third of the
            committee expiring every year. Expired members can no longer vote.
            Member can also willingly resign early, which will be marked
            on-chain as an expired member.
          </p>
          <p>
            If the number of non-expired committee members falls below the
            minimal size of the committee, the constitutional committee will be
            unable to ratify governance actions. This means that only governance
            actions that don't require votes from the constitutional committee
            can still be ratified.
          </p>
          <p>
            For example, a committee of size five with a threshold of 60% a
            minimum size of three and two expired members can still pass
            governance actions if two non-expired members vote{' '}
            <strong className="font-bold">Yes</strong>. However, if one more
            member expires then the constitutional committee becomes unable to
            ratify any more governance actions.
          </p>
          <p>
            The maximum term is a governance protocol parameter, specified as a
            number of epochs. During a state of no-confidence, no action can be
            ratified, so the committee should plan for its own replacement if it
            wishes to avoid disruption.
          </p>
        </div>
        <Separator />
        <div id='guardrails-script' className="my-5 flex w-full flex-col items-start justify-center gap-5">
          <p className="text-2xl font-bold">Guardrails Script</p>
          <p>
            While the constitution is an informal, off-chain document, there
            will also be an optional script that can enforce some guidelines.
            This script acts to supplement the constitutional committee by
            restricting some proposal types. For example, if the community
            wishes to have some hard rules for the treasury that cannot be
            violated, a script that enforces these these rules can be voted in as the guardrails script.
          </p>
          <p>
            The guardrails script applies only to protocol parameter update and
            treasury withdrawal proposals.
          </p>
        </div>
        <Separator />
      </div>
    </div>
  );
};

export default CIPSpecifications;
