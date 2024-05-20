import React, { useEffect, useState } from 'react';

const DRepIntroImgs = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);
  return (
    <div className="img_container relative flex shrink-0 items-center justify-center my-5">
      <div
        id="rainbow"
        className="responsive-img absolute -left-20 top-20 z-20"
      >
        <img src="/img/faces/img1.png" alt="Img1" width={`${isMobile?'70%':'90%'}`}/>
      </div>
      <div id="dull" className="responsive-img left-30 absolute -top-20 z-30">
        <img src="/img/faces/img2.png" alt="Img2" width={`${isMobile?'70%':'90%'}`}/>
      </div>
      <div id="main" className="z-10">
        <img src="/img/faces/img3.png" alt="Img3" />
      </div>
      <div
        id="inverse"
        className="responsive-img absolute -right-10 -top-10 z-30"
      >
        <img src="/img/faces/img4.png" alt="Img4" width={`${isMobile?'70%':'90%'}`}/>
      </div>
    </div>
  );
};

export default DRepIntroImgs;
