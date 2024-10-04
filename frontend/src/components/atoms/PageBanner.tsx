'use client';
import { useDRepContext } from '@/context/drepContext';
import { useGetNodeStatusQuery } from '@/hooks/useGetNodeStatusQuery';
import { Box, Slide, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PageBanner = () => {
  const [disablePolling, setDisablePolling] = useState(false);
  const { NodeStatus, isLoading, isFetching, isError, isFetchedAfterMount } =
    useGetNodeStatusQuery({ disablePolling });
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [nodeStats, setNodeStats] = useState(null);
  const {currentLocale}=useDRepContext();
  const dbNonDependentPages = [
    `/${currentLocale}`,
    `/${currentLocale}/dreps`,
    `/${currentLocale}/dreps/workflow/profile/new`,
    `/${currentLocale}/dreps/workflow/profile/update`,
  ];
  useEffect(() => {
    if (NodeStatus) {
      setNodeStats(NodeStatus);
      if (NodeStatus?.behindBy <= 30 && !isError) {
        setDisablePolling(true);
      }
    }
  }, [NodeStatus, isLoading, isFetching]);
  useEffect(() => {
    setShowBanner(renderCondition());
  }, [pathname, isFetchedAfterMount, isError, nodeStats]);
  const renderCondition = () => {
    return (
      isFetchedAfterMount &&
      !dbNonDependentPages.some((page) => pathname == page) &&
      (isError || (nodeStats && nodeStats?.behindBy >= 30))
    );
  };

  const renderStatus = () => {
    if (!nodeStats && !isError) return '-';
    if (nodeStats && !isError) {
      return nodeStats?.behindBy >= 30 ? 'Lagging' : 'Following';
    }
    if (isError) return 'Offline';
  };
  if (!showBanner) return null;

  return (
    <Slide in={showBanner} appear exit direction="down">
      <Box component={'div'} className="flex items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1">
          <Typography>Epoch:</Typography>
          <Typography>{nodeStats?.epoch_no || '-'}</Typography>
        </div>
        <div className="inline-flex items-center gap-1">
          <Typography>Slot:</Typography>
          <Typography>{nodeStats?.epoch_slot_no || '-'}</Typography>
        </div>
        <div className="inline-flex items-center gap-1">
          <Typography>Status:</Typography>
          <Typography
            className={`${renderStatus() === 'Offline' && 'text-extra_red'}`}
          >
            {renderStatus()}
          </Typography>
        </div>
        <div>
          <Typography variant="caption">
            {nodeStats &&
              `Last updated ${new Date(nodeStats?.time).toLocaleString('en-US')}`}
          </Typography>
        </div>
      </Box>
    </Slide>
  );
};

export default PageBanner;
