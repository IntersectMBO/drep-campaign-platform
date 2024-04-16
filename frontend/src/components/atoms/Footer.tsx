"use client";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className=" bg-dark-indigo flex-col items-center justify-center text-white py-2 w-fullScale">
      <div className="flex items-center justify-center p-5 mb-12">
        <img src="/sancho-white.svg" alt="Sancho logo" width={'300px'} height={'77px'}/>
      </div>
      <div className="flex items-center justify-center gap-4 font-bold mb-16 text-bottom-nav-text">
        <Link href="#">Voltaire </Link>
        <Link href="#">Sancho Gov Tools</Link>
        <Link href="#">Lido Nation</Link>
        <Link href="#">Catalyst Explorer</Link>
        <Link href="#">Cardano CIPs</Link>
      </div>
      <div className="flex items-center justify-center gap-3 font-bold mb-4">
        <a className="bg-dark-blue w-socialButtons h-socialButtons rounded-full flex items-center justify-center" href="#"  >
          <img src="/fb.svg" alt="Facebook" />
        </a>
        <a className="bg-dark-blue w-socialButtons h-socialButtons rounded-full flex items-center justify-center" href="#">
          <img src="/ig.svg" alt="Instagram" />
        </a>
        <a className="bg-dark-blue w-socialButtons h-socialButtons rounded-full flex items-center justify-center" href="#">
          <img src="/github.svg" alt="Github" />
        </a>
      </div>
      <div className="text-pure-white text-center text-sm">
        &copy; {currentYear} A LIDO Nation Project
      </div>
    </div>
  );
};

export default Footer;
