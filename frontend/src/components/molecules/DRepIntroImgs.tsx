import React from "react";

const DRepIntroImgs = () => {
  return (
    <div className="drep_intro_radial_bg relative w-fullScale h-[100%]">
      {/* rainbow one */}
      <div className="absolute z-[10] top-24 left-0">
        <img src="/img/faces/img1.png" alt="Img1" width={"278px"} />
      </div>
      {/* the dull one */}
      <div className="absolute z-[11] top-12 left-52">
        <img src="/img/faces/img2.png" alt="Img2" width={"170px"} />
      </div>
      {/* feathered one */}
      <div className="absolute z-[9] bottom-0 right-5">
        <img src="/img/faces/img3.png" alt="Img3" width={"478px"} />
      </div>
      {/* inverse one */}
      <div className="absolute z-[11] top-20 right-10 ">
        <img width={"133px"} src="/img/faces/img4.png" alt="Img4" />
      </div>
    </div>
  );
};

export default DRepIntroImgs;
