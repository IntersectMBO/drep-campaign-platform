import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Box, Skeleton } from '@mui/material';
import React from 'react';
import GovActionLoader from './GovActionLoader';
import DelegationItemLoader from './DelegationItemLoader';

function DRepTimelineLoader() {
  return (
    <div>
      <Timeline position="alternate-reverse">
        <div className="flex w-full flex-col items-center space-y-2">
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <Box
            sx={{
              width: '100%',
              height: 70,
              bgcolor: 'rgba(0, 0, 0, 0.11)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'top',
              padding: '12px',
            }}
          >
            <div className="flex flex-col gap-2">
              <Skeleton
                variant="rectangular"
                width={140}
                height={20}
                className="rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={20}
                className="rounded-xl"
              />
            </div>
            <Skeleton
              variant="rectangular"
              width={140}
              height={20}
              className="rounded-xl"
            />
          </Box>
          <TimelineSeparator>
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
        </div>
        <div className="flex w-full flex-col items-center space-y-2">
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <Box
            sx={{
              width: '100%',
              height: 70,
              bgcolor: 'rgba(0, 0, 0, 0.11)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'top',
              padding: '12px',
            }}
          >
            <div className="flex flex-col gap-2">
              <Skeleton
                variant="rectangular"
                width={140}
                height={20}
                className="rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={20}
                className="rounded-xl"
              />
            </div>
            <Skeleton
              variant="rectangular"
              width={140}
              height={20}
              className="rounded-xl"
            />
          </Box>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
        </div>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <GovActionLoader />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <GovActionLoader />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <DelegationItemLoader />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              className="h-10 border-2 border-dotted border-gray-300"
              sx={{ backgroundColor: 'white' }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <DelegationItemLoader />
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}

export default DRepTimelineLoader;
