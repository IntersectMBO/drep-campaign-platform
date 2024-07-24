'use client';
import { Background } from '@/components/atoms/Background';
import CIPInfo from '@/components/1694.io/1694Info';
import React, { useEffect, useState } from 'react';
import CIPIntro from '@/components/1694.io/1694Intro';
import CIPMotivationInfo from '@/components/1694.io/1694MotivationInfo';
import ConversationsCard from '@/components/1694.io/ConversationsCard';
import CIPSpecifications from '@/components/1694.io/1694Specifications';
import CIPDRepInfo from '@/components/1694.io/1694DRepInfo';
import CIPGovernanceActions from '@/components/1694.io/1694GovernanceActions';
import CIPRationale from '@/components/1694.io/1694Rationale';
import CIPChangelog from '@/components/1694.io/1694Changelog';
import CIPPathtoactive from '@/components/1694.io/1694Pathtoactive';
import CIPAcknowledgments from '@/components/1694.io/1694Acknowledgments';
import {Header} from '@/components/atoms/Header';
import Footer from '@/components/atoms/Footer';
import CopyRight from '@/components/1694.io/CopyRight';
import ScrollToTop from '@/components/atoms/ScrollToTop';
import TranslationBlock from '@/components/1694.io/TranslationBlock';

const Page = () => {
  const [raw, setRaw] = useState(null);
  const [comments, setComments] = useState(null);
  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const cip = await (
          await fetch(
            'https://raw.githubusercontent.com/cardano-foundation/CIPs/master/CIP-1694/README.md',
          )
        ).text();
        const comments = await (
          await fetch(
            'https://api.github.com/repos/cardano-foundation/CIPs/issues/380/comments',
          )
        ).json();
        setRaw(cip);
        setComments(comments);
      } catch (error) {
        console.error('Error fetching Markdown:', error);
      }
    }

    fetchMarkdown();
  }, []);

  return (
    <div className="bg-[url(/img/1694-asset-1.png)] bg-auto bg-right-top bg-no-repeat">
      <Background>
        <Header />
        {/* Disabled till further notice */}
        {/* <TranslationBlock/> */}
        <ScrollToTop/>
        <CIPIntro />
        <CIPInfo />
        <CIPMotivationInfo />
        <ConversationsCard conversations={comments} />
        <CIPSpecifications />
        <CIPDRepInfo />
        <CIPGovernanceActions />
        <CIPRationale />
        <CIPChangelog />
        <CIPPathtoactive />
        <CIPAcknowledgments />
        <CopyRight />
        <Footer />
      </Background>
    </div>
  );
};

export default Page;
