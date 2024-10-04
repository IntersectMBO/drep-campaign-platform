'use client';
import VoterImpact from '@/components/voters/VoterImpact';
import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-3 bg-white px-6 py-4">
        <VoterImpact />
      </div>
    </div>
  );
};

export default page;
