"use client";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="absolute bottom-0 z-0 bg-[#242232] flex-col items-center justify-center text-white py-2 w-full">
      <div className="flex items-center justify-center p-5 mb-12">
        <img src="/sancho-white.svg" alt="Sancho logo" width={'300px'} height={'77px'}/>
      </div>
      <div className="flex items-center justify-center gap-4 font-bold mb-16 text-[#C7CDD1]">
        <a href="#">Voltaire </a>
        <a href="#">Sancho Gov Tools</a>
        <a href="#">Lido Nation</a>
        <a href="#">Catalyst Explorer</a>
        <a href="#">Cardano CIPs</a>
      </div>
      <div className="flex items-center justify-center gap-3 font-bold mb-4">
        <a className="bg-[#00123D] w-[40px] h-[40px] rounded-full flex items-center justify-center" href="#"  >
          <img src="/fb.svg" alt="Facebook" />
        </a>
        <a className="bg-[#00123D] w-[40px] h-[40px] rounded-full flex items-center justify-center" href="#">
          <img src="/ig.svg" alt="Instagram" />
        </a>
        <a className="bg-[#00123D] w-[40px] h-[40px] rounded-full flex items-center justify-center" href="#">
          <img src="/github.svg" alt="Github" />
        </a>
      </div>
      <div className="text-center text-sm">
        &copy; {currentYear} A LIDO Nation Project
      </div>
    </div>
  );
};

export default Footer;
