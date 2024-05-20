import React from 'react';
import CIPIntroText from './1694IntroText';
import DRepIntroImgs from '../molecules/DRepIntroImgs';

const CIPIntro = () => {
  return (
    <div className="base_container flex w-full flex-col-reverse gap-4 lg:flex-row items-center py-16">
      <CIPIntroText />
      <DRepIntroImgs/>
    </div>
  );
};

export default CIPIntro;
