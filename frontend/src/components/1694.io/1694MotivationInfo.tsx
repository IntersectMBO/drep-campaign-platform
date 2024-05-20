import React from 'react';

const CIPMotivationInfo = () => {
  return (
    <div className="rounded-t-3xl bg-blue-800">
      <div className="base_container text-white">
        <div className="py-20 text-5xl lg:text-6xl font-bold text-violet-50">
          <p>Motivation:</p>
          <p>why is this CIP necessary?</p>
        </div>
        <div className="py-10">
          <div className="mb-7 flex flex-col items-center justify-center lg:flex-row gap-10">
            <div className="flex lg:w-[30%] items-center justify-center">
              <img src="/whiteboard.png" alt="Whiteboard" />
            </div>
            <section className="lg:w-[70%]">
              <p className="mb-4 text-4xl font-bold">Goal</p>
              <div className="flex flex-col gap-9">
                <p>
                  We're heading into the age of Voltaire, laying down the
                  foundations for decentralized decision-making. This CIP
                  describes a mechanism for on-chain governance that will
                  underpin the Voltaire phase of Cardano. The CIP builds on and
                  extends the original Cardano governance scheme that was based
                  on a fixed number of governance keys. It aims to provide a
                  first step that is both valuable and, importantly, is also
                  technically achievable in the near term as part of the
                  proposed Voltaire governance system.
                </p>
                <p>
                  It also seeks to act as a jumping-off point for continuing
                  community input, including on appropriate threshold settings
                  and other on-chain settings.
                </p>
                <p>
                  Subsequent proposals may adapt and extend this proposal to
                  meet emerging governance needs.
                </p>
              </div>
            </section>
          </div>
          <div>
            <hr />
          </div>
        </div>
        <div className="py-10">
          <div className="mb-7 flex flex-col items-center justify-center lg:flex-row gap-10">
            <div className="flex lg:w-[30%] items-center justify-center">
              <img src="/windmills.png" alt="Windmills" />
            </div>
            <section className="lg:w-[70%]">
              <p className="mb-4 text-4xl font-bold">
                Current governance mechanism design
              </p>
              <div>
                <p>
                  The on-chain Cardano governance mechanism that was introduced
                  in the Shelley ledger era is capable of:
                </p>
                <ul className="ml-5 mt-2 flex list-decimal flex-col gap-2">
                  <li>
                    modifying the values of the protocol parameters (including
                    initiating "hard forks")
                  </li>
                  <li>
                    transferring Ada out of the reserves and the treasury (and
                    also moving Ada between the reserves and the treasury)
                  </li>
                </ul>
                <p>
                  In the current scheme, governance actions are initiated by
                  special transactions that require Quorum-Many authorizations
                  from the governance keys (5 out of 7 on the Cardano mainnet)1.
                  Fields in the transaction body provide details of the proposed
                  governance action: either i) protocol parameter changes; or
                  ii) initiating funds transfers. Each transaction can trigger
                  both kinds of governance actions, and a single action can have
                  more than one effect (e.g. changing two or more protocol
                  parameters).
                </p>
                <ul className="ml-5 flex list-disc flex-col gap-2">
                  <li>
                    Protocol parameter updates use transaction field nº6 of the
                    transaction body.
                  </li>
                  <li>
                    Movements of the treasury and the reserves use Move
                    Instantaneous Rewards (abbrev. MIR) certificates.
                  </li>
                </ul>
                <p>
                  Properly authorized governance actions are applied on an epoch
                  boundary (they are enacted).
                </p>
              </div>
            </section>
          </div>
          <div>
            <hr />
          </div>
        </div>
        <div className="py-10">
          <div className="mb-7 flex flex-col items-center justify-center lg:flex-row gap-10">
            <div className="flex lg:w-[30%] items-center justify-center">
              <img src="/interface.png" alt="Interface" />
            </div>
            <section className="lg:w-[70%]">
              <p className="mb-4 text-4xl font-bold">Hard Forks</p>
              <p>
                One of the protocol parameters is sufficiently significant to
                merit special attention: changing the major protocol version
                enables Cardano to enact controlled hard forks. This type of
                protocol parameter update therefore has a special status, since
                stake pools must upgrade their nodes so they can support the new
                protocol version once the hard fork is enacted.
              </p>
            </section>
          </div>
          <div>
            <hr />
          </div>
        </div>
        <div className="py-10">
          <div className="mb-7 flex flex-col items-center justify-center lg:flex-row gap-10">
            <div className="flex lg:w-[30%] items-center justify-center">
              <img src="/user-selecting.png" alt="User-selecting" />
            </div>
            <section className="lg:w-[70%]">
              <p className="mb-4 text-4xl font-bold">
                Shortcomings of the Shelley governance design
              </p>
              <p>
                The Shelley governance design was intended to provide a simple,
                transitional approach to governance. This proposal aims to
                address a number of shortcomings with that design that are
                apparent as we move into Voltaire.
              </p>
              <ul className="ml-5 mt-2 flex list-decimal flex-col gap-2">
                <li>
                  The Shelley governance design gives no room for active
                  on-chain participation of Ada holders. While changes to the
                  protocol are usually the results of discussions with selected
                  community actors, the process is currently driven mainly by
                  the founding entities. Ensuring that everyone can voice their
                  concern is cumbersome, and can be perceived as arbitrary at
                  times.
                </li>
                <li>
                  Movements from the treasury constitute a critical and
                  sensitive topic. However, they can be hard to track. It is
                  important to have more transparency and more layers of control
                  over these movements.
                </li>
                <li>
                  While they need to be treated specially by SPOs, hard forks
                  are not differentiated from other protocol parameter changes.
                </li>
                <li>
                  Finally, while there is currently a somewhat common vision for
                  Cardano that is shared by its founding entities and also by
                  many community members, there is no clearly defined document
                  where these guiding principles are recorded. It makes sense to
                  leverage the Cardano blockchain to record the shared Cardano
                  ethos in an immutable fashion, as a formal Cardano
                  Constitution.
                </li>
              </ul>
            </section>
          </div>
          <div>
            <hr />
          </div>
        </div>
        <div className="py-10">
          <p className="mb-4 text-4xl font-bold">Out of Scope</p>
          <div className="flex flex-col gap-5 lg:grid grid-cols-3 lg:gap-20 py-5">
            <div className="col-span-1 flex flex-col gap-2">
              <p className="mb-3 text-xl font-bold">
                The contents of the constitution
              </p>
              <p>
                This CIP focuses only on on-chain mechanisms. The provisions of
                the initial constitution are extremely important, as are any
                processes that will allow it to be amended. These merit their
                own separate and focused discussion.
              </p>
            </div>
            <div className="col-span-1 flex flex-col gap-10">
              <div>
                <p className="mb-3 text-xl font-bold">Legal issues</p>
                <p>
                  Any potential legal enforcement of either the Cardano protocol
                  or the Cardano Constitution are completely out of scope for
                  this CIP.
                </p>
              </div>
              <div>
                <p className="mb-3 text-xl font-bold">
                  The contents Off chain standards for governance actions
                </p>
                <p>
                  The Cardano community must think deeply about the correct
                  standards and processes for handling the creation of the
                  governance actions that are specified in this CIP. In
                  particular, the role of Project Catalyst in creating treasury
                  withdrawal actions is completely outside the scope of this
                  CIP.
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-around">
              <div className='flex flex-col gap-1'>
                <p className="mb-3 text-xl font-bold">
                  The membership of the constitutional committee
                </p>
                <p>This is an off-chain issue.</p>
              </div>
              <div>
                <p className="mb-3 text-xl font-bold">
                  Ada holdings and delegation
                </p>
                <p>
                  How any private companies, public or private institutions,
                  individuals etc. choose to hold or delegate their Ada,
                  including delegation to stake pools or DReps, is outside the
                  scope of this CIP.
                </p>
              </div>
            </div>
          </div>
          <div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIPMotivationInfo;
