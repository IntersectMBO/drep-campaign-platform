import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../atoms/Button';
import BecomeADRepButton from './BecomeADRepButton';
import HoverChip, { HtmlTooltip } from '../atoms/HoverChip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { useScreenDimension } from '@/hooks/useScreenDimension';

const TranslationBlock = () => {
  
  const {isMobile} = useScreenDimension();
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  
  const toggleTooltip = () => {
    setIsTooltipActive(!isTooltipActive);
  };
  const flags = [
    {
      link: '#',
      icon: '/img/flags/GR.png',
    },
    {
      link: '#',
      icon: '/img/flags/SA.png',
    },
    {
      link: '#',
      icon: '/img/flags/DE.png',
    },
    {
      link: '#',
      icon: '/img/flags/FR.png',
    },
    {
      link: '#',
      icon: '/img/flags/NL.png',
    },
    {
      link: '#',
      icon: '/img/flags/JP.png',
    },
    {
      link: '#',
      icon: '/img/flags/KR.png',
    },
    {
      link: '#',
      icon: '/img/flags/ID.png',
    },
    {
      link: '#',
      icon: '/img/flags/PT.png',
    },
    {
      link: '#',
      icon: '/img/flags/ES.png',
    },
    {
      link: '#',
      icon: '/img/flags/KE.png',
    },
  ];

  return (
    <div className="bg-white bg-opacity-50">
      <div className="base_container flex flex-row items-center justify-start pb-3">
        {!isMobile ? (
          <>
            <div className="mr-10 flex shrink-0 flex-row items-center justify-center gap-2">
              <p>Translation</p>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      Translations done through rewarded bounties at the
                      Catalyst Swarm Bounty Board. Donations to Catalyst Swarm
                      can be done through: Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs
                    </Typography>
                    <CopyToClipboard
                      textToCopy="Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs"
                      onCopy={() => {
                        console.log('copied!');
                      }}
                      className="clipboard-text cursor-pointer"
                    >
                      <img src="/svgs/copy.svg" alt="copy" />
                    </CopyToClipboard>
                  </React.Fragment>
                }
                placement="bottom"
                arrow
              >
                <img src="/svgs/info-circle.svg" alt="info" />
              </HtmlTooltip>
            </div>
            <div className="flex flex-row gap-5">
              {flags.map((flag) => (
                <div key={flag.icon} className="cursor-pointer">
                  <img src={flag.icon} alt="Flag" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <Accordion
              expanded={!isTooltipActive && isAccordionExpanded}
              className="bg-transparent shadow-none"
            >
              <AccordionSummary
                expandIcon={<img src="/svgs/chevron-down.svg" alt="down" />}
                aria-controls="panel1-content"
                id="panel1-header"
                onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
              >
                <div className="mr-5 flex shrink-0 flex-row items-center justify-center gap-2 lg:mr-10">
                  <p>Translation</p>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                          Translations done through rewarded bounties at the
                          Catalyst Swarm Bounty Board. Donations to Catalyst
                          Swarm can be done through: Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs
                        </Typography>
                        <CopyToClipboard
                          textToCopy="Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs"
                          onCopy={() => {
                            console.log('copied!');
                          }}
                          className="clipboard-text cursor-pointer"
                        >
                          <img src="/svgs/copy.svg" alt="copy" onClick={toggleTooltip} />
                        </CopyToClipboard>
                      </React.Fragment>
                    }
                    placement="bottom"
                    arrow
                    open={isTooltipActive}
                  >
                    <img src="/svgs/info-circle.svg" alt="info" onClick={toggleTooltip} />
                  </HtmlTooltip>
                </div>
              </AccordionSummary>
              <AccordionDetails className="grid grid-cols-3 gap-2">
                {flags.map((flag) => (
                  <div
                    key={flag.icon}
                    className="flex cursor-pointer items-center justify-center pt-1"
                  >
                    <img src={flag.icon} alt="Flag" />
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationBlock;
