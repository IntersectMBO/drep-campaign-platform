import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../atoms/Button';
import BecomeADRepButton from './BecomeADRepButton';
import HoverChip from '../atoms/HoverChip';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';

const TranslationBlock = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
  }, []);
  const toggleTooltip = () => {
    setIsTooltipActive(!isTooltipActive);
  };
  const flags = [
    {
      link: '#',
      icon: '/flags/GR.png',
    },
    {
      link: '#',
      icon: '/flags/SA.png',
    },
    {
      link: '#',
      icon: '/flags/DE.png',
    },
    {
      link: '#',
      icon: '/flags/FR.png',
    },
    {
      link: '#',
      icon: '/flags/NL.png',
    },
    {
      link: '#',
      icon: '/flags/JP.png',
    },
    {
      link: '#',
      icon: '/flags/KR.png',
    },
    {
      link: '#',
      icon: '/flags/ID.png',
    },
    {
      link: '#',
      icon: '/flags/PT.png',
    },
    {
      link: '#',
      icon: '/flags/ES.png',
    },
    {
      link: '#',
      icon: '/flags/KE.png',
    },
  ];

  return (
    <div className="bg-white bg-opacity-50">
      <div className="base_container flex flex-row items-center justify-start pb-3">
        {!isMobile ? (
          <>
            <div className="mr-10 flex shrink-0 flex-row items-center justify-center gap-2">
              <p>Translation</p>
              <HoverChip
                icon={'/info-circle.svg'}
                text={
                  'Translations done through rewarded bounties at the Catalyst Swarm Bounty Board. Donations to Catalyst Swarm'
                }
                position="bottom"
                textToCopy="Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs"
              />
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
                expandIcon={<img src="/chevron-down.svg" alt="down" />}
                aria-controls="panel1-content"
                id="panel1-header"
                onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
              >
                <div className="mr-5 flex shrink-0 flex-row items-center justify-center gap-2 lg:mr-10">
                  <p>Translation</p>
                  <HoverChip
                    icon={'/info-circle.svg'}
                    handleClick={toggleTooltip}
                    text={
                      'Translations done through rewarded bounties at the Catalyst Swarm Bounty Board. Donations to Catalyst Swarm'
                    }
                    position="bottom"
                    textToCopy="Addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs"
                  />
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
