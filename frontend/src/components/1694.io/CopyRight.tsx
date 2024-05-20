import React from 'react';
import HotLinks from './HotLinks';

const CopyRight = () => {
  return (
    <div className="bg-gradient-to-b from-[#E9EFFF] to-[#FFFFFF] py-10">
      <div className="base_container">
        <p className="text-5xl font-bold text-zinc-800">Copyright</p>
      </div>
      <HotLinks />
      <div className="base_container">
        <p>
          This CIP is licensed under{' '}
          <a
            className="underline"
            href="https://creativecommons.org/licenses/by/4.0/legalcode"
          >
            CC-BY-4.0{' '}
          </a>
        </p>
        <ul className="ml-5 flex list-decimal flex-col gap-2">
          <li>
            A formal description of the current rules for governance actions is
            given in the{' '}
            <a
              className="underline"
              href="https%3A%2F%2Fgithub.com%2Finput-output-hk%2Fcardano-ledger%2Freleases%2Flatest%2Fdownload%2Fshelley-ledger.pdf"
            >
              Shelley ledger specification.
            </a>
            <ul className="ml-5 flex list-disc flex-col gap-2">
              <li>
                For protocol parameter changes (including hard forks), the PPUP
                transition rule (Figure 13) describes how protocol parameter
                updates are processed, and the NEWPP transition rule (Figure 43)
                describes how changes to protocol parameters are enacted.
              </li>
              <li>
                For funds transfers, the DELEG transition rule (Figure 24)
                describes how MIR certificates are processed, and the MIR
                transition rule (Figure 55) describes how treasury and reserve
                movements are enacted.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CopyRight;
