'use client';
import { Background } from '@/components/atoms/Background';
import Footer from '@/components/atoms/Footer';
import { Header } from '@/components/atoms/Header';
import VoterDashboardTabs from '@/components/voters/VoterDashboardTabs';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Background>
      <Header />
      <div className="base_container w-full">
        <VoterDashboardTabs />
        {children}
        </div>
      <Footer />
    </Background>
  );
};

export default layout;
