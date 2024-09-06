import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { useScreenDimension } from '@/hooks';
import SingleNote from '../dreps/notes/SingleNote';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import EpochTimelineCard from '../atoms/EpochTimelineCard';
import DrepVoteTimelineCard from '../atoms/DrepVoteTimelineCard';

export default function DrepTimelineWaterfall({
  activity = [],
}: {
  activity: any[];
}) {
  const { isMobile, screenWidth } = useScreenDimension();
  const { stakeKeyBech32, isEnabled } = useCardano();
  const { isLoggedIn } = useDRepContext();

  return (
    <Timeline
      sx={{
        ...((isMobile || screenWidth < 1024) && {
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }),
      }}
      position={screenWidth < 1024 ? 'right' : 'alternate-reverse'}
    >
      {activity &&
        activity.length > 0 &&
        activity.map((item, epochIndex) => (
          <>
            {item.type === 'note' && (
              <div
                className="flex w-full flex-col items-center space-y-2"
                key={epochIndex}
              >
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector
                    className="h-10 border-2 border-dotted border-gray-300"
                    sx={{ backgroundColor: 'white' }}
                  />
                </TimelineSeparator>
                <div className="w-full">
                  <SingleNote
                    note={item}
                    currentVoter={stakeKeyBech32}
                    isEnabled={isEnabled}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              </div>
            )}
            {item.type === 'epoch' && (
              <div
                className="flex w-full flex-col items-center space-y-2"
                key={epochIndex}
              >
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector
                    className="h-10 border-2 border-dotted border-gray-300"
                    sx={{ backgroundColor: 'white' }}
                  />
                </TimelineSeparator>
                <EpochTimelineCard epoch={item} />
              </div>
            )}
            {item.type === 'registration' && (
              <div className="flex w-full flex-col items-center space-y-2">
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector
                    className="h-10 border-2 border-dotted border-gray-300"
                    sx={{ backgroundColor: 'white' }}
                  />
                </TimelineSeparator>
                <div className="flex flex-row items-center justify-center gap-2 text-nowrap text-gray-500">
                  <img src="/svgs/loader.svg" alt="" />
                  <p>Registered, Epoch {item?.epoch_no}</p>
                </div>
              </div>
            )}
            {item.type === 'voting_activity' && (
              <TimelineItem key={epochIndex}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector
                    className="h-10 border-2 border-dotted border-gray-300"
                    sx={{ backgroundColor: 'white' }}
                  />
                </TimelineSeparator>
                <TimelineContent>
                  <DrepVoteTimelineCard item={item} />
                </TimelineContent>
              </TimelineItem>
            )}
          </>
        ))}
    </Timeline>
  );
}
