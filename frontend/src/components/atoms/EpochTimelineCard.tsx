import React from 'react';
type EpochTimelineCardProps = {
  epoch: any;
};
const EpochTimelineCard = ({ epoch }: EpochTimelineCardProps) => {
  return (
    <div className="w-full rounded-xl bg-[#6FDFD8] p-3">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-fit flex-nowrap items-center gap-2 text-nowrap bg-white p-1 rounded-xl ">
            <img src="/svgs/clock.svg" alt="New Epoch" className='w-5 h-5' />
            <p className='text-xs'>New Epoch</p>
          </div>
          <div>
            {epoch?.start_time && (
              <p className='text-xs'>{new Date(epoch?.start_time).toDateString()}</p>
            )}
          </div>
        </div>
        <p className='font-bold'>Epoch {epoch?.no}</p>
      </div>
    </div>
  );
};

export default EpochTimelineCard;
