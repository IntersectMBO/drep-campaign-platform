'use client';
import Link from 'next/link';
import React from 'react';
import { urls } from '@/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="w-full flex-col items-center justify-center bg-zinc-800 py-2 text-white">
      <div className="mb-12 flex items-center justify-center p-5">
        <img
          src="/svgs/govtool-1694-white.svg"
          alt="Sancho logo"
          width={'300px'}
          height={'77px'}
        />
      </div>
      <div className="mb-16 flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 font-bold text-neutral-300 px-4">
        <Link target='_blank' href={urls.govToolUrl}>GovTool</Link>
        <Link target='_blank' href="//www.lidonation.com">Lido Nation</Link>
        <Link target='_blank' href="//catalystexplorer.com">Catalyst Explorer</Link>
        <Link target='_blank' href="//cips.cardano.org">Cardano CIPs</Link>
      </div>
      <div className="mb-4 flex items-center justify-center gap-3 font-bold">
        <a target='_blank'
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900"
          href="//www.facebook.com/lidonation"
        >
          <img src="/svgs/fb.svg" alt="Facebook" />
        </a>
        <a target='_blank'
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900"
          href="#"
        >
          <img src="/svgs/ig.svg" alt="Instagram" />
        </a>
        <a target='_blank'
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900"
          href="//gitlab.lidonation.com/explore"
        >
          <img src="/svgs/github.svg" alt="Github" />
        </a>
      </div>
      <div className="text-center text-sm text-white">
        &copy; {currentYear} A LIDO Nation Community Project
      </div>
    </div>
  );
};

export default Footer;
