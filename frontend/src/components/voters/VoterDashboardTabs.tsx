import { Tab, Tabs } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const VoterDashboardTabs = () => {
  const { voterId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (pathname.includes('impact')) setActiveTab(1);
  }, []);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <div>
      <Tabs value={activeTab} onChange={handleChange}>
        <Tab
          disableRipple
          label="Profile"
          sx={{
            textTransform: 'none',
            borderBottom: activeTab === 0 && '1px solid #0033Ad',
            backgroundColor: activeTab === 0 && 'white',
            color: activeTab === 0 && '#0033ad',
            paddingX: 6,
            borderTopLeftRadius: activeTab === 0 && '5px',
            borderTopRightRadius: activeTab === 0 && '5px',
          }}
          onClick={() => router.push(`/voters/${voterId}`)}
        />
        <Tab
          disableRipple
          label="Impact"
          sx={{
            textTransform: 'none',
            borderBottom: activeTab === 1 && '1px solid #0033Ad',
            backgroundColor: activeTab === 1 && 'white',
            color: activeTab === 1 && '#0033ad',
            paddingX: 6,
            borderTopLeftRadius: activeTab === 1 && '5px',
            borderTopRightRadius: activeTab === 1 && '5px',
          }}
          onClick={() => router.push(`/voters/${voterId}/impact`)}
        />
      </Tabs>
    </div>
  );
};

export default VoterDashboardTabs;
